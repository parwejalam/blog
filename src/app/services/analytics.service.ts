import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 page_view on every router navigation. GA is configured with
 * send_page_view: false in index.html, so this owns all page views including
 * the first. Browser-only — never runs during prerender/SSR. Actual data
 * collection is gated by the consent banner via Google Consent Mode.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    if (!this.isBrowser) return;

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        window.gtag?.('event', 'page_view', {
          page_path: e.urlAfterRedirects,
          page_location: window.location.href,
          page_title: document.title,
        });
      });
  }
}
