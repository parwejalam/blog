---
title: Vibe coding, honestly: where it helps and where it bites
slug: vibe-coding-honestly
date: 2026-05-20
description: Vibe coding is one of the most hyped and most misunderstood ideas in AI development. Here is a grounded take on when leaning on the vibes works and when it burns you.
tags: ai, vibe-coding, workflow
---

"Vibe coding," a term Andrej Karpathy popularized, is everywhere. The loose definition: describe what you want to an AI, accept what it produces, and keep going on feel rather than reading every line. It sounds either liberating or reckless depending on who is describing it. Having tried it on real work, I think both reactions are right, and the trick is knowing which situation you are in.

## The framing that actually helps

The most useful thing Karpathy said, at least for me, is not about speed. It is this: AI automates fastest in domains where the output can be verified.

That single idea sorts almost everything. If you can quickly and cheaply check whether the result is correct, leaning on the AI is great, because a wrong answer costs you almost nothing to catch. If you cannot easily verify correctness, vibe coding is where things quietly go wrong.

## Where I let the vibes lead

Cases where verification is cheap and I happily move fast:

- A throwaway script to reshape some data, where I can just look at the output
- A UI prototype I am going to click through anyway
- Boilerplate with an obvious right answer, like a config or a mapping function
- Exploring an unfamiliar API, where running it tells me if it worked

In all of these, if the AI is wrong, I find out in seconds. Low stakes, fast feedback, let it rip.

## Where it bites

The failures show up exactly where verification is hard:

- Security-sensitive code, where "looks fine" and "is safe" are very different
- Complex business logic with edge cases you cannot eyeball
- Anything touching money, auth, or user data
- Code that will live for years and be maintained by someone else

Here the plausible-looking answer is the dangerous one. It compiles, it runs on the happy path, and the bug is in the case you did not check. When generation is cheap, mistakes are cheap to produce too, and they hide well.

## The honest middle ground

I do not think vibe coding is a yes or no. It is a dial you set based on how expensive a wrong answer is to catch.

My actual workflow: let the AI draft aggressively, then shift into review mode with the dial turned the other way. The higher the stakes, the more I read every line, write tests, and refuse to ship on vibes alone. For a prototype, I barely look. For auth logic, I read all of it.

The mistake I see, and made early on, is using the same dial everywhere: either distrusting AI for everything and losing the speed, or trusting it for everything and shipping subtle bugs. The skill is matching the trust to the verifiability.

Vibe coding is a real productivity unlock. It is just not a personality. It is a tool you point at the right problems.
