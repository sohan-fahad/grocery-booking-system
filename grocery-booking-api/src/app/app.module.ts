import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { APIGatewayModule } from './api-gateway/api-gateway.module';
import { AuthMiddleware } from './middlewares';
import { HelpersModule } from './helpers/helper.module';
import { AllErrorResponseInterceptor } from '@src/interceptors/allRrrorResponse.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@src/interceptors/response.interceptor';

@Module({
    imports: [DatabaseModule, APIGatewayModule, HelpersModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllErrorResponseInterceptor,
        },

        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },

    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude({ path: 'web/auth*', method: RequestMethod.ALL })
            .forRoutes(
                { path: 'admin/*', method: RequestMethod.ALL },
                { path: 'user/*', method: RequestMethod.ALL },
            );
    }
}
