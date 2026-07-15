---
title: Moving component state from RxJS to signals
slug: rxjs-to-signals
date: 2026-06-12
description: Signals are not a replacement for RxJS, but for local component state they remove a lot of boilerplate. Here is how I think about which stays and which goes.
tags: angular, signals, rxjs
---

When signals stabilized in Angular, the first question I had was the obvious one: does this replace RxJS? Short answer, no. Longer answer, and the one that actually helped me, is that signals and RxJS solve different problems, and a lot of the RxJS I was writing was for the wrong problem.

Signals are for state. RxJS is for events and streams over time. Once that line got clear in my head, migrating became easy.

## The state that should be a signal

Here is a pattern I used to write constantly with a `BehaviorSubject`:

```ts
private count$ = new BehaviorSubject(0);
count = this.count$.asObservable();

increment() {
  this.count$.next(this.count$.value + 1);
}
```

And in the template, an `async` pipe on `count`. It works, but there is a lot of machinery here for "a number that changes."

The signal version:

```ts
count = signal(0);

increment() {
  this.count.update((n) => n + 1);
}
```

In the template, just `{{ count() }}`. No `async` pipe, no subscription, no `asObservable()`. For plain component state, this is strictly less code and less to get wrong.

## Derived values get better too

Anywhere I chained `map` to compute a value from state, `computed` is cleaner:

```ts
count = signal(0);
doubled = computed(() => this.count() * 2);
```

`computed` caches and only recalculates when a dependency actually changes. No operator pipeline, no wondering when it emits.

## The RxJS I kept

I did not delete RxJS. I kept it for what it is genuinely good at:

- Debounced search inputs (`debounceTime`, `switchMap`)
- WebSocket and event streams
- Anything where timing and cancellation are the whole point

These are streams of events over time, and RxJS models them far better than signals do.

## The bridge between them

The useful part is you do not have to choose per feature. Angular gives you converters:

```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable -> Signal, read it in the template with no async pipe
data = toSignal(this.http.get('/api/data'));

// Signal -> Observable, when you need operators
search$ = toObservable(this.searchTerm).pipe(debounceTime(300));
```

So a common pattern for me now is: keep the stream in RxJS where debouncing or switching matters, then `toSignal` at the edge so the template stays simple.

## How I decide

My rule of thumb, as someone still building confidence with both:

- Is it a value the UI reads? Signal.
- Is it a value derived from other values? `computed`.
- Is it a sequence of events over time, or does timing or cancellation matter? RxJS, then `toSignal` at the boundary.

I am not doing a big-bang rewrite. I convert component state to signals as I touch each file, and I leave the genuinely stream-shaped code alone. The result is templates with fewer `async` pipes and state I can actually follow.
