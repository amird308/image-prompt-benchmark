import { ID, JsonValue, CreatedAt } from './common.types';

/**
 * Prompt entity types
 */
export type Prompt = {
  id: ID;
  name: string;
  version: string;
  value: string;
  variables: JsonValue;
  createdAt: CreatedAt;
};

/**
 * Prompt creation and update DTOs
 */
export type CreatePromptDto = {
  name: string;
  version: string;
  value: string;
  variables: JsonValue;
};

export type UpdatePromptDto = Partial<Omit<CreatePromptDto, 'name' | 'version'>>;

/**
 * Prompt query and filter types
 */
export type PromptFilters = {
  name?: string;
  version?: string;
  createdAfter?: Date;
  createdBefore?: Date;
};

export type PromptVersionFilters = {
  name: string;
};

/**
 * Prompt variable types
 */
export type PromptVariable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  defaultValue?: JsonValue;
};

export type PromptVariables = Record<string, PromptVariable>;

/**
 * Prompt template processing
 */
export type ProcessPromptDto = {
  promptId: ID;
  variables: Record<string, JsonValue>;
};

export type ProcessedPrompt = {
  prompt: Prompt;
  processedValue: string;
  variables: Record<string, JsonValue>;
};

/**
 * Prompt version management
 */
export type PromptVersionInfo = {
  name: string;
  versions: Array<{
    version: string;
    id: ID;
    createdAt: CreatedAt;
    isLatest: boolean;
  }>;
}; 