import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';
import { join } from 'path';
import { ENV } from './env';
import { setupSwagger } from './swagger';



const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.use(urlencoded({ extended: true }));

  app.use(
    json({
      limit: '10mb',
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.setGlobalPrefix(ENV.api.API_PREFIX);

  setupSwagger(app);

  await app.listen(ENV.port);
  logger.log("🚀 ~ bootstrap ~ ENV.port:", ENV.port)

  logger.log(
    `🚀🚀🚀🚀 Application is running on: ${await app.getUrl()} 🚀🚀🚀🚀`
  );

  logger.log(
    `📖📖📖 Documentation is available on: ${await app.getUrl()}/docs 📖📖📖`
  );

}
bootstrap();
