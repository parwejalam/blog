# Blog

Personal blog for Parwej Alam. Angular 19 app where every post is **prerendered to static HTML** at build time, hosted on GitHub Pages at `https://parwejalam.github.io/blog/`.

Prerendering means the article text is in the HTML before any JavaScript runs — fast first paint, real SEO, and working link previews.

## How it works

- **Posts are Markdown.** Add a `.md` file in [src/content/posts/](src/content/posts/) with frontmatter, then register it in [src/app/content/posts.ts](src/app/content/posts.ts). The `.md` loader (configured in [angular.json](angular.json)) imports them as text, so content is bundled at build time — no runtime fetch.
- **Static output mode.** `outputMode: "static"` + [src/app/app.routes.server.ts](src/app/app.routes.server.ts) enumerate every post slug via `getPrerenderParams`, so each post becomes its own `dist/blog/browser/<slug>/index.html`.
- **Per-post SEO.** [src/app/services/seo.service.ts](src/app/services/seo.service.ts) sets `<title>`, description, and Open Graph / Twitter meta tags for each route.
- **Live demos.** A post can embed an interactive Angular component with a `:::demo <key>:::` marker. Keys map to components in [src/app/demos/demo-registry.ts](src/app/demos/demo-registry.ts).

## Adding a post

1. Create `src/content/posts/my-post.md` with frontmatter:
   ```
   ---
   title: My post title
   slug: my-post
   date: 2026-07-14
   description: One-line summary used for SEO and the post list.
   tags: angular, notes
   ---
   ```
2. Add the import to [src/app/content/posts.ts](src/app/content/posts.ts).
3. `npm run build` — the new slug is prerendered automatically.

## Adding a live demo

1. Create a standalone component under [src/app/demos/](src/app/demos/).
2. Register it in [src/app/demos/demo-registry.ts](src/app/demos/demo-registry.ts) under a key.
3. Reference it in Markdown with `:::demo <key>:::` on its own line.

## Commands

```bash
npm start          # dev server at http://localhost:4200/
npm run build      # prerendered production build -> dist/blog/browser
npm run deploy:404 # copy CSR shell to 404.html for SPA deep-link fallback
```

## Deployment

Pushing to `main` triggers [.github/workflows/node.js.yml](.github/workflows/node.js.yml), which builds, generates `404.html`, and publishes `dist/blog/browser` to the `gh-pages` branch. Point GitHub Pages at the `gh-pages` branch (root) once the repo is on GitHub.
