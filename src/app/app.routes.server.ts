import { RenderMode, ServerRoute } from '@angular/ssr';
import { allSlugs } from './content/posts';

export const serverRoutes: ServerRoute[] = [
  {
    // Enumerates every post so each :slug renders to its own static HTML file.
    path: ':slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => allSlugs().map((slug) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
