/**
 * Object Storage Module
 * Provides functions for interacting with S3-compatible object storage
 */

import { s3Client } from './client';
import type {
  UploadFileParams,
  UploadFileResult,
  DownloadFileParams,
  DownloadFileResult,
  DeleteFileParams,
  DeleteFileResult,
  GetFileAsBufferParams,
  ObjectStorageError,
} from './types';

/**
 * Upload a file to S3-compatible storage
 */
export async function uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
  try {
    const uploadParams = {
      Bucket: params.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    };

    const result = await s3Client.putObject(uploadParams).promise();

    return {
      bucket: params.bucket,
      key: params.key,
      etag: result.ETag,
      location: `${s3Client.config.endpoint}/${params.bucket}/${params.key}`,
    };
  } catch (error) {
    const objectStorageError: ObjectStorageError = new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    objectStorageError.code = (error as any)?.code;
    objectStorageError.statusCode = (error as any)?.statusCode;
    objectStorageError.details = { bucket: params.bucket, key: params.key };
    throw objectStorageError;
  }
}

/**
 * Download a file from S3-compatible storage
 */
export async function downloadFile(params: DownloadFileParams): Promise<DownloadFileResult> {
  try {
    const downloadParams = {
      Bucket: params.bucket,
      Key: params.key,
      Range: params.range,
    };

    const result = await s3Client.getObject(downloadParams).promise();

    if (!result.Body) {
      throw new Error('No content received from S3');
    }

    // Convert the body to Buffer
    let body: Buffer;
    if (result.Body instanceof Buffer) {
      body = result.Body;
    } else if (result.Body instanceof Uint8Array) {
      body = Buffer.from(result.Body);
    } else if (typeof result.Body === 'string') {
      body = Buffer.from(result.Body);
    } else {
      // Handle stream case
      const chunks: Buffer[] = [];
      const stream = result.Body as NodeJS.ReadableStream;
      
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      
      body = Buffer.concat(chunks);
    }

    return {
      body,
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      lastModified: result.LastModified,
      etag: result.ETag,
      metadata: result.Metadata,
    };
  } catch (error) {
    const objectStorageError: ObjectStorageError = new Error(
      `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    objectStorageError.code = (error as any)?.code;
    objectStorageError.statusCode = (error as any)?.statusCode;
    objectStorageError.details = { bucket: params.bucket, key: params.key };
    throw objectStorageError;
  }
}

/**
 * Delete a file from S3-compatible storage
 */
export async function deleteFile(params: DeleteFileParams): Promise<DeleteFileResult> {
  try {
    const deleteParams = {
      Bucket: params.bucket,
      Key: params.key,
    };

    const result = await s3Client.deleteObject(deleteParams).promise();

    return {
      success: true,
      key: params.key,
      deleteMarker: result.DeleteMarker,
    };
  } catch (error) {
    const objectStorageError: ObjectStorageError = new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    objectStorageError.code = (error as any)?.code;
    objectStorageError.statusCode = (error as any)?.statusCode;
    objectStorageError.details = { bucket: params.bucket, key: params.key };
    throw objectStorageError;
  }
}

/**
 * Get a file as Buffer from S3-compatible storage
 * This is a convenience function that wraps downloadFile and returns only the buffer
 */
export async function getFileAsBuffer(params: GetFileAsBufferParams): Promise<Buffer> {
  try {
    const result = await downloadFile({
      bucket: params.bucket,
      key: params.key,
      range: params.range,
    });

    return result.body;
  } catch (error) {
    const objectStorageError: ObjectStorageError = new Error(
      `Failed to get file as buffer: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    objectStorageError.code = (error as any)?.code;
    objectStorageError.statusCode = (error as any)?.statusCode;
    objectStorageError.details = { bucket: params.bucket, key: params.key };
    throw objectStorageError;
  }
}
  