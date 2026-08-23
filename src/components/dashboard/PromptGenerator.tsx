'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Paperclip, X, FileText, Image } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useApp } from '@/context/AppContext';
import {
  generateOptimizedPrompt,
  type GeneratedPrompt,
} from '@/lib/ai-engine';

const platformNames: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
  sora: 'Sora',
  copilot: 'Copilot',
  antigravity: 'Antigravity',
};

const platformColors: Record<string, string> = {
  chatgpt: '#10a37f',
  claude: '#d97706',
  gemini: '#4285f4',
  perplexity: '#20b2aa',
  sora: '#ec4899',
  copilot: '#0078d4',
  antigravity: '#8b5cf6',
};

type AttachedFile = {
  name: string;
  size: number;
  type: string;
  content: string;
  base64?: string;
};

type PromptGeneratorProps = {
  onGenerated: (prompt: GeneratedPrompt) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
};

export default function PromptGenerator({
  onGenerated,
  inputValue,
  onInputChange,
}: PromptGeneratorProps) {
  const { selectedPlatform, selectedCategory, addToHistory } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxChars = 2000;

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB');
      return;
    }

    const allowedTypes = [
      'text/plain', 'text/markdown', 'text/csv', 'text/html',
      'application/json', 'application/pdf',
      'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    ];

    const isAllowed = allowedTypes.some(t => file.type.startsWith(t.split('/')[0]) || file.type === t);
    if (!isAllowed && !file.name.match(/\.(txt|md|csv|json|ts|tsx|js|jsx|py|java|cpp|c|html|css)$/i)) {
      alert('Unsupported file type. Please use text, code, CSV, JSON, or image files.');
      return;
    }

    try {
      let content = '';
      let base64 = '';

      if (file.type.startsWith('image/')) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        base64 = dataUrl.split(',')[1] || '';
        content = `[Attached image: ${file.name}]`;
      } else {
        content = await file.text();
        if (content.length > 10000) {
          content = content.substring(0, 10000) + '\n\n[...content truncated at 10,000 characters]';
        }
      }

      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'image/png',
        content,
        base64,
      });
    } catch {
      alert('Failed to read file');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const removeFile = useCallback(() => {
    setAttachedFile(null);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim() && !attachedFile || isGenerating) return;

    setIsGenerating(true);

    let fullInput = inputValue;
    if (attachedFile && !attachedFile.base64) {
      fullInput += `\n\n--- Attached File (${attachedFile.name}) ---\n${attachedFile.content}`;
    }

    const userApiKey = typeof window !== 'undefined' ? localStorage.getItem('promptit_user_api_key') || '' : '';
    const userAiProvider = typeof window !== 'undefined' ? localStorage.getItem('promptit_user_ai_provider') || 'gemini' : 'gemini';

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-api-key': userApiKey,
          'x-user-ai-provider': userAiProvider,
        },
        body: JSON.stringify({
          userInput: fullInput,
          platform: selectedPlatform,
          category: selectedCategory,
          attachedFile: attachedFile ? {
            name: attachedFile.name,
            type: attachedFile.type,
            content: attachedFile.content,
            base64: attachedFile.base64,
          } : null,
        }),
      });

      let result: GeneratedPrompt;

      if (res.ok) {
        result = await res.json();
      } else {
        result = generateOptimizedPrompt(
          fullInput,
          selectedPlatform,
          selectedCategory
        );
      }

      addToHistory({
        userInput: inputValue,
        optimizedPrompt: result.optimizedPrompt,
        platform: selectedPlatform,
        category: selectedCategory,
        qualityScore: result.qualityScore ?? 0,
      });

      onGenerated(result);
    } catch (err) {
      console.warn('Network error, using fallback local generator:', err);
      const fallbackResult = generateOptimizedPrompt(
        fullInput,
        selectedPlatform,
        selectedCategory
      );
      onGenerated(fallbackResult);
    } finally {
      setIsGenerating(false);
    }
  }, [inputValue, attachedFile, selectedPlatform, selectedCategory, isGenerating, addToHistory, onGenerated]);

  const platformColor = platformColors[selectedPlatform] || '#3b82f6';

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={20} style={{ color: platformColor }} />
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Generate Prompt for{' '}
          <span style={{ color: platformColor }}>
            {platformNames[selectedPlatform] || 'AI'}
          </span>
        </h3>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value.slice(0, maxChars))}
          placeholder="Describe what you need... e.g., 'Write a blog post about quantum computing for beginners'"
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-blue/50 transition-all duration-200 text-sm leading-relaxed"
        />

        {/* Bottom row: file attach + char count */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-all cursor-pointer text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title="Attach a file"
            >
              <Paperclip size={14} />
              <span>Attach File</span>
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md,.csv,.json,.ts,.tsx,.js,.jsx,.py,.java,.cpp,.c,.html,.css,.pdf,.png,.jpg,.jpeg,.gif,.webp"
              onChange={handleFileSelect}
            />
          </div>

          <span
            className={`text-xs ${
              inputValue.length > maxChars * 0.9
                ? 'text-accent-pink'
                : 'text-text-muted'
            }`}
          >
            {inputValue.length}/{maxChars}
          </span>
        </div>
      </div>

      {/* Attached File Display */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary border border-glass-border">
              {attachedFile.type.startsWith('image/') ? (
                <Image size={16} className="text-accent-purple flex-shrink-0" />
              ) : (
                <FileText size={16} className="text-accent-blue flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{attachedFile.name}</p>
                <p className="text-[10px] text-text-muted">{formatFileSize(attachedFile.size)}</p>
              </div>
              <motion.button
                onClick={removeFile}
                className="p-1 rounded-md hover:bg-glass-bg-hover text-text-muted hover:text-accent-pink transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <div className="mt-4">
        <motion.div whileTap={{ scale: 0.97 }}>
          <NeonButton
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Optimizing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wand2 size={18} />
                Generate Optimized Prompt
              </span>
            )}
          </NeonButton>
        </motion.div>
      </div>
    </GlassCard>
  );
}
