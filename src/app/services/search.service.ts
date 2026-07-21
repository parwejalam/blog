import { Injectable, signal } from '@angular/core';
import type Fuse from 'fuse.js';
import { POSTS } from '../content/posts';
import { ParsedPost } from '../content/frontmatter';

/**
 * Client-side full-text search over the posts already bundled in POSTS.
 * fuse.js is loaded lazily on first use so visitors who never search don't
 * pay for it. The index is built in memory from the bundle, so new posts are
 * searchable automatically with no build step or separate index file.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private fuse: Fuse<ParsedPost> | null = null;
  private loading?: Promise<void>;

  /**
   * Shared search state. The input lives in the site header, so the query and
   * its ranked results are owned here and read reactively by the home page.
   */
  readonly query = signal('');
  readonly results = signal<ParsedPost[]>(POSTS);

  /** Update the query, lazily build the index, and refresh results. */
  async setQuery(value: string): Promise<void> {
    this.query.set(value);
    if (value.trim()) {
      await this.ensureReady();
    }
    this.results.set(this.search(value));
  }

  /** Lazily import fuse.js and build the index. Safe to call repeatedly. */
  ensureReady(): Promise<void> {
    if (this.fuse) return Promise.resolve();
    if (!this.loading) {
      this.loading = import('fuse.js').then(({ default: Fuse }) => {
        this.fuse = new Fuse(POSTS, {
          keys: [
            { name: 'title', weight: 3 },
            { name: 'tags', weight: 2 },
            { name: 'description', weight: 2 },
            { name: 'body', weight: 1 },
          ],
          threshold: 0.35,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
      });
    }
    return this.loading;
  }

  /**
   * Return ranked matches for a query. An empty query returns all posts in
   * their normal order. If the index isn't ready yet, returns all posts so the
   * list never disappears mid-load.
   */
  search(query: string): ParsedPost[] {
    const q = query.trim();
    if (!q) return POSTS;
    if (!this.fuse) return POSTS;
    return this.fuse.search(q).map((result) => result.item);
  }
}
