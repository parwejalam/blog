import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SearchService } from './services/search.service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  readonly theme = inject(ThemeService);
  readonly search = inject(SearchService);
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);

  private readonly searchBox = viewChild<ElementRef<HTMLInputElement>>('searchBox');

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== '/' || event.defaultPrevented) return;
    const el = this.doc.activeElement;
    const typing =
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      (el as HTMLElement | null)?.isContentEditable === true;
    if (typing) return;
    event.preventDefault();
    this.searchBox()?.nativeElement.focus();
  };

  async onQuery(value: string): Promise<void> {
    if (value.trim() && this.router.url !== '/') {
      await this.router.navigate(['/']);
    }
    await this.search.setQuery(value);
  }

  ngOnInit(): void {
    this.theme.init();
    this.analytics.init();

    if (this.isBrowser) {
      this.doc.addEventListener('keydown', this.onKeydown);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.doc.removeEventListener('keydown', this.onKeydown);
    }
  }
}
