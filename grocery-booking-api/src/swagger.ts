import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV } from './env';

const defaultSwaggerOpts = {
    swaggerOptions: {
        docExpansion: false,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
    },
};

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle(ENV.api.API_TITLE)
        .setDescription(ENV.api.API_DESCRIPTION)
        .setVersion(ENV.api.API_VERSION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document, defaultSwaggerOpts);
}
