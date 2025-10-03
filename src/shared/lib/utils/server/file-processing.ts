/**
 * File processing utilities for dataset items with file columns
 */

import { getFileAsBuffer } from '@/shared/lib/object-storage';
import { DatasetColumns, DatasetFileUpload } from '@/shared/types';
import { AIModelFileContent } from '@/shared/types/ai-model.types';

/**
 * Encode file to base64 with proper data URL format
 */
export function encodeFileToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * Encode PDF file to base64
 */
export function encodePDFToBase64(pdfBuffer: Buffer): string {
  return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
}

/**
 * Process dataset item value to load files from object storage
 */
export async function processDatasetItemValue(
  datasetValue: Record<string, any>,
  columns: DatasetColumns
): Promise<Record<string, any>> {
  const processedValue = { ...datasetValue };
  
  // Process each column to check if it's a file type
  for (const column of columns) {
    if (column.type === 'file' && column.name in datasetValue) {
      const fileUpload = datasetValue[column.name] as DatasetFileUpload;
      
      if (fileUpload && fileUpload.fileKey) {
        try {
          // Load file from object storage
          const fileBuffer = await getFileAsBuffer({
            bucket: "datasets",
            key: fileUpload.fileKey,
          });
          
          // Create file content for AI model
          const fileContent: AIModelFileContent = {
            filename: fileUpload.fileName,
            file_data: encodeFileToBase64(fileBuffer, fileUpload.mimeType),
            mimeType: fileUpload.mimeType,
            fileSize: fileUpload.fileSize,
          };
          
          // Replace the file upload object with the processed file content
          processedValue[column.name] = fileContent;
        } catch (error) {
          console.error(`Failed to load file ${fileUpload.fileKey}:`, error);
          // Keep original value if file loading fails
        }
      }
    }
  }
  
  return processedValue;
}

/**
 * Check if a column value contains a file
 */
export function isFileColumn(columnName: string, columns: DatasetColumns): boolean {
  return columns.some(col => col.name === columnName && col.type === 'file');
}

/**
 * Extract file content from dataset value for AI model message
 */
export function extractFileContentForMessage(
  value: any,
  columnName: string,
  columns: DatasetColumns
): AIModelFileContent | null {
  if (!isFileColumn(columnName, columns)) {
    return null;
  }
  
  const fileContent = value[columnName];
  if (fileContent && typeof fileContent === 'object' && 'file_data' in fileContent) {
    return fileContent as AIModelFileContent;
  }
  
  return null;
}

/**
 * Process message content to include file attachments
 */
export function processMessageContentWithFiles(
  content: any,
  processedDatasetValue: Record<string, any>,
  columns: DatasetColumns
): any {
  if (typeof content === 'string') {
    // Simple string content - return as is
    return content;
  }
  
  if (Array.isArray(content)) {
    // Already structured content - process each item
    return content.map(item => {
      if (item.type === 'text' && typeof item.text === 'string') {
        // Process text content for file variable replacements
        return {
          ...item,
          text: replaceFileVariables(item.text, processedDatasetValue, columns),
        };
      }
      return item;
    });
  }
  
  // Handle object content
  if (typeof content === 'object' && content !== null) {
    return processObjectForFileContent(content, processedDatasetValue, columns);
  }
  
  return content;
}

/**
 * Replace file variables in text content
 */
function replaceFileVariables(
  text: string,
  processedDatasetValue: Record<string, any>,
  columns: DatasetColumns
): string {
  // Handle file variables like {{file:columnName}}
  return text.replace(/\{\{file:(\w+)\}\}/g, (match, columnName) => {
    const fileContent = extractFileContentForMessage(processedDatasetValue, columnName, columns);
    if (fileContent) {
      return `[File: ${fileContent.filename}]`;
    }
    return match;
  });
}

/**
 * Process object content recursively
 */
function processObjectForFileContent(
  obj: any,
  processedDatasetValue: Record<string, any>,
  columns: DatasetColumns
): any {
  if (Array.isArray(obj)) {
    return obj.map(item => processObjectForFileContent(item, processedDatasetValue, columns));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const processed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        processed[key] = replaceFileVariables(value, processedDatasetValue, columns);
      } else {
        processed[key] = processObjectForFileContent(value, processedDatasetValue, columns);
      }
    }
    return processed;
  }
  
  return obj;
} 
