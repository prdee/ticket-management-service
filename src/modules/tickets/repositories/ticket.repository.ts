import { Injectable, Logger } from '@nestjs/common';
import { Ticket } from '../entities/ticket.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { FilterTicketDto } from '../dto/filter-ticket.dto';
import { DatabaseService } from 'src/database/database.service';
import { IRepository } from 'src/common/repository.interface';

@Injectable()
export class TicketRepository implements IRepository<Ticket> {
  private readonly logger = new Logger(TicketRepository.name);
  private readonly tableName = 'tickets';

  constructor(private databaseService: DatabaseService) {}

  async findAll(filterDto: FilterTicketDto = {}): Promise<Ticket[]> {
    const { status, priority, assigned_to, page = 0, limit = 20 } = filterDto;
    
    let query = this.databaseService.supabase
      .from(this.tableName)
      .select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
    }
    
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    
    const from = page * limit;
    const to = from + limit - 1;
    
    query = query.order('created_at', { ascending: false }).range(from, to);
    
    const { data, error } = await query;

    if (error) {
      this.logger.error(`Error fetching tickets: ${error.message}`, error);
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }

    return data as Ticket[];
  }

  async findOne(id: string): Promise<Ticket | null> {
    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No record found
      }
      this.logger.error(`Error fetching ticket ${id}: ${error.message}`, error);
      throw new Error(`Failed to fetch ticket: ${error.message}`);
    }

    return data as Ticket;
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .insert(createTicketDto)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Error creating ticket: ${error.message}`, error);
      throw new Error(`Failed to create ticket: ${error.message}`);
    }

    return data as Ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket | null> {
    const existingTicket = await this.findOne(id);
    if (!existingTicket) {
      return null;
    }

    const { data, error } = await this.databaseService.supabase
      .from(this.tableName)
      .update(updateTicketDto)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Error updating ticket ${id}: ${error.message}`, error);
      throw new Error(`Failed to update ticket: ${error.message}`);
    }

    return data as Ticket;
  }

  async delete(id: string): Promise<boolean> {
    // Check if ticket exists
    const existingTicket = await this.findOne(id);
    if (!existingTicket) {
      return false;
    }

    const { error } = await this.databaseService.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Error deleting ticket ${id}: ${error.message}`, error);
      throw new Error(`Failed to delete ticket: ${error.message}`);
    }

    return true;
  }
}