import { GoogleGenAI, Part, Type } from "@google/genai";
import { env } from "@/shared/lib/env";
import { downloadFile, uploadFile } from "@/shared/lib/object-storage";
import { BUCKETS } from "@/shared/constants/storage";

const genAI = new GoogleGenAI({apiKey: env.GEMINI_API_KEY});


const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = buffer.toString("base64");
 
  const mime= file.type;
  

  return { inlineData: { mimeType: mime, data } };
};


export async function generatePrompts(megaPrompt: string, count: number, imageFile?: File): Promise<string[]> {
  const promptContent = `
  ${megaPrompt}
  `;

  let originalImagePart: { inlineData: { mimeType: string; data: string; } } | undefined;
  if (imageFile) {
    originalImagePart = await fileToPart(imageFile);
  }

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      { text: promptContent },
      ...(originalImagePart ? [{ inlineData: originalImagePart.inlineData }] : []),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            "id": {type: Type.NUMBER},
            "concept": {type: Type.STRING},
            "visual_setup": {type: Type.STRING},
            "why_channel": {type: Type.STRING},
            "prompt_for_image_generation": {type: Type.STRING},
            "negative_prompts": {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["prompt_for_image_generation", "negative_prompts", "why_channel", "visual_setup", "concept", "id"]
        },
      },
    }
  });
  const resultArray = JSON.parse(result.text as string) || '';
  try {
    if (Array.isArray(resultArray)) {
      const results = resultArray.map((prompt) => {
        return JSON.stringify({
          prompt_for_image_generation: prompt.prompt_for_image_generation,
          negative_prompts: prompt.negative_prompts,
        })
      })
      return results
    }
  } catch (error) {
    console.error("Failed to parse prompts from AI response:", error);
  }

  // Fallback: if the AI doesn't return a valid JSON array, split the response by newlines.
  return resultArray.split('\n').filter((p: string) => p.trim().length > 0);
}

export async function generateAndStoreImage(
  prompt: string,
  referenceImageKey?: string
): Promise<{ url: string; storageKey: string }> {
  // No need to get a separate model instance, call directly on genAI.models
  const parts: Part[] = [
    { text: prompt },
  ];

  if (referenceImageKey) {
    const referenceImage = await downloadFile({
      bucket: BUCKETS.REFERENCE_IMAGES,
      key: referenceImageKey,
    });
    
    const buffer = referenceImage.body;
    const base64 = Buffer.from(buffer).toString('base64');
    parts.push({
      inlineData: {
        data: base64,
        mimeType: referenceImage.contentType
      },
    });
  }
  const result = await genAI.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: parts,
    config: {
      // @ts-ignore
      imageConfig: {
        imageSize: '2K',
      },
      tools: [{ googleSearch: {} }],
    },
  });

  const imagePartFromResponse = result.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePartFromResponse?.inlineData) {
    const { mimeType, data } = imagePartFromResponse.inlineData;
  
    const imageBuffer = Buffer.from(data as string, 'base64');
    const key = `${Date.now()}-generated-image.${mimeType?.split('/')[1]}`;
  
    await uploadFile({
      bucket: BUCKETS.GENERATED_IMAGES,
      key,
      body: imageBuffer,
      contentType: mimeType,
    });
    return { url:`${BUCKETS.GENERATED_IMAGES}/${key}` , storageKey: key };
  }

  console.error("Model response did not contain an image part.", result);
  throw new Error("The AI model did not return an image. Please try again.");

}
