import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POSTS } from '../content/posts';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="intro">
      <h1>Parwej Alam</h1>
      <p>Angular developer. Notes on Angular, TypeScript, and AI automation.</p>
    </section>

    <ul class="post-list">
      @for (post of posts; track post.slug) {
        <li>
          <a [routerLink]="['/', post.slug]">
            <span class="post-title">{{ post.title }}</span>
            <time [attr.datetime]="post.date">{{ post.date }}</time>
          </a>
          <p class="post-desc">{{ post.description }}</p>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      .intro {
        margin-bottom: 2.5rem;
      }
      .intro h1 {
        margin: 0 0 0.25rem;
      }
      .intro p {
        color: var(--muted);
        margin: 0;
      }
      .post-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 2rem;
      }
      .post-list a {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        text-decoration: none;
      }
      .post-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text);
      }
      .post-list a:hover .post-title {
        color: var(--accent);
      }
      time {
        color: var(--muted);
        font-size: 0.85rem;
        font-family: var(--mono);
        white-space: nowrap;
      }
      .post-desc {
        margin: 0.4rem 0 0;
        color: var(--muted);
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly posts = POSTS;

  ngOnInit(): void {
    this.seo.update({
      title: 'Blog',
      description: 'Notes on Angular, TypeScript, and AI automation by Parwej Alam.',
      path: '/blog/',
      type: 'website',
    });
  }
}
