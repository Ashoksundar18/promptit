'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  PenTool,
  Code2,
  Briefcase,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/lib/categories';
import type { PromptCategory } from '@/lib/ai-engine';

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  PenTool,
  Code2,
  Briefcase,
  Sparkles,
};

export default function CategorySelector() {
  const { selectedCategory, setSelectedCategory } = useApp();

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-text-secondary mb-3 font-heading uppercase tracking-wider">
        Prompt Category
      </h3>

      {/* Main category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Sparkles;
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  isSelected ? ('' as PromptCategory) : (category.id as PromptCategory)
                )
              }
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                border text-sm font-medium transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'text-white border-transparent'
                  : 'glass text-text-secondary hover:bg-glass-bg-hover hover:text-text-primary'
                }
              `}
              style={
                isSelected
                  ? {
                      backgroundColor: `${category.color}cc`,
                      boxShadow: `0 0 16px ${category.color}40, 0 0 4px ${category.color}60`,
                    }
                  : {}
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Icon size={16} />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Subcategories */}
      <AnimatePresence mode="wait">
        {selectedCategoryData && selectedCategoryData.subcategories && (
          <motion.div
            key={selectedCategoryData.id}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5">
              {selectedCategoryData.subcategories.map((sub, index) => (
                <motion.span
                  key={sub.id}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                  className="px-3 py-1 rounded-full text-xs font-medium border cursor-default"
                  style={{
                    backgroundColor: `${selectedCategoryData.color}15`,
                    borderColor: `${selectedCategoryData.color}30`,
                    color: selectedCategoryData.color,
                  }}
                >
                  {sub.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
