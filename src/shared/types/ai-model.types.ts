import { ID, CreatedAt } from './common.types';

/**
 * AIModel file content types
 */
export type AIModelFileContent = {
  filename: string;
  file_data: string; // Base64 encoded file data
  mimeType?: string;
  fileSize?: number;
};

export type AIModelMessageContentItem = {
  type: 'text' | 'file';
  text?: string;
  file?: AIModelFileContent;
};

export type AIModelMessageContent = string | AIModelMessageContentItem[];

/**
 * AIModel entity types
 */
export type AIModel = {
  id: ID;
  modelName: string;
  temperature: number;
  returnJson: boolean;
  apiKey: string;
  createdAt: CreatedAt;
};

export type AIModelWithMessages = AIModel & {
  messages: AIModelMessage[];
};

export type AIModelMessage = {
  id: ID;
  aiModelId: ID;
  role: string;
  content: AIModelMessageContent;
  createdAt: CreatedAt;
};

/**
 * AIModel creation and update DTOs
 */
export type CreateAIModelDto = {
  modelName: string;
  temperature: number;
  returnJson: boolean;
  apiKey: string;
};

export type UpdateAIModelDto = Partial<CreateAIModelDto>;

/**
 * AIModelMessage creation and update DTOs
 */
export type CreateAIModelMessageDto = {
  aiModelId: ID;
  role: string;
  content: AIModelMessageContent;
};

export type UpdateAIModelMessageDto = {
  role?: string;
  content?: AIModelMessageContent;
};

/**
 * AIModel query and filter types
 */
export type AIModelFilters = {
  modelName?: string;
  returnJson?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
};

export type AIModelMessageFilters = {
  aiModelId?: ID;
  role?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}; 