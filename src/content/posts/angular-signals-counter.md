---
title: Angular signals, explained with a live counter
slug: angular-signals-counter
date: 2026-07-14
description: A quick look at Angular signals — reactive state without RxJS boilerplate — with a live interactive demo you can click.
tags: angular, signals
---

Signals are Angular's built-in reactive primitive. A signal holds a value, and anything that reads it re-runs when that value changes. No subscriptions, no `async` pipe, no manual change detection.

```ts
count = signal(0);
double = computed(() => this.count() * 2);

increment() {
  this.count.update((n) => n + 1);
}
```

- `signal(0)` creates writable state.
- `computed(...)` derives from it and caches until a dependency changes.
- Reading a signal is just calling it: `count()`.

Here's the exact component above, running live on this page:

:::demo counter:::

That's it. The demo below the fold is a real Angular component, hydrated after the static HTML loads.
