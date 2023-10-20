import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());

  const port = process.env.APP_PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle('Agenda-Dev')
    .setDescription('Agenda-Dev API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .setExternalDoc('Download Collection', '/agenda-dev/docs-json')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  if (process.env?.NODE_ENV !== 'prod')
    SwaggerModule.setup('agenda-dev/docs', app, document);

  await app.listen(port);

  console.log(`Agenda-dev Listening ${port}`);
}
bootstrap();
