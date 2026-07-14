import { Type } from '@angular/core';
import { CounterDemoComponent } from './counter-demo.component';

// Maps a demo key (used in posts as `:::demo <key>:::`) to a standalone
// component. Add new interactive demos here and reference them from Markdown.
export const DEMO_REGISTRY: Record<string, Type<unknown>> = {
  counter: CounterDemoComponent,
};
