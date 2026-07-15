import { ParsedPost, parseFrontmatter } from './frontmatter';

// Markdown files are imported as raw text via the `.md` loader configured in
// angular.json. This bundles content at build time, so it's available during
// prerendering and in the browser without any HTTP fetch or filesystem access.
import helloWorld from '../../content/posts/hello-world.md';
import signalsCounter from '../../content/posts/angular-signals-counter.md';
import zoneless from '../../content/posts/angular-20-zoneless.md';
import httpResource from '../../content/posts/angular-httpresource.md';
import incrementalHydration from '../../content/posts/angular-incremental-hydration.md';
import controlFlow from '../../content/posts/angular-control-flow.md';
import rxjsToSignals from '../../content/posts/rxjs-to-signals.md';
import whatIsMcp from '../../content/posts/what-is-mcp.md';
import coderToOrchestrator from '../../content/posts/coder-to-orchestrator.md';
import vibeCoding from '../../content/posts/vibe-coding-honestly.md';
import n8nLlm from '../../content/posts/n8n-llm-automation.md';
import aiBadPatterns from '../../content/posts/ai-without-bad-patterns.md';

const RAW_POSTS: string[] = [
  helloWorld,
  signalsCounter,
  zoneless,
  httpResource,
  incrementalHydration,
  controlFlow,
  rxjsToSignals,
  whatIsMcp,
  coderToOrchestrator,
  vibeCoding,
  n8nLlm,
  aiBadPatterns,
];

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
