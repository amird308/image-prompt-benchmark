import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/database';
import { generateAndStoreImage } from '@/shared/lib/ai/generation';
export async function POST(
  req: Request, 
  {
    params,
  }:  Readonly<{
    params: Promise<{ id: string }>;
  }>
) {
  const {id} = await params;
  try {
    const batch = await db.batch.findUnique({
      where: {
        id: id,
      },
      include: {
        prompts: true,
        referenceImages: true,
      },
    });
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    await db.batch.update({
      where: { id: id },
      data: { status: 'RUNNING' },
    });
 
    const referenceImageKey = batch.referenceImages[0].storageKey;

    const generationTasks = batch.prompts.flatMap((prompt) =>
      Array.from({ length: batch.imageCountPerPrompt }).map(async () => {
        const { url, storageKey } = await generateAndStoreImage(
          prompt.text,
          referenceImageKey
        );

        return db.generatedImage.create({
          data: {
            url,
            storageKey,
            promptId: prompt.id,
          },
        });
      })
    );

    await Promise.all(generationTasks);

    await db.batch.update({
      where: { id: id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({ message: 'Image generation completed' });
  } catch (error) {
    console.error(error);
    await db.batch.update({
      where: { id: id },
      data: { status: 'FAILED' },
    });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
