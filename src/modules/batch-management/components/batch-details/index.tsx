'use client';

import { Batch } from '@/shared/types/batch.types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface BatchDetailsProps {
  batch: Batch;
  onSelectBatch: () => void;
}

export function BatchDetails({ batch, onSelectBatch }: BatchDetailsProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Batch Details</CardTitle>
        <Button onClick={() => onSelectBatch()} variant="outline">
          back
        </Button>
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

        <h3 className="text-lg font-semibold mt-4">Prompts and Generated Images</h3>
        <div className="space-y-6">
          {batch?.prompts?.map((prompt) => (
            <div key={prompt.id} className="border p-4 rounded-md">
              <p className="font-medium text-right">{prompt.text}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {prompt.generatedImages.map((image) => (
                  <div key={image.id} className="flex flex-col items-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}${image.url}`}
                      alt="Generated"
                      className="w-full h-auto rounded-md"
                    />
                    {/* <p className="text-sm mt-1">Cost: ${image.cost.toFixed(2)}</p> */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {batch?.referenceImages?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Reference Image</h3>
            <img
              src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}${batch.referenceImages[0].url}`}
              alt="Reference"
              className="max-w-xs rounded-md shadow-md"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
