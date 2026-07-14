import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-box">
      <p class="demo-value">
        count = <strong>{{ count() }}</strong> &nbsp; double = <strong>{{ double() }}</strong>
      </p>
      <div class="demo-actions">
        <button type="button" (click)="decrement()">−</button>
        <button type="button" (click)="reset()">reset</button>
        <button type="button" (click)="increment()">+</button>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-box {
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 1rem 1.25rem;
        background: var(--surface);
        margin: 1.5rem 0;
      }
      .demo-value {
        margin: 0 0 0.75rem;
        font-family: var(--mono);
      }
      .demo-actions {
        display: flex;
        gap: 0.5rem;
      }
      button {
        font: inherit;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--text);
        border-radius: 8px;
        padding: 0.35rem 0.9rem;
        min-width: 3rem;
      }
      button:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    `,
  ],
})
export class CounterDemoComponent {
  readonly count = signal(0);
  readonly double = computed(() => this.count() * 2);

  increment(): void {
    this.count.update((n) => n + 1);
  }

  decrement(): void {
    this.count.update((n) => n - 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
