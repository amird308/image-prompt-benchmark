'use client';

import { Batch } from '@/shared/types/batch.types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface BatchListProps {
  batches: Batch[];
  onSelectBatch: (batchId: string) => void;
  refreshBatches: () => void;
}

export function BatchList({ batches, onSelectBatch, refreshBatches }: BatchListProps) {
  const handleRerun = async (batchId: string) => {
    try {
      await fetch(`/api/batches/${batchId}/rerun`, {
        method: 'POST',
      });
      refreshBatches();
    } catch (error) {
      console.error('Failed to rerun batch:', error);
    }
  };

  const handleDelete = async (batchId: string) => {
    try {
      await fetch(`/api/batches/${batchId}`, {
        method: 'DELETE',
      });
      refreshBatches();
    } catch (error) {
      console.error('Failed to delete batch:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {batches.map((batch) => (
        <Card key={batch.id} className="cursor-pointer" onClick={() => onSelectBatch(batch.id)}>
          <CardHeader>
            <CardTitle>Batch ID: {batch.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Prompts Count: {batch?.prompts?.length || 0}</p>
            <div className="mt-2">
              <h4 className="font-semibold">Prompts:</h4>
              {batch.prompts && batch.prompts.length > 0 ? (
                batch.prompts.map((prompt) => (
                  <div key={prompt.id} className="text-sm text-gray-500">
                    - {prompt.text}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-500">No prompts</span>
              )}
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Image Results:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {batch.prompts && batch.prompts.length > 0 ? (
                  batch.prompts.map((prompt) =>
                    prompt.generatedImages && prompt.generatedImages.length > 0 ? (
                      prompt.generatedImages.map((image) => (
                        <img
                          key={image.id}
                          src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}${image.url}`}
                          alt="Generated"
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      ))
                    ) : (
                      <span key={`no-images-${prompt.id}`} className="text-sm text-gray-500">No images</span>
                    ),
                  )
                ) : (
                  <span key="no-prompts-no-images" className="text-sm text-gray-500">No images</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Date: {new Date(batch.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Status: {batch.status}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRerun(batch.id);
                }}
              >
                Rerun
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(batch.id);
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
