// ═══════════════════════════════════════════════
//  PROMPT IT — AI Engine
//  Core prompt optimization & platform routing
// ═══════════════════════════════════════════════

export type AIPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'sora' | 'copilot';

export type PromptCategory = 'study' | 'content' | 'developer' | 'business' | 'creative';

export interface GeneratedPrompt {
  optimizedPrompt: string;
  platform: AIPlatform;
  category: PromptCategory;
  tips: string[];
  qualityScore: number;
  exampleOutput: string;
}

// ─── Category-specific role/context mapping ───

const CATEGORY_ROLES: Record<PromptCategory, { role: string; context: string; tone: string }> = {
  study: {
    role: 'an expert educator and learning coach with deep expertise in pedagogy and curriculum design',
    context: 'The user is studying and needs clear, structured educational support.',
    tone: 'Clear, encouraging, and pedagogically sound',
  },
  content: {
    role: 'a seasoned content strategist and professional writer with expertise in digital marketing and audience engagement',
    context: 'The user needs high-quality content that engages, informs, and converts.',
    tone: 'Engaging, polished, and audience-aware',
  },
  developer: {
    role: 'a senior software engineer and technical architect with 15+ years of experience across modern tech stacks',
    context: 'The user needs production-quality code, architecture guidance, or debugging help.',
    tone: 'Technical, precise, and best-practice oriented',
  },
  business: {
    role: 'a strategic business consultant and analyst with expertise in market analysis, operations, and growth strategy',
    context: 'The user needs actionable business insights, analysis, or strategic recommendations.',
    tone: 'Professional, data-driven, and actionable',
  },
  creative: {
    role: 'a visionary creative director and artist with mastery across visual, narrative, and experiential design',
    context: 'The user needs creative output — ideas, designs, stories, or artistic direction.',
    tone: 'Imaginative, vivid, and boundary-pushing',
  },
};

// ─── Keyword extraction ───

function extractKeywords(input: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'like',
    'through', 'after', 'over', 'between', 'out', 'against', 'during',
    'without', 'before', 'under', 'around', 'among', 'and', 'but', 'or',
    'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each',
    'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very',
    'just', 'because', 'if', 'when', 'while', 'how', 'what', 'which',
    'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'me', 'my',
    'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
    'it', 'its', 'they', 'them', 'their', 'make', 'want', 'need',
    'help', 'please', 'create', 'write', 'generate',
  ]);

  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

function inferSubject(input: string): string {
  const lowerInput = input.toLowerCase();

  const subjects: { pattern: RegExp; subject: string }[] = [
    { pattern: /\b(python|javascript|typescript|react|node|java|c\+\+|rust|go|swift)\b/i, subject: 'software development' },
    { pattern: /\b(math|calculus|algebra|geometry|statistics)\b/i, subject: 'mathematics' },
    { pattern: /\b(physics|chemistry|biology|science)\b/i, subject: 'science' },
    { pattern: /\b(history|geography|politics|economics)\b/i, subject: 'social studies' },
    { pattern: /\b(essay|writing|literature|poetry|novel)\b/i, subject: 'language arts' },
    { pattern: /\b(marketing|sales|revenue|profit|startup|growth)\b/i, subject: 'business strategy' },
    { pattern: /\b(design|art|illustration|animation|3d|visual)\b/i, subject: 'creative design' },
    { pattern: /\b(video|film|cinema|scene|camera|shot)\b/i, subject: 'video production' },
    { pattern: /\b(api|database|backend|frontend|fullstack|deploy)\b/i, subject: 'software engineering' },
    { pattern: /\b(blog|article|post|newsletter|social media|content)\b/i, subject: 'content creation' },
  ];

  for (const { pattern, subject } of subjects) {
    if (pattern.test(lowerInput)) return subject;
  }

  return 'the requested topic';
}

function estimateComplexity(input: string): 'simple' | 'moderate' | 'complex' {
  const wordCount = input.split(/\s+/).length;
  const keywords = extractKeywords(input);

  if (wordCount > 30 || keywords.length > 10) return 'complex';
  if (wordCount > 12 || keywords.length > 5) return 'moderate';
  return 'simple';
}

// ─── Platform-specific prompt builders ───

function buildChatGPTPrompt(input: string, category: PromptCategory): string {
  const { role, tone } = CATEGORY_ROLES[category];
  const subject = inferSubject(input);
  const complexity = estimateComplexity(input);

  const depthInstruction = complexity === 'complex'
    ? 'Provide an in-depth, comprehensive response with detailed explanations, examples, and edge cases.'
    : complexity === 'moderate'
      ? 'Provide a thorough response with clear explanations and relevant examples.'
      : 'Provide a clear, concise response that directly addresses the request.';

  const categorySpecifics: Record<PromptCategory, string> = {
    study: `
## Output Requirements
- Begin with a brief overview/summary
- Break concepts into digestible sections with clear headings
- Include practical examples or analogies for complex ideas
- End with 3-5 review questions to test understanding
- If applicable, suggest additional resources or next steps`,
    content: `
## Output Requirements
- Open with a compelling hook that captures attention
- Structure content with clear headings and logical flow
- Use engaging language appropriate for the target audience
- Include actionable takeaways or calls-to-action
- Optimize for readability with short paragraphs and bullet points where appropriate`,
    developer: `
## Output Requirements
- Provide clean, well-documented code with inline comments
- Follow industry best practices and design patterns
- Include error handling and edge case considerations
- Add usage examples showing how to implement the solution
- Note any dependencies, performance considerations, or security implications`,
    business: `
## Output Requirements
- Lead with an executive summary of key findings/recommendations
- Support all claims with data, metrics, or logical reasoning
- Provide actionable next steps with clear priorities
- Include risk assessment and mitigation strategies where relevant
- Use professional formatting with tables or bullet points for clarity`,
    creative: `
## Output Requirements
- Push creative boundaries while maintaining coherence
- Use vivid, sensory-rich language and imagery
- Develop a unique voice and perspective
- Include unexpected elements that surprise and engage
- Ensure the creative output serves the stated purpose`,
  };

  return `# Role
Act as ${role}.

# Context
${CATEGORY_ROLES[category].context} The topic relates to ${subject}.

# Task
${input}

# Tone & Style
${tone}. ${depthInstruction}
${categorySpecifics[category]}

# Constraints
- Stay focused on the specific request — avoid unnecessary tangents
- If assumptions are needed, state them explicitly
- If the request is ambiguous, address the most likely interpretation first, then briefly note alternatives
- Format the response for maximum readability and practical utility`;
}

function buildClaudePrompt(input: string, category: PromptCategory): string {
  const { role, context, tone } = CATEGORY_ROLES[category];
  const subject = inferSubject(input);
  const complexity = estimateComplexity(input);
  const keywords = extractKeywords(input);

  const detailLevel = complexity === 'complex' ? 'comprehensive and thorough'
    : complexity === 'moderate' ? 'detailed yet focused'
      : 'concise and direct';

  const categoryConstraints: Record<PromptCategory, string> = {
    study: `- Use the Feynman technique: explain as if teaching someone new to the subject
- Include mnemonics, analogies, or memory aids where helpful
- Provide practice problems or self-assessment questions
- Flag common misconceptions and how to avoid them`,
    content: `- Match tone and style to the intended audience and platform
- Ensure all content is original and provides genuine value
- Include SEO-relevant structure if applicable (headings, meta considerations)
- Balance creativity with clarity — every sentence should earn its place`,
    developer: `- Write production-ready code following SOLID principles
- Include TypeScript types/interfaces where applicable
- Consider scalability, maintainability, and testability
- Provide unit test examples or testing strategies
- Document any architectural decisions or trade-offs`,
    business: `- Ground all recommendations in real-world feasibility
- Quantify impact where possible (ROI, timelines, metrics)
- Consider competitive landscape and market dynamics
- Address stakeholder concerns and change management
- Provide both short-term quick wins and long-term strategic plays`,
    creative: `- Embrace originality — avoid clichés and predictable patterns
- Layer meaning and subtext beneath the surface content
- Consider the emotional journey of the audience
- Balance artistic vision with practical constraints
- Include variations or alternative directions when appropriate`,
  };

  return `You are ${role}.

<context>
${context}
Subject area: ${subject}
Key topics: ${keywords.slice(0, 8).join(', ') || 'general'}
Desired detail level: ${detailLevel}
</context>

<task>
${input}
</task>

<requirements>
Tone: ${tone}
${categoryConstraints[category]}
</requirements>

<output_format>
- Use clear markdown formatting with headers, lists, and code blocks as appropriate
- Structure your response logically with a clear beginning, middle, and end
- If the response is lengthy, include a brief table of contents or summary at the top
- Ensure every section directly contributes to addressing the user's request
</output_format>

<thinking_process>
Before responding, consider:
1. What is the user really trying to achieve?
2. What context might they be missing?
3. What would make this response maximally useful?
</thinking_process>`;
}

function buildGeminiPrompt(input: string, category: PromptCategory): string {
  const { role, tone } = CATEGORY_ROLES[category];
  const subject = inferSubject(input);
  const complexity = estimateComplexity(input);

  const exampleFormat: Record<PromptCategory, string> = {
    study: `Example of desired output style:
Input: "Explain photosynthesis"
Output: "## Photosynthesis: Converting Light to Life
**Core Concept:** Plants convert CO₂ + H₂O + light energy → glucose + O₂
**Key Stages:** 1) Light-dependent reactions (thylakoid) 2) Calvin Cycle (stroma)
**Memory Aid:** 'Light makes ATP, Calvin makes sugar'
**Quick Quiz:** What molecule carries energy from light reactions to the Calvin Cycle?"`,
    content: `Example of desired output style:
Input: "Write a product launch email"
Output: "**Subject:** You asked, we built it — [Product] is here 🚀
**Preview text:** The feature you've been requesting is finally live
**Body:** Opens with customer pain point → introduces solution → 3 key benefits with proof points → clear CTA
**Tone:** Excited but professional, customer-centric"`,
    developer: `Example of desired output style:
Input: "Create a rate limiter"
Output: "## Token Bucket Rate Limiter
**Algorithm:** Token bucket with configurable refill rate
**Implementation:** TypeScript class with async/await support
**Features:** Per-key limiting, sliding window, Redis-compatible
**Code:** [Clean, typed implementation with JSDoc comments]
**Tests:** [Jest test suite covering edge cases]"`,
    business: `Example of desired output style:
Input: "Analyze market entry strategy"
Output: "## Market Entry Analysis
**Executive Summary:** [2-3 sentence overview with recommendation]
**Market Size:** TAM/SAM/SOM breakdown with sources
**Competitive Landscape:** Matrix comparing 3-5 key players
**Recommended Strategy:** [Specific approach with timeline]
**Risk Matrix:** [Probability × Impact for top 5 risks]"`,
    creative: `Example of desired output style:
Input: "Design a fantasy world"
Output: "## The Shattered Realms
**Premise:** A world where reality fractured into floating archipelagos
**Visual Identity:** Bioluminescent flora, crystal architecture, aurora-lit skies
**Cultures:** 3 distinct civilizations shaped by their island environments
**Conflict Engine:** Resources flow between islands unpredictably
**Unique Mechanic:** Gravity works differently on each fragment"`,
  };

  const depthNote = complexity === 'complex'
    ? 'This is a complex request — provide comprehensive coverage with detailed analysis.'
    : complexity === 'moderate'
      ? 'Provide a balanced response with sufficient detail and practical focus.'
      : 'Keep the response focused and actionable — prioritize clarity over exhaustiveness.';

  return `**Instruction:** As ${role}, respond to the following request about ${subject}. ${depthNote}

**Request:** ${input}

**Tone:** ${tone}

${exampleFormat[category]}

**Response Guidelines:**
• Structure your response with clear sections and hierarchy
• Lead with the most important information
• Be specific and concrete — avoid vague generalities
• Include practical, immediately actionable elements
• If relevant, provide alternatives or variations
• Use markdown formatting for readability`;
}

function buildPerplexityPrompt(input: string, category: PromptCategory): string {
  const subject = inferSubject(input);
  const keywords = extractKeywords(input);
  const complexity = estimateComplexity(input);

  const researchDepth = complexity === 'complex' ? 'exhaustive' : complexity === 'moderate' ? 'thorough' : 'focused';

  const categoryResearchFocus: Record<PromptCategory, string> = {
    study: `Focus your research on:
- Peer-reviewed academic sources and established textbooks
- Recent developments or paradigm shifts in the field
- Multiple pedagogical perspectives and learning approaches
- Verified facts and commonly accepted frameworks
- Practical applications and real-world connections`,
    content: `Focus your research on:
- Current trends and audience preferences in the content space
- Successful examples and case studies from leading publications
- Data-backed content strategies and engagement metrics
- Platform-specific best practices (SEO, social, email, etc.)
- Competitor content analysis and gap identification`,
    developer: `Focus your research on:
- Official documentation and specification references
- GitHub repositories, pull requests, and technical RFCs
- Performance benchmarks and comparison studies
- Security advisories and best practice guidelines
- Stack Overflow discussions and developer community consensus`,
    business: `Focus your research on:
- Industry reports from credible firms (McKinsey, Gartner, CB Insights, etc.)
- Financial data, market metrics, and economic indicators
- Case studies from comparable companies or markets
- Regulatory environment and compliance requirements
- Expert commentary and analyst perspectives`,
    creative: `Focus your research on:
- Cutting-edge creative trends and emerging artistic movements
- Award-winning work and portfolio case studies
- Technical capabilities and tool comparisons
- Audience reception data and cultural relevance
- Cross-disciplinary inspiration and innovative approaches`,
  };

  return `**Research Question:** ${input}

**Subject Domain:** ${subject}
**Key Research Topics:** ${keywords.slice(0, 10).join(', ') || 'general inquiry'}
**Research Depth:** ${researchDepth}

${categoryResearchFocus[category]}

**Analysis Requirements:**
1. Synthesize information from multiple authoritative sources
2. Clearly distinguish between established facts, expert opinions, and emerging theories
3. Present conflicting viewpoints where they exist, with assessment of relative merit
4. Provide specific data points, statistics, and citations where available
5. Identify knowledge gaps or areas of ongoing debate

**Output Structure:**
- **Key Findings:** Top 3-5 most important discoveries
- **Detailed Analysis:** Organized by theme or sub-topic
- **Sources & Confidence:** Rate the confidence level of each major claim
- **Further Investigation:** Suggest follow-up research directions

**Citation Requirements:** Include inline citations with source names and dates. Prioritize recency — prefer sources from the last 2 years unless historical context is needed.`;
}

function buildSoraPrompt(input: string, category: PromptCategory): string {
  const keywords = extractKeywords(input);

  const moodMap: Record<PromptCategory, { mood: string; style: string; palette: string }> = {
    study: {
      mood: 'Clean, professional, and intellectually engaging',
      style: 'Modern documentary or educational broadcast aesthetic with motion graphics',
      palette: 'Cool blues, warm whites, subtle accents of gold — think premium educational content',
    },
    content: {
      mood: 'Dynamic, eye-catching, and brand-forward',
      style: 'Contemporary social media / commercial aesthetic with trending visual language',
      palette: 'Vibrant and on-brand — consider current visual trends and platform-native aesthetics',
    },
    developer: {
      mood: 'Sleek, futuristic, and technically precise',
      style: 'Tech product showcase / developer conference visual style with code aesthetics',
      palette: 'Dark mode inspired — deep navy/charcoal backgrounds with neon accent highlights',
    },
    business: {
      mood: 'Polished, authoritative, and aspirational',
      style: 'Corporate cinematic or premium brand film aesthetic',
      palette: 'Sophisticated neutrals with strategic color accents — conveys trust and premium quality',
    },
    creative: {
      mood: 'Evocative, dreamlike, and emotionally resonant',
      style: 'Artistic / auteur cinema aesthetic — prioritize visual storytelling and emotional impact',
      palette: 'Expressive and mood-driven — let the emotional tone dictate the color story',
    },
  };

  const { mood, style, palette } = moodMap[category];

  return `**Scene Description:**
${input}

**Visual Keywords:** ${keywords.join(', ')}

**Cinematic Direction:**

*Camera:*
- Opening: Establish the scene with a wide/aerial shot, then transition to the subject
- Movement: Smooth, intentional camera motion — dolly, crane, or steady gimbal tracking
- Key moments: Use rack focus or slow push-in to emphasize important elements
- Composition: Follow rule of thirds, lead with negative space for visual breathing room

*Lighting:*
- Primary: Motivated lighting that feels natural to the scene environment
- Atmosphere: Volumetric light (god rays, haze, dust particles) for depth and cinematic quality
- Contrast: Balance highlights and shadows for dramatic dimension — avoid flat lighting
- Time of day: Golden hour warmth or blue hour mystery, depending on emotional tone

*Motion & Pacing:*
- Subject motion: Fluid, purposeful movement that guides the viewer's eye
- Speed: Mix of real-time and subtle slow-motion (60-120fps) for emphasis
- Transitions: Seamless cuts or elegant transitions between scenes
- Duration: 10-15 seconds per shot, total sequence 30-60 seconds

*Visual Style:*
- Mood: ${mood}
- Aesthetic: ${style}
- Color palette: ${palette}

*Technical Specifications:*
- Resolution: 4K cinematic (16:9 or 2.39:1 anamorphic widescreen)
- Frame rate: 24fps for cinematic feel, with selective slow-motion segments
- Depth of field: Shallow DoF for intimate moments, deep for establishing shots
- Post-processing: Subtle film grain, refined color grading, natural lens characteristics

*Audio Direction (for reference):*
- Ambient sound design that enhances immersion
- Musical tone should complement the visual mood
- Consider moments of strategic silence for impact`;
}

function buildCopilotPrompt(input: string, category: PromptCategory): string {
  const subject = inferSubject(input);
  const complexity = estimateComplexity(input);
  const keywords = extractKeywords(input);

  // Detect language/framework from keywords
  const langPatterns: { pattern: RegExp; lang: string; framework?: string }[] = [
    { pattern: /\b(react|next\.?js|nextjs)\b/i, lang: 'TypeScript', framework: 'React/Next.js' },
    { pattern: /\b(vue|nuxt)\b/i, lang: 'TypeScript', framework: 'Vue/Nuxt' },
    { pattern: /\b(angular)\b/i, lang: 'TypeScript', framework: 'Angular' },
    { pattern: /\b(python|django|flask|fastapi)\b/i, lang: 'Python', framework: 'detected from context' },
    { pattern: /\b(java|spring)\b/i, lang: 'Java', framework: 'Spring Boot' },
    { pattern: /\b(rust)\b/i, lang: 'Rust' },
    { pattern: /\b(go|golang)\b/i, lang: 'Go' },
    { pattern: /\b(swift|swiftui|ios)\b/i, lang: 'Swift', framework: 'SwiftUI/UIKit' },
    { pattern: /\b(kotlin|android)\b/i, lang: 'Kotlin', framework: 'Android' },
    { pattern: /\b(c#|csharp|\.net|dotnet)\b/i, lang: 'C#', framework: '.NET' },
    { pattern: /\b(php|laravel)\b/i, lang: 'PHP', framework: 'Laravel' },
    { pattern: /\b(ruby|rails)\b/i, lang: 'Ruby', framework: 'Ruby on Rails' },
    { pattern: /\b(sql|postgres|mysql|database)\b/i, lang: 'SQL' },
  ];

  let detectedLang = 'TypeScript';
  let detectedFramework = '';
  const lowerInput = input.toLowerCase();

  for (const { pattern, lang, framework } of langPatterns) {
    if (pattern.test(lowerInput)) {
      detectedLang = lang;
      if (framework) detectedFramework = framework;
      break;
    }
  }

  const scopeDescription = complexity === 'complex'
    ? 'This is a complex implementation requiring careful architecture and comprehensive coverage.'
    : complexity === 'moderate'
      ? 'This is a moderate-scope task requiring solid implementation with good practices.'
      : 'This is a focused task — provide a clean, minimal implementation.';

  const categoryCodeFocus: Record<PromptCategory, string> = {
    study: `**Purpose:** Educational / learning implementation
- Include extensive inline comments explaining the "why" behind each decision
- Add JSDoc/docstring documentation for all public interfaces
- Provide a simpler alternative implementation for comparison when instructive
- Include console.log examples or a demo usage section`,
    content: `**Purpose:** Content tooling / CMS implementation  
- Focus on content data models and rendering pipelines
- Consider markdown/rich text processing requirements
- Include SEO metadata handling where relevant
- Build with content editor experience in mind`,
    developer: `**Purpose:** Production infrastructure / tooling
- Optimize for performance, reliability, and maintainability
- Include comprehensive error handling with custom error types
- Add logging, monitoring hooks, and observability considerations
- Follow 12-factor app principles where applicable
- Consider CI/CD integration points`,
    business: `**Purpose:** Business logic / analytics implementation
- Ensure data validation and integrity at every boundary
- Include audit logging and compliance considerations
- Build with role-based access control patterns in mind
- Consider reporting and export functionality
- Handle currency, dates, and localization properly`,
    creative: `**Purpose:** Creative tooling / interactive implementation
- Prioritize smooth UX with animations and transitions
- Consider responsive design and cross-device compatibility
- Include accessibility (a11y) from the start
- Optimize for visual performance (GPU acceleration, lazy loading)
- Build with creative workflow patterns in mind`,
  };

  return `**Language:** ${detectedLang}${detectedFramework ? `\n**Framework:** ${detectedFramework}` : ''}
**Domain:** ${subject}
**Complexity:** ${complexity} — ${scopeDescription}
**Relevant concepts:** ${keywords.slice(0, 8).join(', ') || 'general'}

**Task:**
${input}

${categoryCodeFocus[category]}

**Code Requirements:**
1. **Type Safety:** Full type definitions — no \`any\` types, use generics where appropriate
2. **Error Handling:** Graceful degradation with informative error messages
3. **Documentation:** JSDoc comments for all exports, inline comments for complex logic
4. **Structure:** Clean separation of concerns — follow single responsibility principle
5. **Naming:** Descriptive, self-documenting names for variables, functions, and types
6. **Performance:** Note any O(n) considerations, avoid premature optimization but don't be negligent

**Testing Expectations:**
- Provide unit test examples using the appropriate testing framework
- Cover: happy path, edge cases, error conditions
- Include test data setup and teardown patterns
- Aim for testable architecture (dependency injection, pure functions where possible)

**Deliverables:**
- Main implementation file(s)
- Type definitions / interfaces
- Example usage / integration code
- Test file skeleton with key test cases`;
}

// ─── Tip generation ───

function generateTips(platform: AIPlatform, category: PromptCategory, complexity: string): string[] {
  const platformTips: Record<AIPlatform, string[]> = {
    chatgpt: [
      'Use "Act as..." to set a clear role — ChatGPT responds well to persona-based prompting',
      'Specify the exact output format you want (markdown, JSON, table, etc.)',
      'Add "Think step-by-step" for complex reasoning tasks',
      'Use follow-up prompts to refine — ChatGPT excels in conversational iteration',
      'Set constraints to prevent scope creep (word count, number of points, etc.)',
    ],
    claude: [
      'Use XML tags like <context> and <task> — Claude parses structured prompts exceptionally well',
      'Claude handles very long contexts — feel free to include comprehensive background',
      'Ask Claude to "think through this carefully" for nuanced analysis',
      'Claude follows instructions precisely — be explicit about what you want and don\'t want',
      'Use the <thinking> tag to encourage Claude to show its reasoning process',
    ],
    gemini: [
      'Gemini excels with multimodal inputs — reference images, videos, or documents when relevant',
      'Use few-shot examples to demonstrate your desired output format',
      'Gemini is strong at synthesis — ask it to combine insights from multiple angles',
      'Keep instructions concise and direct — Gemini works well with clear, structured prompts',
      'Leverage Gemini\'s real-time knowledge for current events and recent developments',
    ],
    perplexity: [
      'Frame your input as a research question for best results with source citations',
      'Ask Perplexity to compare multiple sources and note disagreements',
      'Request specific date ranges for time-sensitive research',
      'Use follow-up questions to drill deeper — Perplexity maintains research context',
      'Ask for confidence levels on claims to distinguish well-established facts from emerging research',
    ],
    sora: [
      'Describe scenes cinematically — think like a director, not a programmer',
      'Specify camera movement (dolly, pan, zoom) for more controlled output',
      'Include lighting direction — it dramatically affects mood and quality',
      'Reference specific visual styles or films for aesthetic guidance',
      'Keep individual shots to 10-15 seconds for best quality and coherence',
    ],
    copilot: [
      'Always specify the language and framework upfront — it sets the right code context',
      'Include existing code patterns or architecture for consistent style matching',
      'Ask for tests alongside implementation — Copilot generates better code when testing is expected',
      'Specify your dependency preferences (e.g., "use native APIs over lodash")',
      'Break complex implementations into smaller, focused prompts for better results',
    ],
  };

  const tips = platformTips[platform];
  // Return 3 relevant tips, rotating based on category for variety
  const categoryIndex = ['study', 'content', 'developer', 'business', 'creative'].indexOf(category);
  const startIndex = categoryIndex % tips.length;

  const selected: string[] = [];
  for (let i = 0; i < 3; i++) {
    selected.push(tips[(startIndex + i) % tips.length]);
  }

  return selected;
}

// ─── Quality scoring ───

function calculateQualityScore(input: string, platform: AIPlatform): number {
  let score = 50; // Base score

  const wordCount = input.split(/\s+/).length;
  const keywords = extractKeywords(input);

  // Length scoring
  if (wordCount >= 5) score += 5;
  if (wordCount >= 10) score += 5;
  if (wordCount >= 20) score += 5;
  if (wordCount >= 30) score += 5;
  if (wordCount > 100) score -= 5; // Too long can be unfocused

  // Specificity scoring
  if (keywords.length >= 3) score += 5;
  if (keywords.length >= 6) score += 5;
  if (keywords.length >= 10) score += 3;

  // Structural indicators
  if (/\b(example|such as|like|e\.g\.|for instance)\b/i.test(input)) score += 4;
  if (/\b(step|steps|first|then|finally|process)\b/i.test(input)) score += 3;
  if (/\b(format|structure|organize|layout)\b/i.test(input)) score += 4;
  if (/\b(tone|style|voice|audience)\b/i.test(input)) score += 3;
  if (/\b(constraint|limit|avoid|don't|exclude|must not)\b/i.test(input)) score += 4;

  // Platform bonus for platform-relevant terms
  const platformBonusPatterns: Record<AIPlatform, RegExp> = {
    chatgpt: /\b(act as|role|persona|conversation)\b/i,
    claude: /\b(analyze|careful|nuanced|thorough|detailed)\b/i,
    gemini: /\b(compare|synthesize|multi|combine|integrate)\b/i,
    perplexity: /\b(research|source|citation|evidence|data)\b/i,
    sora: /\b(scene|camera|light|visual|cinematic|motion)\b/i,
    copilot: /\b(code|function|class|type|test|implement)\b/i,
  };

  if (platformBonusPatterns[platform].test(input)) score += 5;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

// ─── Main export ───

export function generateOptimizedPrompt(
  userInput: string,
  platform: AIPlatform,
  category: PromptCategory
): GeneratedPrompt {
  const trimmedInput = userInput.trim();

  if (!trimmedInput) {
    return {
      optimizedPrompt: '',
      platform,
      category,
      tips: ['Start by describing what you want to achieve — even a rough idea works!'],
      qualityScore: 0,
      exampleOutput: '',
    };
  }

  const complexity = estimateComplexity(trimmedInput);

  const builders: Record<AIPlatform, (input: string, cat: PromptCategory) => string> = {
    chatgpt: buildChatGPTPrompt,
    claude: buildClaudePrompt,
    gemini: buildGeminiPrompt,
    perplexity: buildPerplexityPrompt,
    sora: buildSoraPrompt,
    copilot: buildCopilotPrompt,
  };

  const optimizedPrompt = builders[platform](trimmedInput, category);
  const tips = generateTips(platform, category, complexity);
  const qualityScore = calculateQualityScore(trimmedInput, platform);

  const exampleOutput = generateExampleOutput(trimmedInput, category);

  return {
    optimizedPrompt,
    platform,
    category,
    tips,
    qualityScore,
    exampleOutput,
  };
}

// ─── Example Output Generator ───

function generateExampleOutput(input: string, category: PromptCategory): string {
  const keywords = extractKeywords(input).slice(0, 3).join(', ');
  const topic = input.length > 50 ? input.substring(0, 50) + '...' : input;

  const examples: Record<PromptCategory, string> = {
    study: `## Key Concepts: ${keywords || 'Topic Overview'}\n\nHere's a structured breakdown of "${topic}":\n\n**1. Core Definition**\nA clear, concise explanation of the fundamental concept...\n\n**2. Key Principles**\n- Principle A: Detailed explanation with examples\n- Principle B: How it connects to real-world applications\n\n**3. Practice Questions**\n- Q1: Test your understanding of the basics\n- Q2: Apply the concept to a scenario\n\n**4. Summary**\nA brief recap tying all concepts together for easy revision.`,

    content: `# ${keywords ? keywords.charAt(0).toUpperCase() + keywords.slice(1) : 'Your Topic'}\n\n*A compelling introduction that hooks the reader and establishes the value of this content...*\n\n## Why This Matters\nContextual background that positions this topic as important and timely for your audience...\n\n## Key Insights\n1. **First major point** — Supporting evidence and practical takeaway\n2. **Second major point** — Data-backed insight with actionable advice\n3. **Third major point** — Expert perspective with real examples\n\n## Takeaway\nA strong closing that summarizes value and includes a clear call-to-action.`,

    developer: `\`\`\`typescript\n// Solution for: ${topic}\n\ninterface Config {\n  // Type-safe configuration\n  option: string;\n  enabled: boolean;\n}\n\nexport function solve(input: Config): Result {\n  // Implementation with error handling\n  try {\n    const processed = processInput(input);\n    return { success: true, data: processed };\n  } catch (error) {\n    return { success: false, error: error.message };\n  }\n}\n\`\`\`\n\n**Explanation:** Clean, production-ready code with proper error handling and TypeScript types.`,

    business: `## Executive Summary\n\n**Opportunity:** ${topic}\n\n### Market Analysis\n- Market size: Estimated growth trajectory\n- Target segment: Key demographics and behaviors\n- Competitive landscape: 3 main competitors and differentiation\n\n### Recommended Strategy\n1. **Short-term (0-3 months):** Quick wins and validation\n2. **Mid-term (3-6 months):** Scale and optimize\n3. **Long-term (6-12 months):** Market leadership\n\n### Projected ROI\n- Conservative estimate: 15-20% improvement\n- Key metrics to track: Conversion, retention, revenue`,

    creative: `## Creative Concept: "${keywords || 'Untitled'}"\n\n**Visual Style:** Modern, minimalist with bold accent colors\n\n**Mood Board:**\n- Clean lines with organic textures\n- Color palette: Deep navy, warm gold, soft cream\n- Typography: Sans-serif headers, serif body text\n\n**Concept Description:**\nImagine a scene where ${topic || 'your idea comes to life'} — the atmosphere is rich with detail, each element carefully composed to evoke emotion and tell a story...\n\n**Execution Notes:**\n- Start with a strong focal point\n- Layer depth through contrast and spacing\n- End with a memorable visual signature`,
  };

  return examples[category] || examples.content;
}
