import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmailSenderModule } from './email-sender/email-sender.module';

export async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailSenderModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  console.log('EmailSender Microservice is listening....');
  await app.listen();
}

bootstrap();
