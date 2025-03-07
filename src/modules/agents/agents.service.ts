import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentRepository } from './repositories/agent.repository';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentResponseDto } from './dto/agent-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AgentsService {
  constructor(private agentRepository: AgentRepository) {}

  async findAll(): Promise<AgentResponseDto[]> {
    const agents = await this.agentRepository.findAll();
    return AgentResponseDto.fromEntities(agents);
  }

  async findOne(id: string): Promise<AgentResponseDto> {
    const agent = await this.agentRepository.findOne(id);
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return AgentResponseDto.fromEntity(agent);
  }

  async create(createAgentDto: CreateAgentDto): Promise<AgentResponseDto> {
    createAgentDto.user_id = uuidv4();
    const agent = await this.agentRepository.create(createAgentDto);
    return AgentResponseDto.fromEntity(agent);
  }
}