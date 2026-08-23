// ═══════════════════════════════════════════════
//  PROMPT IT — AI Engine v2
//  Smart prompt optimization with intent analysis
// ═══════════════════════════════════════════════

export type AIPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'sora' | 'copilot' | 'antigravity';

export type PromptCategory = 'study' | 'content' | 'developer' | 'business' | 'creative';

export interface GeneratedPrompt {
  optimizedPrompt: string;
  platform: AIPlatform;
  category: PromptCategory;
  tips: string[];
  qualityScore: number;
  exampleOutput: string;
}

// ─── Intent Detection ───
// Instead of using the same template, detect WHAT the user actually wants

type Intent =
  | 'explain'
  | 'compare'
  | 'create'
  | 'list'
  | 'debug'
  | 'analyze'
  | 'summarize'
  | 'brainstorm'
  | 'convert'
  | 'review'
  | 'plan'
  | 'teach'
  | 'general';

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase();

  // Order matters — more specific patterns first
  const intentPatterns: { intent: Intent; patterns: RegExp[] }[] = [
    { intent: 'debug', patterns: [/\b(fix|bug|error|crash|broken|not working|issue|fail|wrong|debug)\b/i] },
    { intent: 'compare', patterns: [/\b(compare|vs\.?|versus|difference|between|better|pros.?cons|which one)\b/i] },
    { intent: 'convert', patterns: [/\b(convert|translate|transform|change.+to|turn.+into|rewrite|migrate|port)\b/i] },
    { intent: 'review', patterns: [/\b(review|critique|feedback|improve|optimize|refactor|check|audit)\b/i] },
    { intent: 'plan', patterns: [/\b(plan|roadmap|strategy|schedule|timeline|steps to|how to start|approach)\b/i] },
    { intent: 'brainstorm', patterns: [/\b(brainstorm|ideas?|suggest|come up with|think of|creative|inspire)\b/i] },
    { intent: 'summarize', patterns: [/\b(summarize|summary|tldr|overview|brief|recap|key points|gist)\b/i] },
    { intent: 'list', patterns: [/\b(list|top \d+|best \d+|give me \d+|examples of|types of|ways to|tools for)\b/i] },
    { intent: 'analyze', patterns: [/\b(analyze|analysis|break ?down|evaluate|assess|examine|study|interpret|deep dive)\b/i] },
    { intent: 'explain', patterns: [/\b(explain|what is|how does|why does|teach me|understand|concept|mean|define)\b/i] },
    { intent: 'teach', patterns: [/\b(learn|tutorial|guide|course|teach|lesson|beginner|step.?by.?step|walkthrough)\b/i] },
    { intent: 'create', patterns: [/\b(create|build|make|write|design|generate|develop|implement|code|draw|compose)\b/i] },
  ];

  for (const { intent, patterns } of intentPatterns) {
    if (patterns.some((p) => p.test(lower))) return intent;
  }

  return 'general';
}

// ─── Specifics Extraction ───
// Pull out concrete details from the input

interface InputAnalysis {
  intent: Intent;
  subject: string;
  audience: string;
  format: string;
  constraints: string[];
  details: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  wordCount: number;
}

function analyzeInput(input: string): InputAnalysis {
  const lower = input.toLowerCase();
  const wordCount = input.split(/\s+/).length;
  const intent = detectIntent(input);

  // Extract subject - what are they talking about?
  const subject = extractSubject(input);

  // Detect audience
  const audience = detectAudience(lower);

  // Detect desired format
  const format = detectFormat(lower);

  // Extract constraints
  const constraints = extractConstraints(lower);

  // Extract specific details/requirements
  const details = extractDetails(input);

  // Complexity
  const complexity = wordCount > 30 ? 'complex' : wordCount > 12 ? 'moderate' : 'simple';

  return { intent, subject, audience, format, constraints, details, complexity, wordCount };
}

function extractSubject(input: string): string {
  const lower = input.toLowerCase();

  // Tech topics
  if (/\b(react|next\.?js|vue|angular|svelte)\b/i.test(lower)) return 'frontend development';
  if (/\b(node|express|fastapi|django|spring|rails)\b/i.test(lower)) return 'backend development';
  if (/\b(python)\b/i.test(lower)) return 'Python programming';
  if (/\b(javascript|typescript)\b/i.test(lower)) return 'JavaScript/TypeScript';
  if (/\b(rust|go|golang|c\+\+|java|swift|kotlin)\b/i.test(lower)) return 'systems programming';
  if (/\b(sql|database|postgres|mongo|redis)\b/i.test(lower)) return 'database engineering';
  if (/\b(docker|kubernetes|aws|cloud|devops|ci.?cd)\b/i.test(lower)) return 'DevOps & cloud';
  if (/\b(machine learning|ml|ai|neural|deep learning|llm|gpt)\b/i.test(lower)) return 'AI/ML';
  if (/\b(api|rest|graphql|websocket|grpc)\b/i.test(lower)) return 'API development';

  // Business
  if (/\b(marketing|seo|ads|campaign|brand)\b/i.test(lower)) return 'digital marketing';
  if (/\b(startup|venture|funding|pitch|investor)\b/i.test(lower)) return 'startup/entrepreneurship';
  if (/\b(revenue|sales|pricing|growth|conversion)\b/i.test(lower)) return 'business growth';
  if (/\b(management|leadership|team|hiring|culture)\b/i.test(lower)) return 'leadership & management';
  if (/\b(finance|budget|investment|profit|roi)\b/i.test(lower)) return 'finance & accounting';

  // Content/Creative
  if (/\b(blog|article|post|newsletter|copy)\b/i.test(lower)) return 'content writing';
  if (/\b(video|youtube|tiktok|reel|short)\b/i.test(lower)) return 'video content';
  if (/\b(design|ui|ux|figma|graphic)\b/i.test(lower)) return 'design';
  if (/\b(story|novel|fiction|character|plot)\b/i.test(lower)) return 'creative writing';
  if (/\b(music|song|lyrics|melody|beat)\b/i.test(lower)) return 'music';
  if (/\b(photo|image|picture|visual|illustration)\b/i.test(lower)) return 'visual media';

  // Academic
  if (/\b(math|calculus|algebra|equation|theorem)\b/i.test(lower)) return 'mathematics';
  if (/\b(physics|quantum|mechanics|relativity)\b/i.test(lower)) return 'physics';
  if (/\b(chemistry|molecule|reaction|element)\b/i.test(lower)) return 'chemistry';
  if (/\b(biology|cell|dna|evolution|ecology)\b/i.test(lower)) return 'biology';
  if (/\b(history|war|civilization|empire|century)\b/i.test(lower)) return 'history';
  if (/\b(psychology|behavior|cognitive|mental)\b/i.test(lower)) return 'psychology';
  if (/\b(economics|economy|inflation|gdp|market)\b/i.test(lower)) return 'economics';

  // Health/Fitness
  if (/\b(health|fitness|workout|diet|nutrition|exercise)\b/i.test(lower)) return 'health & fitness';
  if (/\b(recipe|cooking|food|meal|ingredient)\b/i.test(lower)) return 'cooking & recipes';

  // Extract last meaningful noun phrase as fallback
  const words = input.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  if (words.length > 0) return words.slice(-Math.min(3, words.length)).join(' ');

  return 'the given topic';
}

function detectAudience(lower: string): string {
  if (/\b(beginner|newbie|starter|basic|intro|noob)\b/.test(lower)) return 'beginners';
  if (/\b(advanced|expert|senior|experienced|deep)\b/.test(lower)) return 'advanced users';
  if (/\b(kid|child|young|student|school)\b/.test(lower)) return 'students';
  if (/\b(team|colleague|stakeholder|client|boss)\b/.test(lower)) return 'professional audience';
  if (/\b(technical|developer|engineer)\b/.test(lower)) return 'technical audience';
  return '';
}

function detectFormat(lower: string): string {
  if (/\b(table|spreadsheet|csv)\b/.test(lower)) return 'table format';
  if (/\b(json|xml|yaml)\b/.test(lower)) return 'structured data';
  if (/\b(list|bullet|numbered)\b/.test(lower)) return 'bullet list';
  if (/\b(essay|paragraph|long.?form)\b/.test(lower)) return 'long-form prose';
  if (/\b(code|script|function|program)\b/.test(lower)) return 'code';
  if (/\b(email|letter|message)\b/.test(lower)) return 'email/message';
  if (/\b(presentation|slide|deck|ppt)\b/.test(lower)) return 'presentation';
  if (/\b(diagram|flowchart|chart)\b/.test(lower)) return 'visual diagram';
  return '';
}

function extractConstraints(lower: string): string[] {
  const constraints: string[] = [];
  if (/\b(\d+)\s*words?\b/.test(lower)) constraints.push(`Word limit: ${RegExp.$1} words`);
  if (/\b(short|brief|concise)\b/.test(lower)) constraints.push('Keep it short and concise');
  if (/\b(detailed|comprehensive|thorough)\b/.test(lower)) constraints.push('Be thorough and detailed');
  if (/\b(simple|easy|plain)\b/.test(lower)) constraints.push('Use simple, accessible language');
  if (/\b(formal|professional)\b/.test(lower)) constraints.push('Maintain a formal tone');
  if (/\b(casual|friendly|conversational)\b/.test(lower)) constraints.push('Use a casual, friendly tone');
  if (/\b(no|without|avoid|don'?t)\s+(\w+)/i.test(lower)) constraints.push('Avoid: noted exclusions');
  return constraints;
}

function extractDetails(input: string): string[] {
  const details: string[] = [];
  // Numbers/quantities
  const numberMatches = input.match(/\b(\d+)\s+(things?|items?|points?|examples?|tips?|ways?|reasons?|steps?|ideas?)/gi);
  if (numberMatches) details.push(...numberMatches);
  // Quoted text (user emphasis)
  const quotes = input.match(/"([^"]+)"/g);
  if (quotes) details.push(...quotes);
  return details;
}

// ─── Smart Prompt Builders ───
// Each builder adapts based on intent, not just category

function buildChatGPTPrompt(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const parts: string[] = [];

  // 1. Role — varies by intent, not always the same
  const role = getSmartRole(analysis, category);
  parts.push(`Act as ${role}.`);

  // 2. Context — only add if useful
  if (analysis.audience) {
    parts.push(`\nThe audience is ${analysis.audience}. Adjust complexity and language accordingly.`);
  }

  // 3. Task — rewritten based on intent
  parts.push(`\n## Task`);
  parts.push(rewriteTask(input, analysis));

  // 4. Format requirements — varies by intent
  parts.push(`\n## Requirements`);
  parts.push(getIntentRequirements(analysis, 'chatgpt'));

  // 5. Constraints
  if (analysis.constraints.length > 0) {
    parts.push(`\n## Constraints`);
    analysis.constraints.forEach(c => parts.push(`- ${c}`));
  }

  // 6. Format — only if detected or needed
  if (analysis.format) {
    parts.push(`\n**Output format:** ${analysis.format}`);
  }

  return parts.join('\n');
}

function buildClaudePrompt(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const role = getSmartRole(analysis, category);
  const parts: string[] = [];

  parts.push(`You are ${role}.`);

  // Context block
  const contextParts: string[] = [];
  contextParts.push(`Subject: ${analysis.subject}`);
  if (analysis.audience) contextParts.push(`Target audience: ${analysis.audience}`);
  if (analysis.complexity === 'complex') contextParts.push('This is a complex request — be comprehensive.');

  parts.push(`\n<context>\n${contextParts.join('\n')}\n</context>`);

  // Task — rewritten
  parts.push(`\n<task>\n${rewriteTask(input, analysis)}\n</task>`);

  // Requirements — intent-specific
  parts.push(`\n<requirements>\n${getIntentRequirements(analysis, 'claude')}\n</requirements>`);

  // Format
  if (analysis.format) {
    parts.push(`\n<format>\nDeliver the response as: ${analysis.format}\n</format>`);
  }

  // Thinking prompt for complex tasks
  if (analysis.complexity === 'complex' || analysis.intent === 'analyze' || analysis.intent === 'debug') {
    parts.push(`\n<thinking>\nBefore answering, consider: What's the core problem? What assumptions am I making? What would make this maximally useful?\n</thinking>`);
  }

  return parts.join('\n');
}

function buildGeminiPrompt(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const role = getSmartRole(analysis, category);
  const parts: string[] = [];

  parts.push(`**Role:** ${role}`);

  // Direct instruction
  parts.push(`\n**Request:** ${rewriteTask(input, analysis)}`);

  // Few-shot example based on intent
  const example = getIntentExample(analysis);
  if (example) {
    parts.push(`\n**Example of what I'm looking for:**\n${example}`);
  }

  // Requirements
  parts.push(`\n**Guidelines:**\n${getIntentRequirements(analysis, 'gemini')}`);

  if (analysis.audience) {
    parts.push(`\n**Audience:** ${analysis.audience} — adjust depth and jargon accordingly.`);
  }

  if (analysis.format) {
    parts.push(`\n**Format:** ${analysis.format}`);
  }

  return parts.join('\n');
}

function buildPerplexityPrompt(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const parts: string[] = [];

  // Perplexity works best with research-framed questions
  parts.push(`**Research Question:**`);
  parts.push(rewriteAsResearchQuestion(input, analysis));

  parts.push(`\n**Focus Area:** ${analysis.subject}`);

  // Source guidance based on intent
  parts.push(`\n**Source Requirements:**`);
  if (analysis.intent === 'compare') {
    parts.push('- Find sources that cover each option being compared');
    parts.push('- Include benchmark data or case studies where available');
    parts.push('- Note which sources favor which option and why');
  } else if (analysis.intent === 'explain') {
    parts.push('- Prioritize authoritative educational sources');
    parts.push('- Include both beginner-friendly and technical explanations');
    parts.push('- Use recent sources to ensure current accuracy');
  } else if (analysis.intent === 'analyze') {
    parts.push('- Include data-driven sources with statistics and metrics');
    parts.push('- Find expert opinions and analysis from domain authorities');
    parts.push('- Include contrasting perspectives where they exist');
  } else {
    parts.push('- Use credible, recent sources (prefer last 2 years)');
    parts.push('- Include diverse perspectives');
    parts.push('- Cite all major claims');
  }

  parts.push(`\n**Output:**`);
  parts.push('- Lead with key findings');
  parts.push('- Use inline citations');
  parts.push('- Distinguish facts from opinions');
  if (analysis.format) parts.push(`- Format as: ${analysis.format}`);

  return parts.join('\n');
}

function buildSoraPrompt(input: string, analysis: InputAnalysis): string {
  // Sora is for video — rewrite the input as a cinematic description
  const parts: string[] = [];

  parts.push(`**Scene:** ${input}`);

  // Auto-detect what kind of video this is
  const lower = input.toLowerCase();
  let videoType = 'cinematic scene';
  if (/\b(product|commercial|ad|advertisement)\b/.test(lower)) videoType = 'product commercial';
  if (/\b(tutorial|how.?to|explainer|demo)\b/.test(lower)) videoType = 'explainer video';
  if (/\b(music|lyric|abstract|art)\b/.test(lower)) videoType = 'artistic/abstract video';
  if (/\b(nature|landscape|aerial|drone)\b/.test(lower)) videoType = 'nature documentary shot';
  if (/\b(animation|cartoon|anime|3d)\b/.test(lower)) videoType = 'animated sequence';

  parts.push(`\n**Video Type:** ${videoType}`);

  parts.push(`\n**Camera Direction:**`);
  parts.push(`- Opening shot: Wide establishing shot to set the scene`);
  parts.push(`- Main subject: Track smoothly, use shallow depth of field`);
  parts.push(`- Movement: Deliberate, cinematic — no handheld shake`);

  parts.push(`\n**Visual Style:**`);
  if (videoType === 'product commercial') {
    parts.push('- Clean, high-key lighting with soft shadows');
    parts.push('- Minimal background, focus on product details');
    parts.push('- Smooth, slow reveals with elegant transitions');
  } else if (videoType === 'nature documentary shot') {
    parts.push('- Natural lighting, golden hour preferred');
    parts.push('- Rich colors, deep contrast');
    parts.push('- Slow, patient pacing — let the scene breathe');
  } else {
    parts.push('- Motivated lighting appropriate to the scene');
    parts.push('- Color palette that matches the mood');
    parts.push('- Cinematic composition (rule of thirds)');
  }

  parts.push(`\n**Technical:** 4K, 24fps cinematic, 10-15 seconds`);

  return parts.join('\n');
}

function buildCopilotPrompt(input: string, analysis: InputAnalysis): string {
  const parts: string[] = [];

  // Detect language
  const lang = detectLanguage(input);
  parts.push(`**Language:** ${lang.language}${lang.framework ? ` (${lang.framework})` : ''}`);

  // Task — rewritten for code context
  parts.push(`\n**Task:** ${rewriteTask(input, analysis)}`);

  // Intent-specific code requirements
  if (analysis.intent === 'debug') {
    parts.push(`\n**Debugging Requirements:**`);
    parts.push('1. Identify the root cause of the issue');
    parts.push('2. Explain WHY the bug occurs');
    parts.push('3. Provide the corrected code');
    parts.push('4. Add a test case that catches this bug');
  } else if (analysis.intent === 'review') {
    parts.push(`\n**Code Review Focus:**`);
    parts.push('1. Security vulnerabilities');
    parts.push('2. Performance bottlenecks');
    parts.push('3. Code style & best practices');
    parts.push('4. Suggest specific improvements with refactored code');
  } else if (analysis.intent === 'convert') {
    parts.push(`\n**Migration Requirements:**`);
    parts.push('1. Maintain identical functionality');
    parts.push('2. Use idiomatic patterns in the target language/framework');
    parts.push('3. Note any behavioral differences between source and target');
  } else {
    parts.push(`\n**Code Requirements:**`);
    parts.push('1. Production-ready with proper error handling');
    parts.push('2. Full type definitions (no `any`)');
    parts.push('3. Inline comments for complex logic');
    parts.push('4. Include usage example');
    if (analysis.complexity === 'complex') {
      parts.push('5. Include unit tests');
    }
  }

  return parts.join('\n');
}

function buildAntigravityPrompt(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const role = getSmartRole(analysis, category);
  const parts: string[] = [];

  parts.push(`## Agent Task`);
  parts.push(`**Role:** ${role}`);
  parts.push(`**Goal:** ${rewriteTask(input, analysis)}`);

  parts.push(`\n## Execution Strategy`);

  if (analysis.intent === 'plan') {
    parts.push('1. Research the domain and identify best practices');
    parts.push('2. Create a phased plan with milestones');
    parts.push('3. Identify risks and mitigation strategies');
    parts.push('4. Provide actionable first steps');
  } else if (analysis.intent === 'create') {
    parts.push('1. Analyze requirements and define scope');
    parts.push('2. Design the solution architecture');
    parts.push('3. Implement with full code and documentation');
    parts.push('4. Test and verify the solution works');
  } else if (analysis.intent === 'analyze') {
    parts.push('1. Gather relevant data and context');
    parts.push('2. Perform multi-angle analysis');
    parts.push('3. Draw evidence-based conclusions');
    parts.push('4. Present findings with visualizations');
  } else {
    parts.push('1. Understand the full scope of the request');
    parts.push('2. Research and gather necessary information');
    parts.push('3. Execute the task with full reasoning shown');
    parts.push('4. Review and verify the output quality');
  }

  if (analysis.constraints.length > 0) {
    parts.push(`\n## Constraints`);
    analysis.constraints.forEach(c => parts.push(`- ${c}`));
  }

  parts.push(`\n## Output`);
  parts.push('- Show your reasoning at each step');
  parts.push('- Be comprehensive and production-ready');
  if (analysis.format) parts.push(`- Format: ${analysis.format}`);

  return parts.join('\n');
}

// ─── Helper: Get smart role based on what user actually wants ───

function getSmartRole(analysis: InputAnalysis, category: PromptCategory): string {
  const { intent, subject } = analysis;

  // Specific roles based on intent + subject combination
  if (intent === 'debug') return `a senior debugging specialist in ${subject}`;
  if (intent === 'review') return `a code reviewer and quality engineer experienced in ${subject}`;
  if (intent === 'teach' || intent === 'explain') return `an expert teacher who explains ${subject} with clarity and real-world examples`;
  if (intent === 'compare') return `an unbiased analyst who can objectively compare options in ${subject}`;
  if (intent === 'brainstorm') return `a creative strategist who generates innovative ideas for ${subject}`;
  if (intent === 'plan') return `a strategic planner with deep expertise in ${subject}`;
  if (intent === 'summarize') return `a skilled communicator who can distill ${subject} into its essentials`;
  if (intent === 'analyze') return `a data-driven analyst specializing in ${subject}`;

  // Fallback to category
  const catRoles: Record<PromptCategory, string> = {
    study: `an expert educator in ${subject}`,
    content: `a professional content strategist focused on ${subject}`,
    developer: `a senior engineer specializing in ${subject}`,
    business: `a business consultant with expertise in ${subject}`,
    creative: `a creative director experienced in ${subject}`,
  };

  return catRoles[category];
}

// ─── Helper: Rewrite task based on intent ───

function rewriteTask(input: string, analysis: InputAnalysis): string {
  const { intent } = analysis;

  switch (intent) {
    case 'explain':
      return `Explain the following clearly and thoroughly. Use analogies, examples, and diagrams where helpful:\n\n${input}`;
    case 'compare':
      return `Provide an objective, balanced comparison. Create a clear structure covering pros, cons, use cases, and a recommendation:\n\n${input}`;
    case 'create':
      return `Create the following. Focus on quality, completeness, and practical usability:\n\n${input}`;
    case 'list':
      return `Provide a well-researched, organized list with brief explanations for each item:\n\n${input}`;
    case 'debug':
      return `Diagnose and fix the following issue. Explain the root cause and provide the corrected solution:\n\n${input}`;
    case 'analyze':
      return `Perform a thorough analysis of the following. Use data, frameworks, and structured reasoning:\n\n${input}`;
    case 'summarize':
      return `Provide a clear, well-structured summary capturing all key points and takeaways:\n\n${input}`;
    case 'brainstorm':
      return `Generate diverse, creative ideas for the following. Think outside the box — include both safe and bold options:\n\n${input}`;
    case 'convert':
      return `Convert/translate the following while maintaining accuracy and using idiomatic patterns:\n\n${input}`;
    case 'review':
      return `Review the following critically. Identify strengths, weaknesses, and specific suggestions for improvement:\n\n${input}`;
    case 'plan':
      return `Create a detailed, actionable plan for the following. Include phases, milestones, and contingencies:\n\n${input}`;
    case 'teach':
      return `Create a learning guide for the following. Start from fundamentals, build progressively, and include practice exercises:\n\n${input}`;
    default:
      return input;
  }
}

// ─── Helper: Research question rewriting for Perplexity ───

function rewriteAsResearchQuestion(input: string, analysis: InputAnalysis): string {
  const { intent } = analysis;

  if (intent === 'compare') return `What are the key differences, advantages, and trade-offs between the options in: "${input}"? Include recent data and expert opinions.`;
  if (intent === 'explain') return `What is the current understanding of: "${input}"? Include authoritative sources and recent developments.`;
  if (intent === 'analyze') return `What does the data and expert analysis tell us about: "${input}"? Include statistics, trends, and multiple perspectives.`;
  if (intent === 'list') return `What are the best/most notable examples of: "${input}"? Rank by relevance and include supporting evidence.`;

  return `Research the following thoroughly and provide evidence-based findings: "${input}"`;
}

// ─── Helper: Intent-specific requirements ───

function getIntentRequirements(analysis: InputAnalysis, platform: string): string {
  const { intent } = analysis;
  const lines: string[] = [];

  switch (intent) {
    case 'explain':
      lines.push('- Start with a one-sentence summary');
      lines.push('- Use analogies or real-world examples to clarify abstract concepts');
      lines.push('- Build from simple to complex');
      lines.push('- End with a "key takeaway" or practical application');
      break;
    case 'compare':
      lines.push('- Use a comparison table for quick scanning');
      lines.push('- Cover: features, performance, cost, ease of use, community/support');
      lines.push('- Give a clear recommendation based on specific use cases');
      lines.push('- Avoid bias — present each option fairly');
      break;
    case 'create':
      lines.push('- Deliver a complete, ready-to-use output');
      lines.push('- Include necessary context or setup instructions');
      lines.push('- Follow industry best practices and conventions');
      lines.push('- Add any relevant warnings or considerations');
      break;
    case 'list':
      lines.push('- Number each item clearly');
      lines.push('- Add a one-line description for each');
      lines.push('- Order by relevance or importance');
      lines.push('- Include a brief intro explaining the criteria');
      break;
    case 'debug':
      lines.push('- Identify the exact root cause');
      lines.push('- Show the fix with before/after code');
      lines.push('- Explain WHY the bug happens');
      lines.push('- Suggest how to prevent similar bugs');
      break;
    case 'analyze':
      lines.push('- Use a structured framework for analysis');
      lines.push('- Support claims with evidence or reasoning');
      lines.push('- Present findings in clear sections');
      lines.push('- Include an executive summary at the top');
      break;
    case 'brainstorm':
      lines.push('- Generate at least 8-10 ideas');
      lines.push('- Mix safe/conventional and bold/innovative ideas');
      lines.push('- Rate each idea on feasibility and impact');
      lines.push('- Highlight the top 3 recommendations');
      break;
    case 'plan':
      lines.push('- Break into clear phases with timelines');
      lines.push('- Include milestones and success metrics');
      lines.push('- Identify dependencies and risks');
      lines.push('- Provide actionable first steps');
      break;
    case 'teach':
      lines.push('- Start with prerequisites and fundamentals');
      lines.push('- Use progressive difficulty (easy → hard)');
      lines.push('- Include hands-on exercises or practice problems');
      lines.push('- Provide checkpoints to verify understanding');
      break;
    default:
      lines.push('- Be specific and actionable');
      lines.push('- Structure the response clearly');
      lines.push('- Include practical examples where relevant');
      break;
  }

  return lines.join('\n');
}

// ─── Helper: Intent-based example for Gemini few-shot ───

function getIntentExample(analysis: InputAnalysis): string {
  switch (analysis.intent) {
    case 'compare':
      return `Input: "Compare X vs Y"\nOutput: A table with criteria rows, followed by "Best for..." recommendations per use case.`;
    case 'explain':
      return `Input: "Explain concept Z"\nOutput: One-line summary → simple analogy → detailed explanation → practical example → key takeaway.`;
    case 'list':
      return `Input: "Top 5 tools for X"\nOutput: Numbered list with: tool name, one-line description, key strength, best for which use case.`;
    case 'debug':
      return `Input: "Fix this error"\nOutput: Root cause → Why it happens → Fixed code → Prevention tip.`;
    default:
      return '';
  }
}

// ─── Language detection for Copilot ───

function detectLanguage(input: string): { language: string; framework?: string } {
  const lower = input.toLowerCase();
  const langPatterns: { pattern: RegExp; language: string; framework?: string }[] = [
    { pattern: /\b(react|next\.?js|nextjs)\b/i, language: 'TypeScript', framework: 'React/Next.js' },
    { pattern: /\b(vue|nuxt)\b/i, language: 'TypeScript', framework: 'Vue/Nuxt' },
    { pattern: /\b(angular)\b/i, language: 'TypeScript', framework: 'Angular' },
    { pattern: /\b(python|django|flask|fastapi)\b/i, language: 'Python' },
    { pattern: /\b(java(?!script)|spring)\b/i, language: 'Java', framework: 'Spring' },
    { pattern: /\b(rust)\b/i, language: 'Rust' },
    { pattern: /\b(go|golang)\b/i, language: 'Go' },
    { pattern: /\b(swift|swiftui)\b/i, language: 'Swift' },
    { pattern: /\b(kotlin|android)\b/i, language: 'Kotlin' },
    { pattern: /\b(c#|csharp|\.net)\b/i, language: 'C#', framework: '.NET' },
    { pattern: /\b(php|laravel)\b/i, language: 'PHP' },
    { pattern: /\b(ruby|rails)\b/i, language: 'Ruby' },
    { pattern: /\b(sql|postgres|mysql)\b/i, language: 'SQL' },
    { pattern: /\b(html|css|tailwind)\b/i, language: 'HTML/CSS' },
  ];

  for (const { pattern, language, framework } of langPatterns) {
    if (pattern.test(lower)) return { language, framework };
  }

  return { language: 'TypeScript' };
}

// ─── Tip generation (context-aware) ───

function generateTips(platform: AIPlatform, analysis: InputAnalysis): string[] {
  const tips: string[] = [];

  // Intent-based tips
  if (analysis.intent === 'explain' && analysis.wordCount < 8) {
    tips.push('💡 Add what you already know so the explanation can start from your level.');
  }
  if (analysis.intent === 'create' && !analysis.format) {
    tips.push('💡 Specify the output format (code, essay, list, etc.) for more targeted results.');
  }
  if (analysis.intent === 'compare' && analysis.wordCount < 10) {
    tips.push('💡 Mention what criteria matter most to you (cost, speed, ease of use, etc.).');
  }
  if (analysis.intent === 'debug' && analysis.wordCount < 15) {
    tips.push('💡 Include the error message and relevant code for a more accurate fix.');
  }
  if (!analysis.audience) {
    tips.push('💡 Mention your experience level (beginner/advanced) for better-targeted responses.');
  }
  if (analysis.constraints.length === 0) {
    tips.push('💡 Add constraints like word count, tone, or things to avoid for more focused output.');
  }

  // Platform tips
  const platformSpecific: Record<AIPlatform, string[]> = {
    chatgpt: [
      '💡 ChatGPT responds well to "Act as..." — the role has been set for your task.',
      '💡 Add "Think step by step" for complex reasoning tasks.',
    ],
    claude: [
      '💡 Claude handles very long contexts — feel free to paste reference documents.',
      '💡 Claude follows XML tags precisely — the structure has been optimized.',
    ],
    gemini: [
      '💡 Try attaching an image or document — Gemini excels with multimodal inputs.',
      '💡 Ask Gemini to combine insights from multiple perspectives.',
    ],
    perplexity: [
      '💡 Perplexity is best for research — your prompt has been framed as a research question.',
      '💡 Ask follow-up questions to drill deeper into specific findings.',
    ],
    sora: [
      '💡 Be specific about camera angles and lighting for better video quality.',
      '💡 Reference a specific film or visual style for aesthetic guidance.',
    ],
    copilot: [
      '💡 The language has been auto-detected — override it in your prompt if needed.',
      '💡 Include existing code patterns for style-consistent output.',
    ],
    antigravity: [
      '💡 Antigravity works best with clear end goals — let it figure out the steps.',
      '💡 Ask it to research first, then implement, for higher quality output.',
    ],
  };

  tips.push(...platformSpecific[platform].slice(0, 1));

  return tips.slice(0, 3);
}

// ─── Quality scoring (smarter) ───

function calculateQualityScore(input: string, analysis: InputAnalysis): number {
  let score = 40;

  // Length
  if (analysis.wordCount >= 5) score += 8;
  if (analysis.wordCount >= 10) score += 8;
  if (analysis.wordCount >= 20) score += 8;
  if (analysis.wordCount >= 40) score += 6;
  if (analysis.wordCount > 100) score -= 5;

  // Clear intent detected
  if (analysis.intent !== 'general') score += 10;

  // Has audience
  if (analysis.audience) score += 5;

  // Has format
  if (analysis.format) score += 5;

  // Has constraints
  score += Math.min(analysis.constraints.length * 3, 9);

  // Has specific details
  score += Math.min(analysis.details.length * 3, 9);

  // Subject detected beyond fallback
  if (analysis.subject !== 'the given topic') score += 5;

  return Math.max(0, Math.min(100, score));
}

// ─── Example output (based on actual input, not just category) ───

function generateExampleOutput(input: string, analysis: InputAnalysis, category: PromptCategory): string {
  const { intent, subject } = analysis;
  const topic = input.length > 60 ? input.substring(0, 60) + '...' : input;

  switch (intent) {
    case 'explain':
      return `## ${subject}\n\n**In simple terms:** [One-sentence analogy]\n\n**How it works:**\n[Clear explanation building from basics to details]\n\n**Real-world example:**\n[Practical application that makes the concept tangible]\n\n**Key takeaway:** [The one thing to remember]`;

    case 'compare':
      return `## Comparison: ${topic}\n\n| Criteria | Option A | Option B |\n|----------|----------|----------|\n| Performance | ... | ... |\n| Cost | ... | ... |\n| Ease of use | ... | ... |\n| Community | ... | ... |\n\n**Best for speed:** Option A\n**Best for beginners:** Option B\n**Overall recommendation:** [Based on your use case]`;

    case 'list':
      return `## ${topic}\n\n1. **[Item]** — [Why it's included, key strength]\n2. **[Item]** — [One-line value proposition]\n3. **[Item]** — [What makes it stand out]\n...\n\n**Top pick:** #1 for [reason]`;

    case 'debug':
      return `## Bug Analysis\n\n**Root Cause:** [Exact issue identified]\n\n**Why it happens:** [Technical explanation]\n\n**Fix:**\n\`\`\`\n// Before (broken)\n...\n// After (fixed)\n...\n\`\`\`\n\n**Prevention:** [How to avoid this in the future]`;

    case 'plan':
      return `## Plan: ${topic}\n\n### Phase 1: Foundation (Week 1-2)\n- [ ] Step 1...\n- [ ] Step 2...\n\n### Phase 2: Build (Week 3-4)\n- [ ] Step 3...\n\n### Phase 3: Launch\n- [ ] Final steps...\n\n**Key milestones:** [3 measurable checkpoints]`;

    case 'brainstorm':
      return `## Ideas for: ${topic}\n\n🟢 **Safe bets:**\n1. [Proven approach]\n2. [Industry standard]\n\n🟡 **Interesting angles:**\n3. [Creative twist]\n4. [Unexpected combination]\n\n🔴 **Bold moves:**\n5. [Disruptive idea]\n\n**Top recommendation:** Idea #3 — [rationale]`;

    case 'create':
      if (category === 'developer') {
        return `\`\`\`typescript\n// ${topic}\n\nexport function solution() {\n  // Clean implementation\n  // with error handling\n  // and type safety\n}\n\n// Usage:\nsolution();\n\`\`\``;
      }
      return `## ${topic}\n\n[Complete, polished output that's ready to use — not a template or placeholder but actual content addressing the specific request]`;

    case 'analyze':
      return `## Analysis: ${topic}\n\n**Summary:** [Key finding in 1-2 sentences]\n\n**Key Data Points:**\n- [Metric 1]: [Value + context]\n- [Metric 2]: [Value + trend]\n\n**Insights:**\n1. [Evidence-based finding]\n2. [Pattern or trend identified]\n\n**Recommendation:** [What to do based on the analysis]`;

    default:
      return `## Response to: ${topic}\n\n[Detailed, structured response that directly addresses the specific request with practical value and clear formatting]`;
  }
}

// ─── Main export ───

export function generateOptimizedPrompt(
  userInput: string,
  platform: AIPlatform,
  category: PromptCategory
): GeneratedPrompt {
  const trimmedInput = userInput.trim();

  // Handle image-based request in local engine fallback
  const isImageRequest = /\b(image|photo|picture|make my|look like|style|visual|recreate)\b/i.test(trimmedInput) || trimmedInput.includes('[Attached image:');

  if (isImageRequest) {
    const prompt = `[PROMPT FOR ${platform.toUpperCase()}]
Transform the reference image I attached into the following style:

## Visual Style & Aesthetics
- Subject & Pose: Preserve the subject's key facial features, posture, and expression while matching the streetwear aesthetic.
- Typography & Overlay: Transcribe and overlay text in a bold, 3D condensed sans-serif font layered behind/around the subject.
- Lighting & Atmosphere: Dramatic street lighting with volumetric highlights, neon purple/blue edge glows, and subtle lens flare.
- Outfit & Details: Oversized grey hoodie, wide-leg tactical cargo trousers, clean white sneakers, and dark sunglasses.
- Camera & Framing: Full-body vertical portrait shot, 35mm lens perspective, soft background bokeh depth of field.

## Instructions for AI:
Apply these visual style elements to my uploaded photo while keeping my facial identity intact.`;

    return {
      optimizedPrompt: prompt,
      platform,
      category,
      tips: [
        'Upload your reference photo alongside this prompt on the target platform.',
        'Adjust the typography text in quotes to your preferred caption or slogan.',
        'Use weight parameters (e.g., --iw 2.0 in Midjourney) for stronger image fidelity.',
      ],
      qualityScore: 96,
      exampleOutput: 'AI will generate a stylized vertical portrait matching your uploaded photo with neon glow and 3D text overlays.',
    };
  }

  if (!trimmedInput) {
    return {
      optimizedPrompt: '',
      platform,
      category,
      tips: ['Start by describing what you want — even a rough idea works!'],
      qualityScore: 0,
      exampleOutput: '',
    };
  }

  const analysis = analyzeInput(trimmedInput);

  const builders: Record<AIPlatform, (input: string, a: InputAnalysis, cat: PromptCategory) => string> = {
    chatgpt: buildChatGPTPrompt,
    claude: buildClaudePrompt,
    gemini: buildGeminiPrompt,
    perplexity: buildPerplexityPrompt,
    sora: (input, a) => buildSoraPrompt(input, a),
    copilot: (input, a) => buildCopilotPrompt(input, a),
    antigravity: buildAntigravityPrompt,
  };

  const optimizedPrompt = builders[platform](trimmedInput, analysis, category);
  const tips = generateTips(platform, analysis);
  const qualityScore = calculateQualityScore(trimmedInput, analysis);
  const exampleOutput = generateExampleOutput(trimmedInput, analysis, category);

  return {
    optimizedPrompt,
    platform,
    category,
    tips,
    qualityScore,
    exampleOutput,
  };
}
