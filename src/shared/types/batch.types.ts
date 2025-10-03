import { BatchStatus } from '@prisma/client';

export interface GeneratedImage {
  id: string;
  url: string;
  storageKey: string;
  createdAt: string;
  promptId: string;
}

export interface Prompt {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  batchId: string;
  generatedImages: GeneratedImage[];
}

export interface ReferenceImage {
  id: string;
  url: string;
  storageKey: string;
  createdAt: string;
}

export interface Batch {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  status: BatchStatus;
  imageCountPerPrompt: number;
  prompts: Prompt[];
  referenceImages: ReferenceImage[];
}
