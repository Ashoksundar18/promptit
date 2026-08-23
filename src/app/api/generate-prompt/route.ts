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

${attachedFile ? `CRITICAL INSTRUCTION FOR IMAGE REVERSE-ENGINEERING:
The user has attached/pasted an image into Prompt It.
NOTE: The target AI platform (${platform}) will NOT see this image. The user will ONLY copy and paste the text prompt generated here.
Therefore, perform an EXHAUSTIVE REVERSE-ENGINEERING and VISUAL ANALYSIS of the image to translate ALL of its visual features into an impeccably detailed text prompt.

Your generated prompt MUST thoroughly cover:
1. SUBJECT & POSE: Subject details, body posture, expression, clothing style (fabrics, fit, shoes, accessories).
2. TYPOGRAPHY & TEXT OVERLAYS: Exact text wording (transcribe all visible text exactly), font style, 3D vs 2D positioning, depth layering relative to subject.
3. VISUAL EFFECTS & LIGHTING: Outline glows, aura effects (color, edge highlights), volumetric rays, shadow intensity, color grading.
4. ENVIRONMENT & BACKGROUND: Setting, street atmosphere, architecture, depth of field/background blur.
5. CAMERA & AESTHETIC: Camera angle, lens type (e.g. 35mm, portrait lens), color palette tones, overall aesthetic.` : `Your task is to take the user's input and craft a high-performing, professionally structured AI prompt tailored specifically for ${platform} (${category} category).`}

Target Platform: ${platform}
Category: ${category}
User Input: "${userInput || 'Reverse-engineer this image and create an optimized prompt that captures all its visual essentials'}"

Respond strictly with a valid JSON object matching this exact schema (no markdown wrap, pure JSON):

{
  "optimizedPrompt": "The full, professionally structured text prompt covering all essential elements for ${platform}",
  "tips": ["Tip 1 on refining this prompt", "Tip 2 on customizing style/text", "Tip 3 on platform usage"],
  "qualityScore": 98,
  "exampleOutput": "A preview of the visual output or text result that ${platform} will generate"
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
