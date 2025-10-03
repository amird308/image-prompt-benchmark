import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/lib/database';

export async function GET() {
  try {
    const batches = await db.batch.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        prompts: {
          include: {
            generatedImages: true,
          },
        },
        referenceImages: true,
      },
    });
    return NextResponse.json(batches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompts, referenceImageId, imageCountPerPrompt } = await request.json();
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: 'Prompts are required' }, { status: 400 });
    }

    if (referenceImageId) {
      const existingReferenceImage = await db.referenceImage.findUnique({
        where: { id: referenceImageId },
      });

      if (!existingReferenceImage) {
        return NextResponse.json({ error: 'Reference image not found' }, { status: 400 });
      }
    }

    

    const batch = await db.batch.create({
      data: {
        imageCountPerPrompt: imageCountPerPrompt || 1,
        prompts: {
          create: prompts.map((prompt: string) => ({ text: prompt })),
        },
        ...(referenceImageId && {
          referenceImages: {
            connect: [{
              id: referenceImageId,
            }],
          },
        }),
      },
    });

    // Trigger image generation process in the background
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/batches/${batch.id}/generate`, {
      method: 'POST',
    });
    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
