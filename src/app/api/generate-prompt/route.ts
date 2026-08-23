import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateOptimizedPrompt } from '@/lib/ai-engine';
import type { AIPlatform, PromptCategory } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const { userInput, platform, category, attachedFile } = await req.json();

    if ((!userInput || !userInput.trim()) && !attachedFile) {
      return NextResponse.json({ message: 'User input or attached file is required' }, { status: 400 });
    }

    const userApiKey = req.headers.get('x-user-api-key');
    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    // Fallback to local AI engine if no Gemini API key is configured
    if (!apiKey) {
      const localResult = generateOptimizedPrompt(
        userInput || (attachedFile ? attachedFile.name : ''),
        (platform as AIPlatform) || 'chatgpt',
        (category as PromptCategory) || 'content'
      );
      return NextResponse.json(localResult);
    }

    // Call Google Gemini API for real LLM multimodal reasoning & prompt engineering
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const contents: any[] = [];

    // Attach image/file data for Gemini Multimodal Vision if present
    if (attachedFile && attachedFile.base64) {
      contents.push({
        inlineData: {
          data: attachedFile.base64,
          mimeType: attachedFile.type || 'image/png',
        },
      });
    }

    const systemPrompt = `You are Prompt It — an elite AI Prompt Engineer and Visual Architect.

${attachedFile ? `CRITICAL INSTRUCTION FOR IMAGE-TO-IMAGE PROMPT GENERATION:
The user has attached/pasted a reference image into Prompt It.
The user INTENDS to upload this SAME photo (or their own selfie) alongside your generated text prompt to the target AI platform (${platform}).

Your task:
Analyze the attached image and write a 100% detailed, high-performance image-to-image prompt instructing ${platform} to transform the user's uploaded photo into this exact visual style!

The generated prompt MUST include:
1. DIRECT INSTRUCTIONS FOR THE AI PLATFORM: Tell ${platform} to use the user's uploaded reference image for facial features, pose, and structure.
2. SUBJECT & POSE MATCHING: Preserving subject identity, posture, outfit (hoodie, cargo pants, white sneakers, dark sunglasses).
3. TYPOGRAPHY & TEXT OVERLAY: Exact text transcription (e.g. transcribe any text in quotes: "YEAH I DON'T GOT NO TIME FOR NO DRAMA"), 3D depth, positioning.
4. LIGHTING & GLOW EFFECTS: Neon purple/blue edge highlights, aura outlines, street lighting.
5. ENVIRONMENT & CAMERA: Urban street backdrop, soft bokeh depth of field, 35mm portrait lens angle, color grading.

DO NOT return generic meta-instructions (like "Act as a content strategist"). Return the EXACT, READY-TO-USE PROMPT that the user will copy and paste into ${platform} along with their photo.` : `Your task is to take the user's input and craft a high-performing, professionally structured AI prompt tailored specifically for ${platform} (${category} category).`}

Target Platform: ${platform}
Category: ${category}
User Input: "${userInput || 'Create a detailed image-to-image prompt to make my uploaded photo look like this reference image'}"

Respond strictly with a valid JSON object matching this exact schema (no markdown wrap, pure JSON):

{
  "optimizedPrompt": "The exact ready-to-use prompt that the user will copy and paste into ${platform} alongside their uploaded image",
  "tips": ["Upload your photo + paste this prompt into ${platform}", "Tip 2 on adjusting text/style", "Tip 3 on platform settings"],
  "qualityScore": 98,
  "exampleOutput": "Description of the final transformed photo ${platform} will generate"
}`;

    contents.push(systemPrompt);

    const result = await model.generateContent(contents);
    const responseText = result.response.text();

    // Clean up potential markdown formatting in JSON response
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    return NextResponse.json({
      optimizedPrompt: parsed.optimizedPrompt || responseText,
      platform: platform as AIPlatform,
      category: category as PromptCategory,
      tips: parsed.tips || ['Be specific in follow-up queries', 'Provide context for complex tasks'],
      qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 90,
      exampleOutput: parsed.exampleOutput || 'AI generated response preview...',
    });
  } catch (error: any) {
    console.warn('AI API Error (falling back to local engine):', error?.message || error);

    // Fallback to local AI engine on any error
    try {
      const body = await req.clone().json();
      const localResult = generateOptimizedPrompt(
        body.userInput || '',
        (body.platform as AIPlatform) || 'chatgpt',
        (body.category as PromptCategory) || 'content'
      );
      return NextResponse.json(localResult);
    } catch {
      return NextResponse.json({ message: 'Generation error' }, { status: 500 });
    }
  }
}
