import { ApiProperty } from '@nestjs/swagger';
import { Agent } from '../entities/agent.entity';

export class AgentResponseDto {
  @ApiProperty({ description: 'Agent ID' })
  id: string;

  @ApiProperty({ description: 'Agent name' })
  name: string;

  @ApiProperty({ description: 'Agent email' })
  email: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'User UUID' })
  user_id: string;

  constructor(agent: Agent) {
    this.id = agent.id;
    this.name = agent.name;
    this.email = agent.email;
    this.created_at = agent.created_at;
    this.user_id = agent.user_id;
  }

  static fromEntity(agent: Agent): AgentResponseDto {
    return new AgentResponseDto(agent);
  }

  static fromEntities(agents: Agent[]): AgentResponseDto[] {
    return agents.map(agent => AgentResponseDto.fromEntity(agent));
  }
}