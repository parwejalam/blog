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
        <header class="post-header">
          <a class="back" routerLink="/">← All posts</a>
          <h1>{{ post.title }}</h1>
          <time [attr.datetime]="post.date">{{ post.date }}</time>
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
      .post-header {
        margin-bottom: 2rem;
      }
      .back {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: var(--muted);
        text-decoration: none;
        font-size: 0.9rem;
      }
      .back:hover {
        color: var(--accent);
      }
      .post-header h1 {
        margin: 0 0 0.4rem;
      }
      .post-header time {
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.85rem;
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
