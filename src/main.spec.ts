import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { bootstrap } from './main';
import { EmailSenderModule } from './email-sender/email-sender.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    createMicroservice: jest.fn(),
  },
}));

describe('Main.ts Bootstrap', () => {
  let mockApp: { listen: jest.Mock };

  beforeEach(() => {
    // Mock the return object of createMicroservice
    mockApp = {
      listen: jest.fn().mockResolvedValue(undefined), // Mock the listen method
    };

    // Mock NestFactory.createMicroservice to return the mocked app
    (NestFactory.createMicroservice as jest.Mock).mockResolvedValue(mockApp);

    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should create the microservice and start listening', async () => {
    // Set environment variables
    process.env.RABBITMQ_URL = 'amqp://localhost';
    process.env.RABBITMQ_QUEUE = 'test_queue';

    // Call the bootstrap function
    await bootstrap();

    // Expect NestFactory.createMicroservice to have been called with the right parameters
    expect(NestFactory.createMicroservice).toHaveBeenCalledWith(
      EmailSenderModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'test_queue',
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    );

    // Expect listen to have been called
    expect(mockApp.listen).toHaveBeenCalled();

    // Assert the console.log output
    expect(console.log).toHaveBeenCalledWith(
      'EmailSender Microservice is listening....',
    );
  });

  it('should throw an error if listen fails', async () => {
    // Simulate a failure in the listen method
    mockApp.listen.mockRejectedValue(new Error('Microservice failed to start'));

    // Assert that bootstrap throws an error
    await expect(bootstrap()).rejects.toThrow('Microservice failed to start');

    // Ensure listen was still called
    expect(mockApp.listen).toHaveBeenCalled();
  });
});
