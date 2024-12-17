import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailSenderService } from './email-sender.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'SALES_REPORT',
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_QUEUE,
            noAck: false,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [EmailSenderService],
})
export class EmailSenderModule {}

// import { Injectable } from '@nestjs/common';
// import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailSenderService {
//   private transporter = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: process.env.MAILTRAP_USER,
//       pass: process.env.MAILTRAP_PASS,
//     },
//   });

//   @MessagePattern('send_email')
//   async sendEmail(@Payload() data: any, @Ctx() context: RmqContext) {
//     const channel = context.getChannelRef();
//     const originalMsg = context.getMessage();

//     try {
//       // Mock email sending
//       await this.transporter.sendMail({
//         from: 'sender@example.com',
//         to: data.email,
//         subject: 'Test Email',
//         text: 'This is a mock email',
//       });

//       // Acknowledge the message
//       channel.ack(originalMsg);
//       console.log('Email sent successfully!');
//     } catch (err) {
//       // Handle errors here
//       console.error('Failed to send email:', err);
//       channel.nack(originalMsg);
//     }
//   }
// }
