'use client';

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { renderMarkdown } from '@/lib/markdown';
import { useToast } from './Toast';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const html = useMemo(() => {
    if (!content.trim()) {
      return '<p class="text-muted">Preview will appear here...</p>';
    }
    return renderMarkdown(content);
  }, [content]);

  const handleCopy = useCallback(async (codeBlock: HTMLElement) => {
    const rawCode = codeBlock.getAttribute('data-code');
    if (!rawCode) return;

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = rawCode;
    const decodedCode = textarea.value;

    try {
      await navigator.clipboard.writeText(decodedCode);
      
      // Show visual feedback
      const btn = codeBlock.querySelector('.copy-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }
      
      addToast('Code copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      addToast('Failed to copy code', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click was on a copy button
      if (target.classList.contains('copy-btn') || target.closest('.copy-btn')) {
        const btn = target.classList.contains('copy-btn') ? target : target.closest('.copy-btn');
        const codeBlock = btn?.closest('.code-block') as HTMLElement;
        if (codeBlock) {
          handleCopy(codeBlock);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [handleCopy]);

  return (
    <div className="flex-1 h-full overflow-auto bg-[#0F0F14] p-6">
      <div
        ref={containerRef}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
