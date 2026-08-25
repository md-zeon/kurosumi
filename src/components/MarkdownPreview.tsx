'use client';

import { useMemo } from 'react';
import { renderMarkdown } from '@/lib/markdown';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content.trim()) {
      return '<p class="text-muted">Preview will appear here...</p>';
    }
    return renderMarkdown(content);
  }, [content]);

  return (
    <div className="flex-1 h-full overflow-auto bg-[#0F0F14] p-6">
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
