import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/shared/lib/object-storage';
import { db } from '@/shared/lib/database';
import { BUCKETS } from '@/shared/constants/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileContent = Buffer.from(await file.arrayBuffer());
    const key = `${Date.now()}-${file.name}`;

    await uploadFile({
      bucket: BUCKETS.REFERENCE_IMAGES,
      key,
      body: fileContent,
      contentType: file.type,
    });


    const referenceImage = await db.referenceImage.create({
      data: {
        url: `${BUCKETS.REFERENCE_IMAGES}/${key}`,
        storageKey: key,
        mimeType: file.type,
      },
    });

    return NextResponse.json(referenceImage);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
