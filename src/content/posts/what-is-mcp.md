---
title: What is MCP, and why every dev tool suddenly supports it
slug: what-is-mcp
date: 2026-06-04
description: The Model Context Protocol went from a niche idea to the default way LLMs talk to tools. Here is what MCP is, in plain terms, from someone learning it.
tags: ai, mcp, tools
---

If you have poked at AI tooling lately, you have seen MCP everywhere. GitHub, Slack, Jira, Sentry, and Datadog all ship official ones. There are reportedly over 2,000 public MCP servers now. As someone learning AI automation, I wanted to actually understand what it is instead of nodding along.

MCP stands for Model Context Protocol. In one line: it is a standard way for a language model to connect to external tools and data.

## The problem it solves

Before MCP, every AI tool integration was custom. If you wanted an assistant to read your database, call your API, or check your monitoring, someone wrote bespoke glue code for that specific model and that specific tool. Do it again for a different model, write the glue again.

That does not scale. It is the same mess integrations always are before a standard shows up.

## The analogy that made it click

MCP is often described as "USB-C for AI tools," and that comparison is what made it land for me. Before USB-C, every device had its own charger. After, one connector works across everything.

MCP is that connector, but for connecting models to capabilities. You write an MCP server once for your tool. Then any MCP-compatible client (Claude Code, an AI IDE, whatever comes next) can use it. Write once, works everywhere.

## The two sides

There are two roles:

- An MCP server exposes a capability: query this database, read these docs, open a pull request, send this message.
- An MCP client is the AI application that consumes those capabilities on the model's behalf.

The model does not talk to your database directly. It asks the client, the client talks to the server over MCP, and the result comes back. Clean separation, and the same tool works no matter which model is driving.

## Why it matters right now

The developer role is shifting from writing every line to orchestrating AI agents that do work. But an agent is only as useful as the tools it can reach. An agent that can read your codebase, run your tests, and check your logs is genuinely helpful. One that can only generate text in a box is a toy.

MCP is the plumbing that gives agents real reach. That is why adoption exploded: it is the standard that makes agents actually useful in a real workflow.

## Where I am with it

I am still early. I have used MCP-backed tools more than I have built servers. But the concept changed how I think about AI tooling. It stops being "which model is smartest" and becomes "what can this thing actually do in my environment," which is the question that matters for real work.

If you are learning automation like I am, understanding MCP is worth an afternoon. It is the layer everything else is being built on top of.
