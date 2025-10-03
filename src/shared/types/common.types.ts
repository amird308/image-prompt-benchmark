/**
 * Common types used across the application
 */

export type ID = string;

// Use Prisma's JsonValue for compatibility
import { JsonValue as PrismaJsonValue } from '@prisma/client/runtime/library';

export type JsonValue = PrismaJsonValue;

export type CreatedAt = Date;

export type UpdatedAt = Date;

/**
 * Base response types for API operations
 */
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: JsonValue;
};

/**
 * Pagination types
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}; 