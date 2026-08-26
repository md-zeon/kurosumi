export const exportStyles = `
  @page {
    size: A4;
    margin: 2.5cm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #1a1a1a;
    margin: 0;
    padding: 0;
    background: white;
  }

  /* Typography */
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #0a090f;
    margin-top: 0;
    margin-bottom: 24px;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #0a090f;
    margin-top: 32px;
    margin-bottom: 16px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #0a090f;
    margin-top: 24px;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #0a090f;
    margin-top: 20px;
    margin-bottom: 8px;
  }

  p {
    margin-top: 0;
    margin-bottom: 16px;
    line-height: 1.7;
  }

  /* Links */
  a {
    color: #5542ff;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s;
  }

  a:hover {
    border-bottom-color: #5542ff;
  }

  /* Code */
  code {
    font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 13px;
    background: #f4f4f5;
    padding: 2px 6px;
    border-radius: 4px;
    color: #5542ff;
  }

  pre {
    background: #0a090f;
    color: #efefe6;
    padding: 16px 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
    line-height: 1.5;
  }

  pre code {
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: 13px;
  }

  /* Blockquote */
  blockquote {
    margin: 16px 0;
    padding: 12px 20px;
    border-left: 4px solid #5542ff;
    background: #fafafa;
    border-radius: 0 8px 8px 0;
    color: #525252;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }

  /* Lists */
  ul, ol {
    margin: 12px 0;
    padding-left: 28px;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.6;
  }

  li:last-child {
    margin-bottom: 0;
  }

  /* Task lists */
  .task-list {
    list-style: none;
    padding-left: 0;
  }

  .task-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .task-list li::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #5542ff;
    border-radius: 4px;
    margin-top: 4px;
    flex-shrink: 0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
  }

  thead {
    background: #f4f4f5;
  }

  th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
    color: #0a090f;
    border-bottom: 2px solid #e4e4e7;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e4e4e7;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }

  /* Horizontal rule */
  hr {
    border: none;
    height: 1px;
    background: #e4e4e7;
    margin: 32px 0;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }

  /* Strong and emphasis */
  strong {
    font-weight: 600;
    color: #0a090f;
  }

  em {
    font-style: italic;
  }

  /* Strikethrough */
  del {
    text-decoration: line-through;
    color: #71717a;
  }

  /* Code blocks with language */
  .code-block {
    margin: 16px 0;
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #18181b;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #27272a;
  }

  .code-lang {
    font-size: 12px;
    color: #a1a1aa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Print styles */
  @media print {
    body {
      font-size: 12pt;
    }

    h1 {
      font-size: 24pt;
    }

    h2 {
      font-size: 18pt;
    }

    h3 {
      font-size: 14pt;
    }

    pre {
      background: #f4f4f5 !important;
      color: #1a1a1a !important;
      border: 1px solid #e4e4e7;
    }

    pre code {
      color: #1a1a1a !important;
    }

    blockquote {
      background: #f4f4f5;
    }

    a {
      color: #1a1a1a;
      text-decoration: underline;
    }

    a::after {
      content: " (" attr(href) ")";
      font-size: 10pt;
      color: #71717a;
    }
  }
`;

export function getExportHtmlContent(title: string, markdownHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${exportStyles}</style>
</head>
<body>
  <article>
    ${markdownHtml}
  </article>
</body>
</html>`;
}

export function getPdfContainerHtml(title: string, markdownHtml: string): string {
  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
      <h1 style="font-size: 32px; font-weight: 700; color: #0a090f; margin-bottom: 24px; letter-spacing: -0.02em;">${title}</h1>
      <div class="markdown-content">
        ${markdownHtml}
      </div>
    </div>
  `;
}
