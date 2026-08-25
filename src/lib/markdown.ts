import markdownit from 'markdown-it';
import hljs from 'highlight.js';

export const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  },
});

// Custom renderer for tables
md.renderer.rules.table_open = function () {
  return '<div class="overflow-x-auto"><table>';
};

md.renderer.rules.table_close = function () {
  return '</table></div>';
};

// Custom renderer for task lists
md.renderer.rules.bullet_list_open = function () {
  return '<ul class="task-list">';
};

// Custom renderer for code blocks with copy button
md.renderer.rules.fence = function (tokens, idx) {
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

  return `<div class="code-block">
    <div class="code-header">
      <span class="code-lang">${langName || 'text'}</span>
      <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">Copy</button>
    </div>
    <pre class="hljs"><code class="language-${langName}">${highlighted}</code></pre>
  </div>`;
};

export function renderMarkdown(content: string): string {
  return md.render(content);
}
