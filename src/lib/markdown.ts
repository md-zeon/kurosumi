import MarkdownIt from 'markdown-it';
import type { Token } from 'markdown-it';
import hljs from 'highlight.js';

function highlightFn(str: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
    } catch (__) {}
  }
  return '<pre class="hljs"><code>' + MarkdownIt().utils.escapeHtml(str) + '</code></pre>';
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightFn,
});

// Custom renderer for tables
md.renderer.rules.table_open = function () {
  return '<div class="overflow-x-auto"><table>';
};

md.renderer.rules.table_close = function () {
  return '</table></div>';
};

// Custom renderer for code blocks with copy button
md.renderer.rules.fence = function (tokens: Token[], idx: number) {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : '';
  const langName = info.split(/\s+/g)[0];

  let highlighted: string;
  if (langName && hljs.getLanguage(langName)) {
    try {
      highlighted = hljs.highlight(token.content, { language: langName, ignoreIllegals: true }).value;
    } catch (__) {
      highlighted = md.utils.escapeHtml(token.content);
    }
  } else {
    highlighted = md.utils.escapeHtml(token.content);
  }

  // Escape the raw content for clipboard
  const rawContent = token.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return `<div class="code-block" data-code="${rawContent}">
    <div class="code-header">
      <span class="code-lang">${langName || 'text'}</span>
      <button class="copy-btn" data-copy="true">Copy</button>
    </div>
    <pre class="hljs"><code class="language-${langName}">${highlighted}</code></pre>
  </div>`;
};

export function renderMarkdown(content: string): string {
  return md.render(content);
}
