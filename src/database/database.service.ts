import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('database.url');
    const supabaseKey = this.configService.get<string>('database.key');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error } = await this.supabaseClient.from('tickets').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Failed to connect to Supabase:', error.message);
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }
    
    console.log('Successfully connected to Supabase');
  }

  async onModuleDestroy() {
    // Nothing specific to clean up with Supabase client
  }

  get supabase(): SupabaseClient {
    return this.supabaseClient;
  }
}