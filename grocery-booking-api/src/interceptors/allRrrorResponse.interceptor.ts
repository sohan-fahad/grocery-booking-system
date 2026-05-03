import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
//   import * as Sentry from '@sentry/nestjs';
import { Request } from 'express';

@Catch()
export class AllErrorResponseInterceptor implements ExceptionFilter {
    constructor() { }

    catch(exception: any, host: ArgumentsHost) {
        //   Sentry.captureException(exception);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const req: Request = ctx.getRequest();

        let statusCode: number;
        let errorMessages: string[] = [exception.message];

        if (exception instanceof TypeError) {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

            if (exception.message) {
                errorMessages = [exception.message];
            } else {
                errorMessages = ['Internal Server Error'];
            }
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            if (
                exception?.message &&
                exception.message.includes(
                    'duplicate key value violates unique constraint',
                )
            ) {
                const field = (exception.cause as any)?.detail
                    .split('Key (')[1]
                    .split(')')[0];
                errorMessages = [`${field} already exists`];
                statusCode = HttpStatus.CONFLICT;
            } else if (
                exception?.message &&
                exception.message.includes('null value in column')
            ) {
                const field = (exception as any).column;
                errorMessages = [`${field} is required`];
                statusCode = HttpStatus.BAD_REQUEST;
            }
            errorMessages = errorMessages ? errorMessages : ['Internal Server Error'];
            statusCode = statusCode ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            const res: any = exception.getResponse();
            if (exception instanceof ForbiddenException) {
                errorMessages = ['Unauthorized request'];
            } else {
                errorMessages =
                    typeof res.message === 'string' ? [res.message] : res.message;
            }
        } else {
            if (
                exception?.message &&
                exception.message.includes(
                    'duplicate key value violates unique constraint',
                )
            ) {
                const field = exception.detail.split('Key (')[1].split(')')[0];
                errorMessages = [`${field} already exists`];
                statusCode = HttpStatus.CONFLICT;
            } else if (
                exception?.message &&
                exception.message.includes('null value in column')
            ) {
                const field = exception.column;
                errorMessages = [`${field} is required`];
                statusCode = HttpStatus.BAD_REQUEST;
            }
            errorMessages = errorMessages ? errorMessages : ['Internal Server Error'];
            statusCode = statusCode ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const res = {
            success: false,
            statusCode: statusCode,
            message:
                Array.isArray(errorMessages) && errorMessages?.length
                    ? errorMessages[0]
                    : 'something went wrong',
            errorMessages,
            duration: Date.now() - req['startedAt'],
        };
        response.status(statusCode).json(res);
    }
}