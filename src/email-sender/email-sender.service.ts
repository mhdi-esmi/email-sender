import { Injectable } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  @MessagePattern('sales-report')
  async sendEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Mock email sending
      await this.transporter.sendMail({
        from: 'sender@example.com',
        to: data.email,
        subject: 'Test Email',
        text: 'This is a mock email',
      });

      // Acknowledge the message
      channel.ack(originalMsg);
      console.log('Email sent successfully!');
    } catch (err) {
      // Handle errors here
      console.error('Failed to send email:', err);
      channel.nack(originalMsg);
    }
  }
}

// import { Injectable, Logger } from '@nestjs/common';
// // import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailSenderService {
//   private readonly logger = new Logger(EmailSenderService.name);

//   // Mock email sending function
//   async sendEmail(report: any): Promise<void> {
//     this.logger.log('Mock: Sending email with report...');
//     this.logger.log(`Report: ${JSON.stringify(report)}`);

//     // Simulate email delay
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.logger.log('Mock: Email sent successfully!');
//         resolve();
//       }, 500); // Simulated delay
//     });
//   }

//   async handleSalesReport(report: any): Promise<void> {
//     this.logger.log('Handling sales report...');
//     try {
//       await this.sendEmail(report);
//     } catch (error) {
//       this.logger.error('Error sending email:', error);
//       throw error;
//     }
//   }
// }
