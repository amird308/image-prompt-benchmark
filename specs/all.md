# **Specification Document – Prompt Testing Application**

## **Overview**

This web application is designed to help users **create, test, and manage prompts** for image generation models.
The workflow supports generating prompts automatically from text and images, editing them, and running them in batches with optional reference images.

---

## **Page 1 – Prompt Creation**

### **Section 1: Mega Prompt Generator**

**Purpose**: Allow users to input a **mega prompt** (text + reference images) and automatically generate multiple smaller prompts.

**Inputs**:

* **Text Input**: Large textarea for writing the mega prompt.
* **Image Upload**: Multiple image upload (acts as *reference images*).

**Features**:

1. **Set Prompt Count**

   * Numeric input to define how many prompts to generate.
   * Default: `5`.
2. **Generate Prompts**

   * Button to auto-generate multiple prompts from the mega prompt.
   * Each generated prompt displayed in its own editable **textarea**.
   * Users can modify each prompt before running them.
3. **Assign Reference Images**

   * Uploaded images are automatically stored as reference images.
   * These can be reused in **Section 2**.

---

### **Section 2: Batch Prompt Runner**

**Purpose**: Manually input multiple prompts and run them as a batch.

**Inputs**:

* **Multi-prompt Input**: User can add multiple prompts (textareas).
* **Reference Image (Optional)**: Select from uploaded reference images

**Features**:

1. **Set Image Count per Prompt**

   * Numeric input to define how many images should be generated for each prompt.
   * Default: `1`.
2. **Reference Image Option**

   * Checkbox: "Use reference image for all prompts."
   * If selected, applies the chosen reference image to every prompt in the batch.
3. **Run Batch**

   * Button to execute the batch.
   * Status indicator for progress (e.g., pending → generating → completed).

---

## **Page 2 – Batch Management & Results**

**Purpose**: Show a history of generated batches and their results.

**Features**:

1. **Batch List**

   * Display all previously run batches in a list/table.
   * Each entry shows:

     * Batch ID / Name
     * Number of prompts
     * Date & time
     * Status (Completed, Running, Failed)
2. **Batch Details View**

   * Clicking a batch expands to show:

     * All prompts in that batch
     * Reference image used (if any)
     * Count of images per prompt
     * Generated images (thumbnails grid)
3. **Actions**

   * Download results (zip with images + prompts metadata).
   * Re-run batch (with same settings).
   * Delete batch.

---

## **Technical Notes**

* **Data Persistence**: Store prompts, images, and batch results (database using prisma and object-storage in src/shared/lib).
* **AI intgration**: use google/genai  
* **Image Handling**: Support multiple image uploads, preview, and selection.
* **Editable Prompts**: After generation, users must be able to refine prompts manually.
* **Batch Execution**: Backend service/API call handles image generation requests.

---

google/genai   samples:
       
# 1

```
textPrompt = "Create a side view picture of that cat, in a tropical forest, eating a nano-banana, under the stars";

response = await ai.models.generateContent({
  model: MODEL_ID,
  contents: [
    { text: textPrompt },
    {
      inlineData: {
        data: catImage,
        mimeType: "image/png"
      }
    }
  ]
});

for (const part of response.candidates[0].content.parts) {
  if (part.text !== undefined) {
    console.log(part.text);
  } else if (part.inlineData !== undefined) {
    catImage = part.inlineData.data;
    console.image(catImage);
  }
}
```

# 2
```
imageGenerator = new GoogleGenAI({ apiKey: env.IMAGE_GENERATOR_API_KEY });
const result = await imageGenerator.models.generateContent({
  model: 'gemini-2.5-flash-image-preview',
  contents: { parts: [{ text: prompt }] },
  config: { responseModalities: [Modality.IMAGE] },
});

```

# 3