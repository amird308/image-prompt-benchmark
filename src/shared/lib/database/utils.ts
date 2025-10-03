import { db } from './client';
import type { DatabaseHealth, DatabaseInfo } from './types';

/**
 * Check database health with detailed status
 */
export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    await db.$queryRaw`SELECT 1`;
    return {
      isHealthy: true,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      isHealthy: false,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get detailed database information
 */
export async function getDatabaseInfo(): Promise<DatabaseInfo> {
  try {
    const result = await db.$queryRaw<DatabaseInfo[]>`
      SELECT 
        version() as version,
        current_database() as database_name,
        current_user as current_user
    `;
    return result[0];
  } catch (error) {
    console.error('Failed to get database info:', error);
    throw new Error('Failed to get database info');
  }
}

/**
 * Clean up database resources
 */
export async function cleanup(): Promise<void> {
  try {
    await db.$disconnect();
    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
} 