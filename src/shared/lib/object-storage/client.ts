/**
 * AWS S3 Client Configuration
 */
import * as AWS from 'aws-sdk';
import { env } from '@/shared/lib/env';
/**
import { config } from 'process';
 * Create and configure S3 client with custom endpoint support
 */

declare global {
  // eslint-disable-next-line no-var
  var __s3Client: AWS.S3;
}


const s3ClientSingleton = ():AWS.S3 => {
  const s3 = new AWS.S3({
    endpoint: env.S3_ENDPOINT,
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
    s3ForcePathStyle: true, // needed for MinIO
    signatureVersion: 'v4',
    apiVersion: 'v3',
    sslEnabled: true,
  });

  return s3;
}


// Prevent multiple instances of S3 Client in development
export const s3Client = globalThis.__s3Client ?? s3ClientSingleton();

if (env.NODE_ENV !== 'production') {
  globalThis.__s3Client = s3Client;
} 