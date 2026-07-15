import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { POSTS } from '../content/posts';
import { ParsedPost } from '../content/frontmatter';
import { SeoService } from '../services/seo.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="intro">
      <div class="avatar" aria-hidden="true">PA</div>
      <div>
        <h1>Parwej Alam</h1>
        <p>Angular developer. Notes on Angular, TypeScript, and AI automation.</p>
      </div>
    </section>

    <div class="search">
      <input
        #searchBox
        type="search"
        class="search-input"
        placeholder="Search posts…  (press /)"
        aria-label="Search posts"
        [value]="query()"
        (input)="onQuery(searchBox.value)"
      />
    </div>

    <p class="section-label">
      @if (query()) {
        {{ results().length }} result{{ results().length === 1 ? '' : 's' }}
      } @else {
        Writing
      }
    </p>

    @if (results().length) {
      <ul class="post-list">
        @for (post of results(); track post.slug) {
          <li>
            <a class="card" [routerLink]="['/', post.slug]">
              <h2 class="card-title">{{ post.title }}</h2>
              <p class="card-desc">{{ post.description }}</p>
              <div class="meta">
                @if (post.tags[0]) {
                  <span class="tag">{{ post.tags[0] }}</span>
                }
                <time [attr.datetime]="post.date">{{ post.dateLabel }}</time>
                <span class="dot"></span>
                <span>{{ post.readingTime }} min read</span>
              </div>
            </a>
          </li>
        }
      </ul>
    } @else {
      <p class="empty">No posts match “{{ query() }}”.</p>
    }
  `,
  styles: [
    `
      .intro {
        margin-bottom: 2rem;
        display: flex;
        gap: 1.1rem;
        align-items: center;
      }
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        flex: none;
        background: linear-gradient(135deg, var(--accent), #a78bfa);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 1.4rem;
      }
      .intro h1 {
        font-family: var(--display);
        font-weight: 600;
        font-size: 2rem;
        margin: 0 0 0.15rem;
        letter-spacing: -0.01em;
      }
      .intro p {
        color: var(--muted);
        margin: 0;
        font-size: 1rem;
      }
      .search {
        margin-bottom: 2rem;
      }
      .search-input {
        width: 100%;
        font-family: var(--sans);
        font-size: 1rem;
        color: var(--text);
        background: var(--surface);
        border: 1px solid var(--border-strong);
        border-radius: 12px;
        padding: 0.7rem 1rem;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .search-input::placeholder {
        color: var(--muted);
      }
      .search-input:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-soft);
      }
      .section-label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        font-weight: 600;
        margin: 0 0 1.1rem;
      }
      .post-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
      }
      .card {
        display: block;
        border: 1px solid var(--border);
        background: var(--surface);
        border-radius: 14px;
        padding: 1.3rem 1.4rem;
        box-shadow: var(--shadow);
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.18s, transform 0.18s, border-color 0.18s;
      }
      .card:hover {
        box-shadow: var(--shadow-hover);
        transform: translateY(-2px);
        border-color: var(--border-strong);
      }
      .card-title {
        font-size: 1.22rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        margin: 0 0 0.5rem;
      }
      .card:hover .card-title {
        color: var(--accent);
      }
      .card-desc {
        margin: 0 0 0.85rem;
        color: var(--muted);
        font-size: 0.98rem;
      }
      time {
        white-space: nowrap;
      }
      .empty {
        color: var(--muted);
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly search = inject(SearchService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);

  private readonly searchBox = viewChild<ElementRef<HTMLInputElement>>('searchBox');

  readonly query = signal('');
  readonly results = signal<ParsedPost[]>(POSTS);

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
    this.query.set(value);
    if (value.trim()) {
      await this.search.ensureReady();
    }
    this.results.set(this.search.search(value));
  }

  ngOnInit(): void {
    this.seo.update({
      title: 'Blog',
      description: 'Notes on Angular, TypeScript, and AI automation by Parwej Alam.',
      path: '/blog/',
      type: 'website',
    });

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
