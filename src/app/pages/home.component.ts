import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly search = inject(SearchService);

  readonly query = this.search.query;
  readonly results = this.search.results;

  ngOnInit(): void {
    this.seo.update({
      title: 'Blog',
      description: 'Notes on Angular, TypeScript, and AI automation by Parwej Alam.',
      path: '/blog/',
      type: 'website',
    });
  }
}
