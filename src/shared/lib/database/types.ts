import { PrismaClient } from '@prisma/client';

export type DatabaseClient = PrismaClient;

export interface DatabaseConfig {
  url: string;
  log?: boolean;
}

export interface DatabaseHealth {
  isHealthy: boolean;
  timestamp: Date;
  error?: string;
}

export interface DatabaseInfo {
  version: string;
  database_name: string;
  current_user: string;
}

// Utility types for Prisma operations
export type DbTransaction = Omit<DatabaseClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$executeRaw' | '$executeRawUnsafe' | '$queryRaw' | '$queryRawUnsafe'>; 