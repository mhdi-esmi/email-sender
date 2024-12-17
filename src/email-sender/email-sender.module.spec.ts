import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderModule } from './email-sender.module';
import { EmailSenderService } from './email-sender.service';

describe('EmailSenderModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EmailSenderModule],
    }).compile();
  });

  it('should be defined', () => {
    const emailSenderModule = module.get<EmailSenderModule>(EmailSenderModule);
    expect(emailSenderModule).toBeDefined();
  });

  it('should provide EmailSenderService', () => {
    const emailSenderService =
      module.get<EmailSenderService>(EmailSenderService);
    expect(emailSenderService).toBeDefined();
  });
});
