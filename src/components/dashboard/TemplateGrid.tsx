'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useApp } from '@/context/AppContext';
import { promptTemplates } from '@/lib/templates';

const platformNames: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
  sora: 'Sora',
  copilot: 'Copilot',
};

const platformColors: Record<string, string> = {
  chatgpt: '#10a37f',
  claude: '#d97706',
  gemini: '#4285f4',
  perplexity: '#20b2aa',
  sora: '#ec4899',
  copilot: '#0078d4',
};

const categoryColors: Record<string, string> = {
  writing: '#8b5cf6',
  coding: '#00d4ff',
  business: '#f59e0b',
  creative: '#ec4899',
  research: '#10b981',
};

type TemplateGridProps = {
  onUseTemplate: (template: string) => void;
};

export default function TemplateGrid({ onUseTemplate }: TemplateGridProps) {
  const { selectedPlatform, selectedCategory, setCurrentView } = useApp();
  const [showAll, setShowAll] = useState(false);

  // Filter templates
  let filtered = promptTemplates;

  if (selectedPlatform) {
    filtered = filtered.filter(
      (t) => t.platform === selectedPlatform
    );
  }

  if (selectedCategory) {
    filtered = filtered.filter((t) => t.category === selectedCategory);
  }

  const displayed = showAll ? filtered : filtered.slice(0, 6);

  const heading = selectedPlatform && selectedCategory
    ? `Templates for ${platformNames[selectedPlatform]} — ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
    : selectedPlatform
      ? `Templates for ${platformNames[selectedPlatform]}`
      : selectedCategory
        ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates`
        : 'All Templates';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
          <FileText size={20} className="text-accent-purple" />
          {heading}
        </h3>
        {filtered.length > 6 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors cursor-pointer"
            whileHover={{ x: 3 }}
          >
            {showAll ? 'Show Less' : 'View All'}
            <ArrowRight size={14} />
          </motion.button>
        )}
      </div>

      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map((template, index) => {
            const pColor = platformColors[template.platform] || '#00d4ff';
            const cColor = categoryColors[template.category] || '#8b5cf6';

            return (
              <motion.div
                key={template.id || `${template.platform}-${template.category}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <GlassCard className="h-full flex flex-col hover:border-glass-border-hover transition-all duration-300 group">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${pColor}15`,
                        borderColor: `${pColor}30`,
                        color: pColor,
                      }}
                    >
                      {platformNames[template.platform] || template.platform}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${cColor}15`,
                        borderColor: `${cColor}30`,
                        color: cColor,
                      }}
                    >
                      {template.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-semibold text-text-primary mb-1.5 font-heading">
                    {template.title}
                  </h4>
                  <p className="text-xs text-text-muted mb-4 line-clamp-2 flex-1">
                    {template.description}
                  </p>

                  {/* Use Template Button */}
                  <motion.button
                    onClick={() => { onUseTemplate(template.templateText); setCurrentView('dashboard'); }}
                    className="w-full py-2 rounded-lg bg-[rgba(255,255,255,0.04)] border border-glass-border text-xs font-medium text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 hover:bg-[rgba(0,212,255,0.05)] transition-all duration-200 cursor-pointer group-hover:border-glass-border-hover"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use Template
                  </motion.button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <FileText size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
          <h4 className="text-sm font-heading font-medium text-text-secondary mb-1">
            No templates found
          </h4>
          <p className="text-xs text-text-muted">
            Try selecting a different platform or category combination.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
