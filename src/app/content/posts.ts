import { ParsedPost, parseFrontmatter } from './frontmatter';

// Markdown files are imported as raw text via the `.md` loader configured in
// angular.json. This bundles content at build time, so it's available during
// prerendering and in the browser without any HTTP fetch or filesystem access.
import helloWorld from '../../content/posts/hello-world.md';
import signalsCounter from '../../content/posts/angular-signals-counter.md';

const RAW_POSTS: string[] = [helloWorld, signalsCounter];

// Parsed once, sorted newest-first.
export const POSTS: ParsedPost[] = RAW_POSTS.map(parseFrontmatter).sort((a, b) =>
  b.date.localeCompare(a.date)
);

export function getPost(slug: string): ParsedPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
