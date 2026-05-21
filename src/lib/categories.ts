// ═══════════════════════════════════════════════
//  PROMPT IT — Categories Configuration
//  5 main categories with subcategories
// ═══════════════════════════════════════════════

import type { PromptCategory } from './ai-engine';

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: PromptCategory;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // hex accent color
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: 'study',
    name: 'Study Assistant',
    description: 'Master any subject with AI-powered study guides, explanations, and exam prep',
    icon: 'GraduationCap',
    color: '#00d4ff',
    subcategories: [
      { id: 'study-explain', name: 'Concept Explainer' },
      { id: 'study-exam', name: 'Exam Preparation' },
      { id: 'study-notes', name: 'Smart Notes' },
      { id: 'study-research', name: 'Research Assistant' },
      { id: 'study-tutor', name: 'Personal Tutor' },
      { id: 'study-flashcards', name: 'Flashcard Generator' },
    ],
  },
  {
    id: 'content',
    name: 'Content Creation',
    description: 'Create compelling content — blogs, social posts, emails, and marketing copy',
    icon: 'PenTool',
    color: '#8b5cf6',
    subcategories: [
      { id: 'content-blog', name: 'Blog & Articles' },
      { id: 'content-social', name: 'Social Media' },
      { id: 'content-email', name: 'Email Campaigns' },
      { id: 'content-copy', name: 'Ad Copywriting' },
      { id: 'content-seo', name: 'SEO Content' },
      { id: 'content-script', name: 'Video Scripts' },
    ],
  },
  {
    id: 'developer',
    name: 'Developer Mode',
    description: 'Generate production code, debug issues, design architectures, and write tests',
    icon: 'Code2',
    color: '#10b981',
    subcategories: [
      { id: 'dev-code', name: 'Code Generation' },
      { id: 'dev-debug', name: 'Debugging & Fixes' },
      { id: 'dev-architecture', name: 'System Architecture' },
      { id: 'dev-api', name: 'API Design' },
      { id: 'dev-testing', name: 'Testing & QA' },
      { id: 'dev-devops', name: 'DevOps & CI/CD' },
    ],
  },
  {
    id: 'business',
    name: 'Business Mode',
    description: 'Strategic analysis, market research, financial planning, and business intelligence',
    icon: 'Briefcase',
    color: '#f59e0b',
    subcategories: [
      { id: 'biz-strategy', name: 'Strategy & Planning' },
      { id: 'biz-market', name: 'Market Research' },
      { id: 'biz-finance', name: 'Financial Analysis' },
      { id: 'biz-pitch', name: 'Pitch Decks & Proposals' },
      { id: 'biz-ops', name: 'Operations & Process' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative Mode',
    description: 'Unleash creativity — stories, art direction, world-building, and visual concepts',
    icon: 'Sparkles',
    color: '#ec4899',
    subcategories: [
      { id: 'creative-story', name: 'Storytelling' },
      { id: 'creative-art', name: 'Art Direction' },
      { id: 'creative-world', name: 'World Building' },
      { id: 'creative-music', name: 'Music & Audio' },
      { id: 'creative-game', name: 'Game Design' },
      { id: 'creative-brand', name: 'Brand Identity' },
    ],
  },
];

export function getCategoryById(id: PromptCategory): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryColor(id: PromptCategory): string {
  return getCategoryById(id)?.color ?? '#00d4ff';
}
