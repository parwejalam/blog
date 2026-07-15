import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Tracks the light/dark theme. SSR-safe: on the server it stays at the default
 * and touches no browser APIs. In the browser, `init()` reads the saved choice
 * (or the OS preference) and reflects it onto `<html data-theme>`. An inline
 * script in index.html sets the attribute before first paint to avoid a flash;
 * this service keeps the toggle's signal in sync with that.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('light');

  init(): void {
    if (!this.isBrowser) return;
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(stored ?? (prefersDark ? 'dark' : 'light'));
    this.apply();
  }

  toggle(): void {
    if (!this.isBrowser) return;
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('theme', next);
    this.apply();
  }

  private apply(): void {
    this.doc.documentElement.setAttribute('data-theme', this.theme());
  }
}
