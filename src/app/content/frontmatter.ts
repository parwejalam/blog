export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
}

export interface ParsedPost extends PostMeta {
  body: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Minimal frontmatter parser. Handles the flat `key: value` blocks we use in
 * posts/*.md — no nested YAML, which keeps this dependency-free and safe to run
 * both at build-time (prerender) and in the browser bundle.
 */
export function parseFrontmatter(raw: string): ParsedPost {
  const match = FENCE.exec(raw);
  if (!match) {
    throw new Error('Post is missing frontmatter block');
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) meta[key] = value;
  }

  const required = ['title', 'slug', 'date', 'description'];
  for (const key of required) {
    if (!meta[key]) throw new Error(`Post frontmatter missing "${key}"`);
  }

  return {
    title: meta['title'],
    slug: meta['slug'],
    date: meta['date'],
    description: meta['description'],
    tags: (meta['tags'] ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    body: raw.slice(match[0].length).trim(),
  };
}
