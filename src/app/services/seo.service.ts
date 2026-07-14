import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  /** Absolute or root-relative path of the current page, e.g. /blog/hello-world */
  path?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = 'Parwej Alam';
const SITE_ORIGIN = 'https://parwejalam.github.io';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(data: SeoData): void {
    const fullTitle = `${data.title} · ${SITE_NAME}`;
    this.title.setTitle(fullTitle);

    this.setName('description', data.description);
    this.setProperty('og:title', data.title);
    this.setProperty('og:description', data.description);
    this.setProperty('og:type', data.type ?? 'website');
    this.setProperty('og:site_name', SITE_NAME);
    if (data.path) {
      this.setProperty('og:url', `${SITE_ORIGIN}${data.path}`);
    }
    this.setName('twitter:card', 'summary');
    this.setName('twitter:title', data.title);
    this.setName('twitter:description', data.description);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }
}
