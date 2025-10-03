import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/lib/database';

export async function POST(
  req: Request, 
  {
    params,
  }:  Readonly<{
    params: Promise<{ id: string }>;
  }>
) {
  try {
    const {id} = await params;
    const originalBatch = await db.batch.findUnique({
      where: {
        id: id,
      },
      include: {
        prompts: true,
        referenceImages: true,
      },
    });

    if (!originalBatch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const newBatch = await db.batch.create({
      data: {
        imageCountPerPrompt: originalBatch.imageCountPerPrompt,
        prompts: {
          create: originalBatch.prompts.map((prompt) => ({ text: prompt.text })),
        },
        referenceImages: {
          connect: originalBatch.referenceImages.map((image) => ({ id: image.id })),
        },
      },
    });

    // TODO: Trigger image generation process here

    return NextResponse.json(newBatch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
