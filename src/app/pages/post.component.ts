import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostContentComponent } from '../components/post-content.component';
import { getPost } from '../content/posts';
import { ParsedPost } from '../content/frontmatter';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink, PostContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (post) {
      <article>
        <a class="back" routerLink="/">← All posts</a>
        <header class="post-header">
          <h1>{{ post.title }}</h1>
          <div class="meta">
            @for (tag of post.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
            <time [attr.datetime]="post.date">{{ post.dateLabel }}</time>
            <span class="dot"></span>
            <span>{{ post.readingTime }} min read</span>
          </div>
        </header>
        <app-post-content [markdown]="post.body" />
      </article>
    } @else {
      <section class="not-found">
        <h1>Post not found</h1>
        <p><a routerLink="/">Back to all posts</a></p>
      </section>
    }
  `,
  styles: [
    `
      .back {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-bottom: 1.75rem;
        color: var(--muted);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
      }
      .back:hover {
        color: var(--accent);
      }
      .post-header {
        margin-bottom: 2.5rem;
        padding-bottom: 1.75rem;
        border-bottom: 1px solid var(--border);
      }
      .post-header h1 {
        font-family: var(--display);
        font-weight: 600;
        font-size: 2.3rem;
        line-height: 1.2;
        letter-spacing: -0.015em;
        margin: 0 0 0.8rem;
      }
      .post-header .meta {
        font-size: 0.85rem;
      }
      time {
        white-space: nowrap;
      }
    `,
  ],
})
export class PostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  post: ParsedPost | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.post = getPost(slug);

    if (this.post) {
      this.seo.update({
        title: this.post.title,
        description: this.post.description,
        path: `/blog/${this.post.slug}`,
        type: 'article',
      });
    } else {
      this.seo.update({
        title: 'Post not found',
        description: 'This post could not be found.',
      });
    }
  }
}
