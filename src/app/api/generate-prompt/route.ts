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

    const systemPrompt = `You are Prompt It — an elite AI Prompt Engineer with deep multimodal reasoning capabilities.
Your task is to thoroughly analyze the user's input ${attachedFile ? '(including analyzing the attached image/file details)' : ''} and craft a high-performing, professionally structured AI prompt tailored specifically for ${platform} (${category} category).

Target Platform: ${platform}
Category: ${category}
User Input: "${userInput || 'Analyze the attached image/file and create an optimized prompt'}"

Analyze the visual elements, text content, key subjects, missing details, tone, format, and edge cases.
Respond strictly with a valid JSON object matching this exact schema (no markdown wrap, pure JSON):

{
  "optimizedPrompt": "The full, professionally structured and optimized prompt for ${platform}",
  "tips": ["Tip 1 on how to use this prompt", "Tip 2 on prompt refinement", "Tip 3 on getting best results"],
  "qualityScore": 95,
  "exampleOutput": "An example snippet demonstrating what the AI will produce when given this prompt"
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
