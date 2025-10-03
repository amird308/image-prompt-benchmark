'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
interface BatchPromptRunnerProps {
  referenceImageKeys: string[];
  initialPrompts?: string[];
}

export function BatchPromptRunner({ referenceImageKeys, initialPrompts }: BatchPromptRunnerProps) {
  const [prompts, setPrompts] = useState<string[]>(initialPrompts || ['']);
  const [imageCount, setImageCount] = useState(1);
  const [useReferenceImage, setUseReferenceImage] = useState(false);
  const [selectedReferenceImageId, setSelectedReferenceImageId] = useState<string | null>(null);
  const [uploadedReferenceImageKey, setUploadedReferenceImageKey] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(useReferenceImage);
  useEffect(() => {
    if (initialPrompts && initialPrompts.length > 0) {
      setPrompts(initialPrompts);
    }
  }, [initialPrompts]);

  const handleAddPrompt = () => {
    setPrompts([...prompts, '']);
  };

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleRemovePrompt = (index: number) => {
    const newPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(newPrompts);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setUploadedReferenceImageKey(data.id);
        setUploadedImagePreview(URL.createObjectURL(file));
        setSelectedReferenceImageId(null); // Clear selected image from dropdown
      } catch (error) {
        console.error('Failed to upload image:', error);
        setUploadedReferenceImageKey(null);
        setUploadedImagePreview(null);
      }
    } else {
      setUploadedReferenceImageKey(null);
      setUploadedImagePreview(null);
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedReferenceImageKey(null);
    setUploadedImagePreview(null);
    if (selectedReferenceImageId) {
      setSelectedReferenceImageId(null);
    }
  };

  const handleRunBatch = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompts: prompts.filter((p) => p.trim() !== ''),
          imageCountPerPrompt: imageCount,
          referenceImageId: useReferenceImage
            ? (uploadedReferenceImageKey || selectedReferenceImageId)
            : null,
        }),
      });
      // TODO: Handle successful batch creation (e.g., redirect or show message)
    } catch (error) {
      console.error('Failed to run batch:', error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Prompt Runner</CardTitle>
        <CardDescription>
          Manually input multiple prompts and run them as a batch.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Prompts</Label>
          {prompts.map((prompt, index) => (
            <div key={`${prompt}-${index}`} className="flex items-center space-x-2">
              <Textarea
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                placeholder={`Prompt #${index + 1}`}
                className="flex-grow"
              />
              {prompts.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePrompt(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddPrompt}>
            Add Prompt
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image-count">Images per Prompt</Label>
          <Input
            id="image-count"
            type="number"
            value={imageCount}
            onChange={(e) => setImageCount(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-reference-image"
            checked={useReferenceImage}
            onCheckedChange={(checked) => setUseReferenceImage(Boolean(checked))}
          />
          <Label htmlFor="use-reference-image">
            Use reference image for all prompts
          </Label>
        </div>
        {useReferenceImage && (
          <>
            <div className="space-y-2">
              <Label htmlFor="reference-image-upload">Upload Reference Image</Label>
              <Input
                id="reference-image-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {uploadedImagePreview && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <div key={uploadedReferenceImageKey} className="relative h-24 w-24">
                    <Image
                      src={uploadedImagePreview}
                      alt="Uploaded reference preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveUploadedImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Select
              onValueChange={(e)=> setSelectedReferenceImageId(e)}
              defaultValue={selectedReferenceImageId ?? undefined}
              disabled={!!uploadedReferenceImageKey}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reference image" />
              </SelectTrigger>
              <SelectContent>
                {referenceImageKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleRunBatch} disabled={isLoading}>
          {isLoading ? 'Running...' : 'Run Batch'}
        </Button>
      </CardFooter>
    </Card>
  );
}
