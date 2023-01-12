import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_CONNECTION],
        noAck: false,
        queue: 'notifications',
      },
    },
  );
  await app
    .listen()
    .then(() => logger.log('Micorservice online'))
    .catch((error) => logger.error(error.message));
}
bootstrap();
