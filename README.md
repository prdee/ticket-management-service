# Ticket Management API

A scalable backend API for managing support tickets with real-time updates. Built with NestJS, Fastify, and TypeScript, using Supabase for database storage and Ably for real-time communications.

## Features

- CRUD operations for support tickets and agents
- Real-time updates for ticket status changes
- Filtering and pagination for ticket listing
- RESTful API design with proper error handling and validation
- API documentation with Swagger/OpenAPI

## Tech Stack

- **Backend Framework**: NestJS with Fastify adapter
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Real-time Communication**: Ably
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account and project setup
- Ably account for real-time messaging

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prdee/ticket-management-service.git
cd ticket-management-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase and Ably credentials:

```
# App Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api

# Supabase Configuration
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-key

# Ably Configuration
ABLY_API_KEY=your-ably-api-key
```

### 4. Database Setup

The project includes migration scripts in the `supabase/migrations` directory. You can run these migrations directly in the Supabase SQL Editor or use the Supabase CLI.

Using Supabase UI:
1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the content of `supabase/migrations/20250307000000_initial_schema.sql`
4. Run the SQL script

### 5. Start the application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Ticket Management

- `POST /api/tickets`: Create a new ticket
- `GET /api/tickets`: List all tickets with optional filters
- `GET /api/tickets/:id`: Retrieve a specific ticket
- `PATCH /api/tickets/:id`: Update ticket details
- `DELETE /api/tickets/:id`: Delete a ticket

### Agent Management

- `POST /api/agents`: Create a new agent
- `GET /api/agents`: List all agents
- `GET /api/agents/:id`: Retrieve a specific agent

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

## Real-time Updates

The system uses Ably to broadcast events when ticket status changes occur. Clients can subscribe to the following events:

- `ticket_created`: When a new ticket is created
- `ticket_updated`: When a ticket is updated (includes flag for status changes)
- `ticket_deleted`: When a ticket is deleted

## Design Decisions

### Project Structure

The project follows a modular architecture, with separate modules for tickets, agents, and real-time functionality. This promotes code organization, maintainability, and testability.

### Database Design

- Used PostgreSQL via Supabase for robust relational data storage
- Implemented proper constraints and validation at the database level
- Created appropriate indexes for performance optimization

### API Design

- RESTful API principles with proper HTTP methods and status codes
- Comprehensive DTO validation
- Clear separation between controllers, services, and repositories

### Real-time Implementation

- Used Ably for reliable real-time messaging
- Implemented event-based architecture for ticket status changes
- Decoupled real-time functionality to allow for future extensions

## Challenges Faced

1. **Database Schema Design**: Balancing normalization and query performance for the ticket management system.

2. **Error Handling**: Creating a standardized error handling approach across different layers of the application.

3. **Real-time Integration**: Ensuring reliable delivery of real-time events while maintaining system performance.

4. **Testing Strategy**: Developing a comprehensive testing approach that covers both unit and integration tests while mocking external dependencies.

## Future Improvements

- Add authentication and authorization
- Implement logging and monitoring
- Add rate limiting for API protection
- Expand test coverage
- Add pagination metadata in responses
- Implement caching for frequently accessed data