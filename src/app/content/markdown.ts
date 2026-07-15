import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

// Register only the languages we actually write about, so highlight.js stays
// small in the bundle. Aliases map common fence tags to the right grammar.
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const renderer = new marked.Renderer();

// Wrap fenced code in the styled window (dots + language label) and highlight it.
// Runs identically at prerender (Node) and in the browser, so hydration matches.
renderer.code = (code: string, infostring: string | undefined): string => {
  const lang = (infostring ?? '').trim().split(/\s+/)[0];
  let highlighted: string;
  let displayLang = lang;

  if (lang && hljs.getLanguage(lang)) {
    highlighted = hljs.highlight(code, { language: lang }).value;
  } else {
    highlighted = escapeHtml(code);
    displayLang = displayLang || 'code';
  }

  return (
    `<div class="code-block">` +
    `<div class="code-head">` +
    `<span class="cd cd-r"></span><span class="cd cd-y"></span><span class="cd cd-g"></span>` +
    `<span class="lang">${escapeHtml(displayLang || 'code')}</span>` +
    `</div>` +
    `<pre><code class="hljs">${highlighted}</code></pre>` +
    `</div>`
  );
};

marked.use({ renderer });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
