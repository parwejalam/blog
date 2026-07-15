---
title: httpResource() is the data-fetching API I wanted in Angular
slug: angular-httpresource
date: 2026-07-05
description: Angular 20 added httpResource(), a signal-based way to fetch data. No manual subscriptions, no loading flags to juggle. Here is how it works and where it fits.
tags: angular, signals, http
---

Fetching data in Angular used to mean the same dance every time: inject `HttpClient`, subscribe, store the result in a property, track a `loading` boolean by hand, remember to handle errors, and clean up the subscription. It works, but it is a lot of ceremony for "get this data and show it."

Angular 20 introduced `httpResource()`, and it collapses most of that boilerplate into something reactive.

## The basic shape

`httpResource()` returns a resource whose `value` is a signal. You read it directly in the template.

```ts
import { httpResource } from '@angular/common/http';

export class UserComponent {
  userId = signal(1);

  user = httpResource(() =>
    `https://api.example.com/users/${this.userId()}`
  );
}
```

```html
@if (user.isLoading()) {
  <p>Loading...</p>
} @else {
  <p>{{ user.value()?.name }}</p>
}
```

Two things stood out to me immediately. First, there is no subscription to manage. Second, the request is reactive: because the URL function reads `userId()`, changing that signal automatically triggers a new request. Set `userId.set(2)` and the resource refetches on its own.

## The pieces it gives you

The returned resource is more than just a value. It exposes signals for the common states:

- `value()` for the response body
- `isLoading()` for the in-flight state
- `error()` for failures
- `headers()` and `status()` when you need them

No more maintaining three parallel properties for one request.

## It still uses HttpClient underneath

This was the part that sold me. `httpResource()` runs on top of `HttpClient`, so your existing interceptors, auth headers, and error handling all still apply. You configure them the same way in the `HttpClient` provider. It is not a new HTTP stack, it is a reactive wrapper over the one you already know.

## Where I would and would not use it

It shines for read-driven UI: a detail view that depends on a selected id, a search box, a filter that reloads a list. Anywhere the request is a function of some reactive state, `httpResource()` fits naturally.

For one-off imperative calls, like posting a form on a button click, plain `HttpClient` is still simpler. `httpResource()` is about data that reacts to state, not fire-and-forget actions.

## Why this matters beyond convenience

The deeper point is consistency. Angular is moving everything toward signals: state, derived values, and now data fetching. When your HTTP layer speaks the same reactive language as the rest of your component, you stop translating between paradigms. That is what makes the code easier to read six months later, which as someone still building confidence is exactly what I want.

I have started reaching for `httpResource()` first in new components and only dropping to `HttpClient` when I actually need imperative control. So far it has made my components noticeably shorter.
