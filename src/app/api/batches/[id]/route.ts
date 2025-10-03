import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/lib/database';

export async function GET(
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
        prompts: {
          include: {
            generatedImages: true,
          },
        },
        referenceImages: true,
      },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  {
    params,
  }:  Readonly<{
    params: Promise<{ id: string }>;
  }>
)  {
  try {
    const {id} = await params;
    await db.batch.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
