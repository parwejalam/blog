---
title: Help Scout has two APIs, and they don't share an auth model
slug: helpscout-two-apis-two-auth
date: 2026-07-16
description: What tripped me up wiring Help Scout into an automation — two separate APIs, two different auth methods, and rate limits that count writes twice.
tags: automation, api, n8n
---

I spent time this year wiring Help Scout into an n8n automation, and the first thing that tripped me up had nothing to do with the workflow logic. It was authentication. Help Scout doesn't have one API. It has two, and they don't authenticate the same way.

## Two APIs

The **Docs API** handles knowledge base articles. Base URL is `https://docsapi.helpscout.net/v1/`. Auth here is old-school: an API key over HTTP Basic Auth. The key goes in the username field and you put a dummy password like `X` in the password field.

The **Inbox API (v2)** handles conversations, customers, and mailboxes. Base URL is `https://api.helpscout.net/v2`. This one uses OAuth2 with a Bearer token:

```
Authorization: Bearer <access_token>
```

So if you read a guide that says "Help Scout uses OAuth2" and you're actually hitting the Docs API, you'll waste an hour wondering why Basic Auth is being rejected on one endpoint and required on another. They're just different products under one name.

## OAuth2 has two flows

For the Inbox API, you create an app under Your Profile > My Apps first. Then you pick a flow. Authorization Code flow is for integrations other Help Scout users will install. Client Credentials flow is for your own internal use.

The catch: access tokens last about 48 hours. The authorization code flow gives you a refresh token to swap for a new pair. The client credentials flow has no refresh token, so you just re-authenticate when the token expires. Worth knowing before you build token-refresh logic that one flow doesn't need.

## Rate limits count writes twice

The Inbox API allows 400 requests per minute per account, shared across every user on that account. The part I didn't expect: write requests (POST, PUT, PATCH, DELETE) count as two. So it's 400 reads, or 200 writes, or some mix. When you hit the ceiling you get a 429, and the response carries a `Retry-After` header to tell you how long to wait.

None of this is hard once you know it. But "one product, two APIs, two auth models" is the kind of thing docs mention in passing and you only really learn by getting a 401.

Sources: [Help Scout Docs API](https://developer.helpscout.com/docs-api/), [Inbox API authentication](https://developer.helpscout.com/mailbox-api/overview/authentication/), [Inbox API rate limiting](https://developer.helpscout.com/mailbox-api/overview/rate-limiting/).
