import { ID, JsonValue, CreatedAt } from './common.types';

/**
 * Dataset column types
 */
export type DatasetColumnType = 'file' | 'text';

export type DatasetColumn = {
  name: string;
  type: DatasetColumnType;
  required: boolean;
  description?: string;
};

export type DatasetColumns = DatasetColumn[];

/**
 * Dataset entity types
 */
export type Dataset = {
  id: ID;
  title: string;
  columns: DatasetColumns;
  createdAt: CreatedAt;
};

export type DatasetWithItems = Dataset & {
  items: DatasetItem[];
};

export type DatasetItem = {
  id: ID;
  datasetId: ID;
  value: JsonValue;
  createdAt: CreatedAt;
};

/**
 * Dataset creation and update DTOs
 */
export type CreateDatasetDto = {
  title: string;
  value: string;
  columns: DatasetColumns;
};

export type UpdateDatasetDto = Partial<CreateDatasetDto>;

/**
 * DatasetItem creation and update DTOs
 */
export type CreateDatasetItemDto = {
  datasetId: ID;
  value: JsonValue;
};

export type UpdateDatasetItemDto = {
  value: JsonValue;
};

/**
 * Dataset query and filter types
 */
export type DatasetFilters = {
  title?: string;
  createdAfter?: Date;
  createdBefore?: Date;
};

export type DatasetItemFilters = {
  datasetId?: ID;
  createdAfter?: Date;
  createdBefore?: Date;
};

/**
 * Dataset statistics
 */
export type DatasetStats = {
  totalItems: number;
  lastUpdated: Date;
  averageItemSize: number;
};

/**
 * File upload types for dataset items
 */
export type DatasetFileUpload = {
  columnId: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
};

/**
 * Dataset item value structure
 */
export type DatasetItemValue = {
  [columnId: string]: string | DatasetFileUpload;
}; 