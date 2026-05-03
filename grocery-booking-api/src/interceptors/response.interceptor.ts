import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventResponse, SuccessResponse } from '@src/app/types';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor() { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((content: any) => {

                if (!content) {
                    return new SuccessResponse(
                        'Successful empty response',
                        null,
                        null,
                    );
                }

                if (content instanceof EventResponse) {
                    console.log('content instanceof EventResponse', content);

                    return content;
                } else if (content instanceof SuccessResponse) {
                    if (
                        content.data &&
                        Array.isArray(content.data) &&
                        content.data.length === 2 &&
                        typeof content.data[1] === 'number'
                    ) {
                        content.data = content.data[0];
                    }

                    return content;
                } else if (
                    typeof content === 'object' &&
                    content.hasOwnProperty('success') &&
                    content.hasOwnProperty('statusCode')
                ) {
                    return content;
                } else if (typeof content === 'object') {
                    return new SuccessResponse('Successful response', content);
                } else {
                    throw new HttpException(
                        'Something went wrong',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }),
        );
    }
}