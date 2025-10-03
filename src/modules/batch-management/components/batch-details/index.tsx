'use client';

import { Batch } from '@/shared/types/batch.types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

interface BatchDetailsProps {
  batch: Batch;
}

export function BatchDetails({ batch }: BatchDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>ID:</strong> {batch.id}
        </p>
        <p>
          <strong>Status:</strong> {batch.status}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(batch.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Images per Prompt:</strong> {batch.imageCountPerPrompt}
        </p>

        <h3 className="text-lg font-semibold mt-4">Prompts</h3>
        <ul>
          {batch?.prompts?.map((prompt) => (
            <li key={prompt.id}>{prompt.text}</li>
          ))}
        </ul>

        {batch?.referenceImages?.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-4">Reference Image</h3>
            <img
              src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}${batch.referenceImages[0].url}`}
              alt="Reference Image"
              className="max-w-xs"
            />
          </>
        )}

        <h3 className="text-lg font-semibold mt-4">Generated Images</h3>
        <div className="grid grid-cols-4 gap-4">
          {batch?.prompts?.flatMap((prompt) =>
            prompt.generatedImages.map((image) => (
              <img
                key={image.id}
                src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}${image.url}`}
                alt="Generated Image"
                className="w-full"
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
