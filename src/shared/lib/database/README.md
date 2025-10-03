# Database Module

This module provides PostgreSQL database connection and management using Prisma ORM.

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the project root with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   ```

3. **Generate Prisma client:**
   ```bash
   pnpm db:generate
   ```

4. **Push database schema:**
   ```bash
   pnpm db:push
   ```

## Usage

### Basic Database Operations

```typescript
import { db, connectDatabase, disconnectDatabase } from '@/modules/database';

// Test connection
await connectDatabase();

// Basic queries
const users = await db.user.findMany();
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});

// Clean disconnect
await disconnectDatabase();
```

### Health Checks

```typescript
import { getDatabaseHealth, getDatabaseInfo } from '@/modules/database/utils';

// Check if database is healthy
const health = await getDatabaseHealth();
console.log('Database healthy:', health.isHealthy);

// Get database information
const info = await getDatabaseInfo();
console.log('Database version:', info.version);
```

### Transactions

```typescript
import { withTransaction } from '@/modules/database/utils';

const result = await withTransaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com', name: 'John' }
  });
  
  const post = await tx.post.create({
    data: { title: 'Hello World', authorId: user.id }
  });
  
  return { user, post };
});
```

## Available Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:reset` - Reset database and apply migrations
- `pnpm db:studio` - Open Prisma Studio

## Schema

The database schema is defined in `prisma/schema.prisma`. Example models are included (User and Post) - modify them according to your needs.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment (development/production)

## Error Handling

The module includes proper error handling and logging. In development mode, detailed query logs are enabled.

## Best Practices

1. Always use the singleton `db` client
2. Handle connection errors gracefully
3. Use transactions for multi-step operations
4. Clean up connections in production
5. Validate environment variables on startup 