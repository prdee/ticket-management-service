import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { DatabaseService } from 'src/database/database.service';
import { IRepository } from 'src/common/repository.interface';

@Injectable()
export class AgentRepository implements IRepository<Agent> {
  private readonly logger = new Logger(AgentRepository.name);
  private readonly tableName = 'agents';

  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Agent[]> {
    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Error fetching agents: ${error.message}`, error);
      throw new Error(`Failed to fetch agents: ${error.message}`);
    }

    return data as Agent[];
  }

  async findOne(id: string): Promise<Agent | null> {
    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No record found
      }
      this.logger.error(`Error fetching agent ${id}: ${error.message}`, error);
      throw new Error(`Failed to fetch agent: ${error.message}`);
    }

    return data as Agent;
  }

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .insert(createAgentDto)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Error creating agent: ${error.message}`, error);
      throw new Error(`Failed to create agent: ${JSON.stringify(error)}`);
    }

    return data as Agent;
  }

  async update(id: string, updateData: Partial<Agent>): Promise<Agent | null> {
    // Check if agent exists
    const existingAgent = await this.findOne(id);
    if (!existingAgent) {
      return null;
    }

    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Error updating agent ${id}: ${error.message}`, error);
      throw new Error(`Failed to update agent: ${error.message}`);
    }

    return data as Agent;
  }

  async delete(id: string): Promise<boolean> {
    // Check if agent exists
    const existingAgent = await this.findOne(id);
    if (!existingAgent) {
      return false;
    }

    const { error } = await this.databaseService.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Error deleting agent ${id}: ${error.message}`, error);
      throw new Error(`Failed to delete agent: ${error.message}`);
    }

    return true;
  }
}
