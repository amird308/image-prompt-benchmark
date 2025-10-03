/**
 * Environment variables validation and type safety
 */

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const env = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // Node environment
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
  
  // Development flag
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // S3 Object Storage
  S3_ENDPOINT: getEnvVar('STORAGE_ENDPOINT'),
  S3_ACCESS_KEY: getEnvVar('STORAGE_ACCESS_KEY'),
  S3_SECRET_KEY: getEnvVar('STORAGE_SECRET_KEY'),
  
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY'),
  
  // OpenAI
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),
};

// Validate environment variables on module load
try {
  env.S3_ENDPOINT;
  env.S3_ACCESS_KEY;
  env.S3_SECRET_KEY;
  env.DATABASE_URL;
  env.OPENAI_API_KEY;
  console.log('✅ Environment variables validated');
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
} 