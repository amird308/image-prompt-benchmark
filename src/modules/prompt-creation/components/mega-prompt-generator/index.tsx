'use client';

import { useState } from 'react';
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
import { cn } from '@/shared/lib/utils/cn';

interface MegaPromptGeneratorProps {
  referenceImages: string[];
  setReferenceImages: (keys: string[]) => void;
  onPromptsGenerated: (prompts: string[]) => void;
}

export function MegaPromptGenerator({
  referenceImages,
  setReferenceImages,
  onPromptsGenerated,
}: MegaPromptGeneratorProps) {
  const [megaPrompt, setMegaPrompt] = useState('');
  const [promptCount, setPromptCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleGeneratePrompts = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('megaPrompt', megaPrompt);
      formData.append('count', String(promptCount));
      if (referenceImages?.length > 0)
        formData.append('referenceImages', referenceImages[0]);

      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      onPromptsGenerated(data.prompts);
    } catch (error) {
      console.error('Failed to generate prompts:', error);
    }
    setIsLoading(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const uploadedImageKeys: string[] = [];
      const newImagePreviews: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          uploadedImageKeys.push(data.id);
          newImagePreviews.push(URL.createObjectURL(file));
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }

      setReferenceImages(uploadedImageKeys);
      setImagePreviews(newImagePreviews);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = referenceImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setReferenceImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mega Prompt Generator</CardTitle>
        <CardDescription>
          Input a mega prompt (text + reference images) and automatically
          generate multiple smaller prompts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mega-prompt">Mega Prompt</Label>
          <Textarea
            id="mega-prompt"
            value={megaPrompt}
            onChange={(e) => setMegaPrompt(e.target.value)}
            placeholder="Describe the desired image in detail..."
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference-images">Reference Images</Label>
          <Input
            id="reference-images"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <div key={referenceImages[index]} className="relative h-24 w-24">
                  <Image
                    src={src}
                    alt={`Reference preview ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="prompt-count">Number of Prompts to Generate</Label>
          <Input
            id="prompt-count"
            type="number"
            value={promptCount}
            onChange={(e) => setPromptCount(Number(e.target.value))}
            min={1}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleGeneratePrompts} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Prompts'}
        </Button>
      </CardFooter>
    </Card>
  );
}
