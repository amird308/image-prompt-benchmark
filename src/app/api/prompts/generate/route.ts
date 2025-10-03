import { NextRequest, NextResponse } from 'next/server';
import { generatePrompts } from '@/shared/lib/ai/generation';
import { BUCKETS } from '@/shared/constants/storage';
import { db } from '@/shared/lib/database';
import { downloadFile } from '@/shared/lib/object-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const megaPrompt = formData.get('megaPrompt') as string | null;
    const count = formData.get('count') as string | null;
    const referenceImages =  formData.get('referenceImages') as string | null;
    if (!megaPrompt) {
      return NextResponse.json({ error: 'Mega prompt is required' }, { status: 400 });
    }

    let file: File | undefined;

    if (referenceImages) {
      const referenceImage = await db.referenceImage.findFirst({
        where: { storageKey: referenceImages },
        select: { mimeType: true },
      });

      if (referenceImage) {
        const buffer = await downloadFile({
          bucket: BUCKETS.REFERENCE_IMAGES,
          key: referenceImages,
        });
        // Convert buffer to File object
        file = new File([new Uint8Array(buffer.body)], referenceImages, { type: referenceImage.mimeType });

      } 
    }

    const prompts = await generatePrompts(
      megaPrompt,
      Number(count) || 5,
      file
    );
    console.log(prompts);
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
