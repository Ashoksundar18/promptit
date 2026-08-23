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

${attachedFile ? `CRITICAL INSTRUCTION FOR IMAGE-TO-IMAGE REVERSE ENGINEERING & PROMPT GENERATION:
The user attached/pasted an image into Prompt It.
The user will upload their photo alongside your generated text prompt to ${platform}.

YOUR TASK:
Examine the uploaded image with 100% precision and craft a prompt for ${platform}:

1. VERBATIM TEXT TRANSCRIPTION (OCR): Read and transcribe EVERY single word visible in the image word-for-word in quotes (e.g., if it says "YEAH I DON'T GOT NO TIME FOR NO DRAMA", transcribe EXACTLY those words in quotes!). Specify text style, font type (e.g., bold uppercase sans-serif text overlay), 2D vs 3D, and layering relative to the subject (e.g., placed behind the head and body).
2. EXACT POSE & GESTURE: Describe the subject's exact stance (e.g., hands raised touching hood/head, elbows bent outwards, side-profile posture, head tilted downward).
3. EXACT OUTFIT & FIT: Describe clothing (e.g., oversized light grey hoodie, wide-leg black tactical cargo trousers, white sneakers, dark sunglasses).
4. LIGHTING & NEON AURA: Describe neon aura glow outline along the body contours (e.g., electric purple/blue glow outline), dark moody street lighting, wet asphalt reflections.
5. ENVIRONMENT & CAMERA: Dark urban street setting, overhead power lines, 9:16 vertical aspect ratio, eye-level framing, soft background depth blur.

DO NOT output meta-roles or generic summaries. Output the EXACT, READY-TO-USE PROMPT that instructs ${platform} to transform the user's photo to match this exact aesthetic!` : `Your task is to take the user's input and craft a high-performing, professionally structured AI prompt tailored specifically for ${platform} (${category} category).`}

Target Platform: ${platform}
Category: ${category}
User Input: "${userInput || 'Create a 100% detailed image-to-image prompt to make my photo match this reference image'}"

Respond strictly with a valid JSON object matching this exact schema (no markdown wrap, pure JSON):

{
  "optimizedPrompt": "The exact ready-to-use prompt that the user will copy and paste into ${platform} alongside their uploaded image",
  "tips": ["Upload your photo + paste this prompt into ${platform}", "Tip on customizing text in quotes", "Tip on platform settings"],
  "qualityScore": 99,
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
