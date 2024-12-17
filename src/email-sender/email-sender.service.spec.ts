import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from './email-sender.service';
import { RmqContext } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn(),
    }),
  };
});

describe('EmailSenderService', () => {
  let service: EmailSenderService;
  let mockContext: RmqContext;
  let mockChannel: any;
  let mockSendMail: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSenderService],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService);

    mockChannel = {
      ack: jest.fn(),
      nack: jest.fn(),
    };

    mockContext = {
      getChannelRef: jest.fn().mockReturnValue(mockChannel),
      getMessage: jest.fn().mockReturnValue({}),
    } as unknown as RmqContext;

    mockSendMail = nodemailer.createTransport().sendMail as jest.Mock;

    // Mock console.log and console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email and acknowledge the message', async () => {
    const data = { email: 'test@example.com' };
    mockSendMail.mockResolvedValueOnce(undefined);

    await service.sendEmail(data, mockContext);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'sender@example.com',
      to: data.email,
      subject: 'Test Email',
      text: 'This is a mock email',
    });
    expect(mockChannel.ack).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Email sent successfully!');
  });

  it('should nack the message if email sending fails', async () => {
    const data = { email: 'test@example.com' };
    const error = new Error('Failed to send email');
    mockSendMail.mockRejectedValueOnce(error);

    await service.sendEmail(data, mockContext);

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockChannel.nack).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Failed to send email:', error);
  });
});
