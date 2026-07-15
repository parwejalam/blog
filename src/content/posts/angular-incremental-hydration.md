---
title: Incremental hydration made SSR click for me
slug: angular-incremental-hydration
date: 2026-06-28
description: Server-side rendering gives you fast first paint, then ships a pile of JavaScript to wake the page up. Angular 20 incremental hydration only wakes up the parts that need it.
tags: angular, ssr, performance
---

I built this blog with Angular prerendering, so hydration is something I actually think about now. Here is the problem in one sentence: server-side rendering gives you fast, SEO-friendly HTML, but then the browser downloads and runs JavaScript to make the whole page interactive, even the parts nobody touches.

That "wake up everything at once" step is called hydration, and it can undo a lot of the speed you gained from SSR. Angular 20 ships incremental hydration as a stable feature, and it changes the deal.

## The idea

Instead of hydrating the entire page on load, you hydrate components only when they are actually needed. You declare a trigger, and Angular defers the hydration of that block until the trigger fires.

```html
@defer (hydrate on viewport) {
  <app-comments />
}

@defer (hydrate on interaction) {
  <app-share-widget />
}
```

The comments section only hydrates when it scrolls into view. The share widget only wakes up when someone interacts with it. Until then, the server-rendered HTML just sits there, visible and correct, costing zero JavaScript.

## Triggers I found useful

The ones I reached for most:

- `on viewport` for anything below the fold
- `on interaction` for widgets that do nothing until clicked
- `on idle` for low-priority extras
- `on immediate` when you do want it right away

The mental model is simple: ask "does this need to be interactive the moment the page loads?" Usually the answer is no.

## What it actually buys you

Two things. Smaller initial JavaScript, because you are not shipping and running hydration code for the whole tree up front. And better Core Web Vitals, specifically Time to Interactive and First Input Delay, because the main thread is not blocked waking up components the user has not reached yet.

For a content site like a blog, this is close to ideal. The article text is static HTML that never needed hydration in the first place. The interactive bits (a live demo, a comment box) hydrate on demand.

## A caveat I hit

Incremental hydration pairs with `@defer`, and you have to be honest about what is truly independent. If a deferred block shares state with something above it, you can get surprises about when that state becomes live. I kept deferred blocks self-contained, and things stayed predictable.

There is also the `PendingTasks` API, now stable, which lets you hold the SSR response until certain tasks finish. Useful when you need data resolved before the server sends HTML.

## My takeaway

Before Angular 20, SSR felt like a tradeoff: great first paint, heavy hydration cost. Incremental hydration removes most of that tension. You render on the server, and you only pay for interactivity where you use it. For someone building content-first sites, that is exactly the right default.
