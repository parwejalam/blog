export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
}

export interface ParsedPost extends PostMeta {
  body: string;
  /** Human-friendly date, e.g. "Jul 14, 2026". Falls back to the raw string. */
  dateLabel: string;
  /** Estimated read time in minutes (>= 1), from the body word count. */
  readingTime: number;
}

/** Words per minute used for the read-time estimate. */
const WPM = 200;

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

function dateLabel(date: string): string {
  // Dates are ISO `YYYY-MM-DD`. Parse as UTC to avoid off-by-one from timezones.
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
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

  const body = raw.slice(match[0].length).trim();

  return {
    title: meta['title'],
    slug: meta['slug'],
    date: meta['date'],
    description: meta['description'],
    tags: (meta['tags'] ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    body,
    dateLabel: dateLabel(meta['date']),
    readingTime: readingTime(body),
  };
}
