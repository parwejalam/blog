---
title: Angular's built-in control flow cleaned up my templates
slug: angular-control-flow
date: 2026-06-20
description: No more importing NgIf and NgFor or fighting ng-template. Angular's @if, @for, and @switch are built into the template language, and Angular 20 stabilized the last of them.
tags: angular, templates
---

One of the small things that quietly makes Angular nicer to write in 2026 is the built-in control flow. `@if`, `@for`, and `@switch` are part of the template language itself, no imports, no structural directive gymnastics. Angular 20 stabilized `@switch`, so the whole set is now official.

If you learned Angular on `*ngIf` and `*ngFor` like I did, the difference is worth internalizing.

## Before and after

The old way, with an else branch, meant an `ng-template` and a reference:

```html
<div *ngIf="user; else loading">{{ user.name }}</div>
<ng-template #loading>Loading...</ng-template>
```

The new way reads like plain JavaScript:

```html
@if (user) {
  <div>{{ user.name }}</div>
} @else {
  <p>Loading...</p>
}
```

No template reference, no jumping around the file to find `#loading`. The else branch is right there.

## @for, and the track that is now required

`@for` follows the same pattern, but with one rule the old `*ngFor` let you skip: you must provide `track`.

```html
@for (post of posts; track post.slug) {
  <article>{{ post.title }}</article>
} @empty {
  <p>No posts yet.</p>
}
```

Two upgrades here. `track` is mandatory, which nudges you toward stable identity and better rendering performance instead of Angular re-creating DOM nodes needlessly. And `@empty` gives you a first-class empty state, which used to need a separate `@if`.

## @switch, now stable

`@switch` replaces the `[ngSwitch]` attribute trio with something cleaner and type-checked at compile time:

```html
@switch (status) {
  @case ('loading') { <app-spinner /> }
  @case ('error') { <app-error /> }
  @default { <app-content /> }
}
```

No wrapper element just to hold the switch, and the compiler validates the cases.

## Why I actually prefer it

Three reasons, in order of how much they matter to me.

It reads like code. When a template branches the way JavaScript branches, there is less translation happening in my head.

It is built in. Nothing to import into every standalone component. One less line of boilerplate per file adds up.

It is safer. Required `track`, compile-time checks on `@switch`, and no dangling template references mean fewer of the silent mistakes I used to make.

## Migrating is painless

Angular ships a schematic that converts the old syntax for you:

```bash
ng generate @angular/core:control-flow
```

I ran it on an older project and it handled the bulk automatically. I only had to eyeball a few complex `*ngIf` chains.

This is not a flashy feature. It is the kind of change you stop noticing after a week because the new way is just obviously better. Those are usually the ones worth adopting first.
