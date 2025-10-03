/**
 * Object Storage Types and Interfaces
 */

export interface UploadFileParams {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) for the object in S3 */
  key: string;
  /** The file content as Buffer, string, or Uint8Array */
  body: Buffer | string | Uint8Array;
  /** Optional content type (e.g., 'image/jpeg', 'text/plain') */
  contentType?: string;
  /** Optional metadata to attach to the object */
  metadata?: Record<string, string>;
}

export interface UploadFileResult {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) of the uploaded object */
  key: string;
  /** The ETag of the uploaded object */
  etag?: string;
  /** The location/URL of the uploaded object */
  location?: string;
}

export interface GetPresignedUrlParams {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) for the object in S3 */
  key: string;
  /** Expiration time in seconds (default: 3600 = 1 hour) */
  expiresIn?: number;
  /** HTTP method for the presigned URL ('GET' | 'PUT' | 'POST' | 'DELETE') */
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
}

export interface DownloadFileParams {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) of the object to download */
  key: string;
  /** Optional range for partial downloads (e.g., 'bytes=0-1023') */
  range?: string;
}

export interface DownloadFileResult {
  /** The object content as Buffer */
  body: Buffer;
  /** Content type of the object */
  contentType?: string;
  /** Content length in bytes */
  contentLength?: number;
  /** Last modified date */
  lastModified?: Date;
  /** ETag of the object */
  etag?: string;
  /** Object metadata */
  metadata?: Record<string, string>;
}

export interface DeleteFileParams {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) of the object to delete */
  key: string;
}

export interface DeleteFileResult {
  /** Whether the deletion was successful */
  success: boolean;
  /** The deleted object's key */
  key: string;
  /** Optional deletion marker (for versioned buckets) */
  deleteMarker?: boolean;
}

export interface GetFileAsBufferParams {
  /** The S3 bucket name */
  bucket: string;
  /** The key (path) of the object to get as buffer */
  key: string;
  /** Optional range for partial downloads (e.g., 'bytes=0-1023') */
  range?: string;
}

export interface ObjectStorageError extends Error {
  /** Error code from AWS */
  code?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Additional error details */
  details?: Record<string, any>;
} 