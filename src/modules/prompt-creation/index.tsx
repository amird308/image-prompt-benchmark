'use client';

import { useState } from 'react';
import { MegaPromptGenerator } from './components/mega-prompt-generator';
import { BatchPromptRunner } from './components/batch-prompt-runner';

export function PromptCreation() {
  const [referenceImageKeys, setReferenceImageKeys] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);

  return (
    <div>
      <MegaPromptGenerator
        referenceImages={referenceImageKeys}
        setReferenceImages={setReferenceImageKeys}
        onPromptsGenerated={setGeneratedPrompts}
      />
      <hr className="my-8" />
      <BatchPromptRunner
        referenceImageKeys={referenceImageKeys}
        initialPrompts={generatedPrompts}
      />
    </div>
  );
}
