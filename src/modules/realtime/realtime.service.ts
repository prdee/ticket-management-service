import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Ably from 'ably';

type EventName = 'ticket_created' | 'ticket_updated' | 'ticket_deleted';

@Injectable()
export class RealtimeService implements OnModuleInit, OnModuleDestroy {
  private client: Ably.Realtime;
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const ablyApiKey = this.configService.get<string>('ably.apiKey');
    
    if (!ablyApiKey) {
      throw new Error('Ably API key is missing');
    }
    
    try {
      this.client = new Ably.Realtime(ablyApiKey);
      this.logger.log('Successfully initialized Ably Realtime client');
    } catch (error) {
      this.logger.error('Failed to initialize Ably Realtime client', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        this.client.close();
        this.logger.log('Ably Realtime client closed');
      } catch (error) {
        this.logger.error('Error closing Ably client', error);
      }
    }
  }

  async publishEvent(eventName: EventName, data: any): Promise<void> {
    try {
      const channel = this.client.channels.get('tickets');
      channel.publish(eventName, data);
      this.logger.debug(`Published event ${eventName} with data: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${eventName}`, error);
      throw new Error(`Failed to publish event: ${error.message}`);
    }
  }
}
