import { Module } from '@nestjs/common';

import { EmailSenderModule } from './email-sender/email-sender.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailSenderModule,
  ],
})
export class AppModule {}
