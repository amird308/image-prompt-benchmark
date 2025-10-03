import { db } from './client';

/**
 * Test the database connection
 */
export async function connectDatabase(): Promise<void> {
  try {
    await db.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw new Error('Failed to connect to database');
  }
}

/**
 * Disconnect from the database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await db.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw new Error('Failed to disconnect from database');
  }
}

/**
 * Check if the database is healthy
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Get database info
 */
export async function getDatabaseInfo() {
  try {
    const result = await db.$queryRaw`
      SELECT 
        version() as version,
        current_database() as database_name,
        current_user as current_user
    `;
    return result;
  } catch (error) {
    console.error('Failed to get database info:', error);
    throw new Error('Failed to get database info');
  }
} 