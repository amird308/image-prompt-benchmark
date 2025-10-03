import { ID, JsonValue, CreatedAt } from './common.types';
import { Prompt } from './prompt.types';
import { Dataset } from './dataset.types';
import { AIModel } from './ai-model.types';

/**
 * Flow execution status enum
 */
export const FlowExecutionStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type FlowExecutionStatus = (typeof FlowExecutionStatus)[keyof typeof FlowExecutionStatus];

/**
 * Flow entity types
 */
export type Flow = {
  id: ID;
  name: string;
  datasetId: ID;
  aiModelId: ID;
  createdAt: CreatedAt;
};

export type FlowPrompt = {
  id: ID;
  flowId: ID;
  promptId: ID;
  key: string; // Key to reference the prompt as {{prompts.key}}
  order: number; // Order in which prompts should be processed
  createdAt: CreatedAt;
};

export type FlowPromptWithPrompt = FlowPrompt & {
  prompt: Prompt;
};

export type FlowWithRelations = Flow & {
  prompts: FlowPromptWithPrompt[];
  dataset: Dataset;
  aiModel: AIModel;
  executions: FlowExecution[];
};

export type FlowExecution = {
  id: ID;
  flowId: ID;
  output: JsonValue;
  status: FlowExecutionStatus;
  createdAt: CreatedAt;
};

export type FlowExecutionWithFlow = FlowExecution & {
  flow: FlowWithRelations;
};

/**
 * Flow creation and update DTOs
 */
export type CreateFlowDto = {
  name: string;
  datasetId: ID;
  aiModelId: ID;
  prompts: Array<{
    promptId: ID;
    key: string;
    order: number;
  }>;
};

export type UpdateFlowDto = Partial<Omit<CreateFlowDto, 'prompts'>>;

/**
 * FlowExecution creation and update DTOs
 */
export type CreateFlowExecutionDto = {
  flowId: ID;
  output?: JsonValue;
  status?: FlowExecutionStatus;
};

export type UpdateFlowExecutionDto = {
  output?: JsonValue;
  status?: FlowExecutionStatus;
};

/**
 * Flow query and filter types
 */
export type FlowFilters = {
  name?: string;
  promptIds?: ID[];
  datasetId?: ID;
  aiModelId?: ID;
  createdAfter?: Date;
  createdBefore?: Date;
};

export type FlowExecutionFilters = {
  flowId?: ID;
  status?: FlowExecutionStatus;
  createdAfter?: Date;
  createdBefore?: Date;
};

/**
 * Flow execution request and response types
 */
export type ExecuteFlowDto = {
  flowId: ID;
  datasetItemId?: ID; // Optional: execute on specific dataset item
};

export type FlowExecutionResult = {
  executionId: ID;
  status: FlowExecutionStatus;
  output?: JsonValue;
  error?: string;
};

/**
 * FlowPrompt creation and update DTOs
 */
export type CreateFlowPromptDto = {
  flowId: ID;
  promptId: ID;
  key: string;
  order: number;
};

export type UpdateFlowPromptDto = {
  key?: string;
  order?: number;
}; 