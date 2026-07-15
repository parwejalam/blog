import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Type, computed, signal } from '@angular/core';
import { renderMarkdown } from '../content/markdown';
import { DEMO_REGISTRY } from '../demos/demo-registry';

type Segment =
  | { kind: 'html'; html: string }
  | { kind: 'demo'; component: Type<unknown> };

// Matches a demo marker on its own line, e.g. `:::demo counter:::`
const DEMO_MARKER = /^:::demo\s+([\w-]+):::\s*$/gm;

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.kind === 'html') {
        <div class="prose" [innerHTML]="segment.html"></div>
      } @else {
        <ng-container *ngComponentOutlet="segment.component" />
      }
    }
  `,
})
export class PostContentComponent {
  private readonly body = signal('');

  @Input({ required: true }) set markdown(value: string) {
    this.body.set(value ?? '');
  }

  readonly segments = computed<Segment[]>(() => this.toSegments(this.body()));

  private toSegments(body: string): Segment[] {
    const segments: Segment[] = [];
    let lastIndex = 0;
    DEMO_MARKER.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = DEMO_MARKER.exec(body)) !== null) {
      const text = body.slice(lastIndex, match.index);
      if (text.trim()) {
        segments.push({ kind: 'html', html: this.render(text) });
      }

      const component = DEMO_REGISTRY[match[1]];
      if (component) {
        segments.push({ kind: 'demo', component });
      } else {
        // Unknown demo key — surface it rather than silently dropping content.
        segments.push({
          kind: 'html',
          html: `<p><em>Missing demo: ${match[1]}</em></p>`,
        });
      }
      lastIndex = match.index + match[0].length;
    }

    const tail = body.slice(lastIndex);
    if (tail.trim()) {
      segments.push({ kind: 'html', html: this.render(tail) });
    }

    return segments;
  }

  private render(markdown: string): string {
    return renderMarkdown(markdown);
  }
}
