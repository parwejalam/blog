---
title: Going zoneless in Angular 20, and why I finally get the hype
slug: angular-20-zoneless
date: 2026-07-12
description: Zone.js has quietly powered Angular change detection for years. Angular 20 makes going without it real. Here is what zoneless actually changes and how I tried it.
tags: angular, performance, signals
---

For most of my Angular career, Zone.js was just there. I never thought about it. It patched async APIs like `setTimeout`, `addEventListener`, and `Promise` so that Angular knew when to run change detection. It worked, but it also meant Angular re-checked large parts of the component tree on every async event, whether anything had actually changed or not.

Angular 20 makes the alternative real. Zoneless change detection moved to developer preview, and the team has been running it in production (the Google Fonts app has been zoneless for months). This is the first time going without Zone.js feels like a real option and not an experiment.

## What zoneless actually means

Without Zone.js, Angular no longer guesses when to run change detection by patching the browser. Instead, it reacts to explicit signals: signal updates, template event bindings, and async pipes. When a signal a template depends on changes, only the affected bindings update. Nothing else gets checked.

That is the mental shift. Change detection stops being "check everything, just in case" and becomes "update exactly what changed."

## How I turned it on

Two steps in a small app:

```ts
// app.config.ts
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
  ],
};
```

Then remove the `zone.js` polyfill from `angular.json`. If you scaffold a fresh app with the Angular 20 CLI, `ng new` even asks whether you want a zoneless app up front.

## What I ran into

Zoneless rewards code that already uses signals. Components that lean on signals, `computed`, and the async pipe pretty much just worked. The rough edges showed up in older patterns: mutating a plain property inside a `setTimeout` and expecting the view to update. Without Zone.js, nothing tells Angular that happened.

The fix is to move that state into a signal, or to trigger updates through the normal binding paths. Angular ships `provideCheckNoChangesConfig` (also in developer preview) to help spot updates that would have silently relied on Zone.js. I treated it as a checklist for readiness.

## Should you switch now?

My honest take as someone still leveling up: not for a large production app yet. It is developer preview for a reason. But it is absolutely worth trying on a side project or a new feature, because it pushes you toward signals, and signals are where Angular is going regardless.

The reported gains are real (community reports mention 30 to 40 percent faster initial renders and far fewer unnecessary re-renders), but the bigger win for me was conceptual. Once you stop relying on Zone.js catching everything, you start writing state you can actually reason about.

I am migrating one component at a time. That feels like the right pace.
