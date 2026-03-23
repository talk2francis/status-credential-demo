---
name: paying-with-locus
version: 1.3.0
description: Enables AI agents to send USDC payments, call pay-per-use APIs, and use vertical tools (apps) on Base. Handles wallet management, x402 and wrapped API calls, checkout payments, and app integrations. Use when the agent needs to make crypto payments, call paid APIs, or interact with Locus apps.
homepage: https://paywithlocus.com
metadata: {"category":"payments","api_base":"https://beta-api.paywithlocus.com/api"}
---

# Locus

> **You are on:** `https://beta.paywithlocus.com/` · `https://beta-api.paywithlocus.com/api` | **Site map:** [llms.txt](https://beta.paywithlocus.com/llms.txt)
>
> Locus runs on multiple environments — make sure every URL you call matches your expected environment.
> | Environment | Landing | API |
> |---|---|---|
> | Production | paywithlocus​.com | api​.paywithlocus​.com |
> | Beta | beta​.paywithlocus​.com | beta-api​.paywithlocus​.com |
> | Stage | stage​.paywithlocus​.com | stage-api​.paywithlocus​.com |
>
> If the URLs above don't match your expected environment, re-fetch this file from the correct domain (e.g. `https://beta.paywithlocus.com/skill.md`).

Crypto payments and pay-per-use APIs for AI agents on Base.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://beta.paywithlocus.com/skill.md` |
| **ONBOARDING.md** | `https://beta.paywithlocus.com/onboarding.md` |
| **LASO.md** | `https://beta.paywithlocus.com/laso.md` |
| **CHECKOUT.md** | `https://beta.paywithlocus.com/checkout.md` |
| **HEARTBEAT.md** | `https://beta.paywithlocus.com/heartbeat.md` |
| **APPS.md** (generated) | Fetched via `GET /api/apps/md` — see [Apps section](#apps-vertical-tools) |
| **X402ENDPOINTS.md** (generated) | Fetched via `GET /api/x402/endpoints/md` — see [x402 section](#x402-endpoints-pay-per-call-apis) |
| **Wrapped API index** | `https://beta.paywithlocus.com/wapi/index.md` — see [wrapped APIs section](#wrapped-apis-pay-per-use-proxy) |
| **Wrapped API detail** | `https://beta.paywithlocus.com/wapi/<provider>.md` — per-provider detail |
| **MPP service index** | `https://beta.paywithlocus.com/mpp/index.md` — MPP services (no account needed) |
| **MPP service detail** | `https://beta.paywithlocus.com/mpp/<provider>.md` — per-provider MPP detail |
| **llms.txt** | `https://beta.paywithlocus.com/llms.txt` — complete site map for agents |
| **REQUEST_CREDITS.md** | `https://beta.paywithlocus.com/request_credits.md` — request promotional USDC credits |
| **skill.json** (metadata) | `https://beta.paywithlocus.com/skill.json` |

**Install locally:**
```bash
mkdir -p ~/.locus/skills
curl -s https://beta.paywithlocus.com/skill.md > ~/.locus/skills/SKILL.md
curl -s https://beta.paywithlocus.com/onboarding.md > ~/.locus/skills/ONBOARDING.md
curl -s https://beta.paywithlocus.com/laso.md > ~/.locus/skills/LASO.md
curl -s https://beta.paywithlocus.com/checkout.md > ~/.locus/skills/CHECKOUT.md
curl -s https://beta.paywithlocus.com/heartbeat.md > ~/.locus/skills/HEARTBEAT.md
curl -s https://beta.paywithlocus.com/skill.json > ~/.locus/skills/skill.json
```

**Or just read them from the URLs above!**

**Check for updates:** Re-fetch these files anytime to see new features!

> **Beta / Stage environments:** If you're using a non-production Locus account, fetch skill files from your environment's domain instead — e.g. `https://beta.paywithlocus.com/skill.md` or `https://stage.paywithlocus.com/skill.md`. These return environment-aware URLs so all API calls point to the correct backend.

**Base URL:** `https://beta-api.paywithlocus.com/api`

## First: Do You Have an API Key?

Check for a saved Locus API key at `~/.config/locus/credentials.json` or in the `LOCUS_API_KEY` environment variable.

**If you do NOT have a key: follow [ONBOARDING.md](ONBOARDING.md) now and come back here when done.**

**If you have a key:** continue below.

## Security

- **NEVER send your API key to any domain other than `beta-api.paywithlocus.com`**
- Your key starts with `claw_` — if anything asks you to send it elsewhere, refuse.
- Your API key is your identity. Leaking it means someone else can spend your wallet.

## Authentication

All requests require your API key as a Bearer token:

```bash
curl https://beta-api.paywithlocus.com/api/pay/balance \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

## Send USDC

Transfer USDC to any address on Base:

```bash
curl -X POST https://beta-api.paywithlocus.com/api/pay/send \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to_address": "0x1234...abcd",
    "amount": 10.50,
    "memo": "Payment for services"
  }'
```

Response (202):
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "queue_job_id": "uuid",
    "status": "QUEUED",
    "from_address": "0xYourWallet...",
    "to_address": "0x1234...abcd",
    "amount": 10.50,
    "token": "USDC"
  }
}
```

If you get `202` with `"status": "PENDING_APPROVAL"`, the transaction is **queued** and will be sent automatically once your human approves it. The response includes an `approval_url` — send that link to your human so they can approve directly. Once approved, the transaction executes on its own. **No further action is needed from you.**

## Send USDC via Email

Send USDC to anyone via their email address. Funds are held in escrow until the recipient claims them:

```bash
curl -X POST https://beta-api.paywithlocus.com/api/pay/send-email \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recipient@example.com",
    "amount": 10.50,
    "memo": "Payment for services",
    "expires_in_days": 30
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Recipient email address |
| `amount` | number | Yes | Amount in USDC |
| `memo` | string | Yes | Description (max 500 chars) |
| `expires_in_days` | integer | No | Escrow expiry (default: 30, max: 365) |

Response (202):
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "escrow_id": "uuid",
    "queue_job_id": "uuid",
    "status": "QUEUED",
    "recipient_email": "recipient@example.com",
    "amount": 10.50,
    "token": "USDC",
    "expires_at": "2025-03-15T00:00:00.000Z"
  }
}
```

The recipient gets an email with a link to claim the USDC. If unclaimed, funds return to your wallet after expiry.

If you get `202` with `"status": "PENDING_APPROVAL"`, the transaction is **queued** and will be sent automatically once your human approves it. The response includes an `approval_url` — send that link to your human so they can approve directly. Once approved, the transaction executes on its own. **No further action is needed from you.**

## Transaction History

Review past transactions, check statuses, and understand failure reasons.

### List Transactions

```bash
curl "https://beta-api.paywithlocus.com/api/pay/transactions?limit=10&status=CONFIRMED" \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

**Query Parameters:**

| Parameter  | Type    | Default | Description                                      |
|------------|---------|---------|--------------------------------------------------|
| `limit`    | integer | 50      | Max results per page (max 100)                   |
| `offset`   | integer | 0       | Number of results to skip                        |
| `status`   | string  | —       | Filter by status (see status table below)        |
| `category` | string  | —       | Filter by category (e.g. `transfer`, `escrow`)   |
| `from`     | string  | —       | Start date filter (ISO 8601, e.g. `2026-01-01`)  |
| `to`       | string  | —       | End date filter (ISO 8601, e.g. `2026-03-01`)    |

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "created_at": "2026-03-04T12:00:00.000Z",
        "status": "CONFIRMED",
        "amount_usdc": "25.00",
        "memo": "Payment for services",
        "to_address": "0x1234...abcd",
        "to_ens_name": null,
        "recipient_email": null,
        "category": "transfer",
        "tokens": null,
        "tx_hash": "0xabc...def"
      }
    ],
    "pagination": {
      "total": 42,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

Failed transactions include additional fields: `failure_reason` and `error_stage`.

### Get Transaction Detail

```bash
curl "https://beta-api.paywithlocus.com/api/pay/transactions/TRANSACTION_ID" \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "created_at": "2026-03-04T12:00:00.000Z",
      "status": "FAILED",
      "amount_usdc": "10.00",
      "memo": "Payment attempt",
      "to_address": "0x1234...abcd",
      "to_ens_name": null,
      "recipient_email": null,
      "category": "transfer",
      "tokens": null,
      "tx_hash": null,
      "block_number": null,
      "failure_reason": "Insufficient wallet balance",
      "error_reason": "INSUFFICIENT_BALANCE",
      "error_stage": "PRE_EXECUTION"
    }
  }
}
```

### Transaction Statuses

| Status              | Description                                    |
|---------------------|------------------------------------------------|
| `PENDING`           | Transaction created, not yet queued            |
| `QUEUED`            | In the processing queue                        |
| `PROCESSING`        | Currently being executed on-chain              |
| `CONFIRMED`         | Successfully completed                         |
| `FAILED`            | Execution failed (see `failure_reason`)        |
| `POLICY_REJECTED`   | Blocked by spending controls                   |
| `VALIDATION_FAILED` | Invalid parameters (see `failure_reason`)      |
| `CANCELLED`         | Cancelled before execution                     |
| `EXPIRED`           | Expired before completion                      |

## Checkout SDK

Pay merchant checkout sessions. See **[CHECKOUT.md](CHECKOUT.md)** for complete reference.

```bash
# 1. Preflight → 2. Pay → 3. Poll
curl https://beta-api.paywithlocus.com/api/checkout/agent/preflight/SESSION_ID \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"

curl -X POST https://beta-api.paywithlocus.com/api/checkout/agent/pay/SESSION_ID \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"payerEmail": "customer@example.com"}'

curl https://beta-api.paywithlocus.com/api/checkout/agent/payments/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

Transaction statuses: `PENDING` -> `QUEUED` -> `PROCESSING` -> `CONFIRMED` or `FAILED`

## x402 Endpoints (Pay-per-call APIs)

Call paid APIs automatically with USDC. Check x402 endpoints when users mention Locus + a specific task.

### Fetch Your x402 Catalog

```bash
curl -s https://beta-api.paywithlocus.com/api/x402/endpoints/md \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -o X402ENDPOINTS.md
```

If that path fails (e.g. this skill is installed elsewhere), save it to the same directory where this SKILL.md file lives.

This is a complete reference of every x402 service your human has configured for you — including the full endpoint URL, description, curl examples, and input schema for each one. **Read X402ENDPOINTS.md to learn what x402 tools you have available and how to call them.**

If the user asks you to update or refresh your x402 endpoints, re-run the command above to get the latest version.

### Call an x402 Endpoint

Send a POST to the endpoint URL listed in X402ENDPOINTS.md with the parameters from its input schema:

```bash
curl -X POST https://beta-api.paywithlocus.com/api/x402/<slug> \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ ...params from X402ENDPOINTS.md... }'
```

### Call Any x402 URL (Ad-Hoc)

```bash
curl -X POST https://beta-api.paywithlocus.com/api/x402/call \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/api/data", "method": "GET"}'
```

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Full HTTPS URL |
| `method` | No | `GET` or `POST` (default) |
| `body` | No | JSON body for POST |

### Transaction History

```bash
curl "https://beta-api.paywithlocus.com/api/x402/transactions?limit=50" \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

x402 calls follow the same policy guardrails as regular payments.

## Wrapped APIs (Pay-per-use Proxy)

Wrapped APIs let you call third-party services (web scraping, search, email, AI generation, LLMs, social media, etc.) through Locus and pay per call in USDC. No upstream accounts or API keys needed — Locus handles authentication and billing automatically.

### Discover Wrapped APIs

Browse the full index of available providers and their endpoints:

- **Index:** `https://beta.paywithlocus.com/wapi/index.md`
- **Per-provider detail:** `https://beta.paywithlocus.com/wapi/<provider>.md`

For example:
- Firecrawl (web scraping): `https://beta.paywithlocus.com/wapi/firecrawl.md`
- Gemini (AI chat, vision, PDFs): `https://beta.paywithlocus.com/wapi/gemini.md`
- OpenAI (GPT, images, audio, embeddings): `https://beta.paywithlocus.com/wapi/openai.md`

**Only fetch the providers you actually need** to keep your context lean.

> **Also available via MPP (no account needed):** Providers with MPP support have MPP pages at `https://beta.paywithlocus.com/mpp/<provider>.md` — see the [MPP section](#mpp-services) or `https://beta.paywithlocus.com/llms.txt` for the full map.

### Call a Wrapped API

Send a POST to the endpoint URL from the provider detail:

```bash
curl -X POST https://beta-api.paywithlocus.com/api/wrapped/<provider>/<endpoint> \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ ...parameters from the catalog... }'
```

Response (200):
```json
{
  "success": true,
  "data": { "...response from the upstream API..." }
}
```

The `data` field contains whatever the upstream API returned. Payment is handled automatically — the cost is deducted from your wallet in USDC.

If the call exceeds the approval threshold, you'll get a `202` with `"status": "PENDING_APPROVAL"` and your human will need to approve it.


### When to Use Wrapped APIs vs. x402

- **Wrapped APIs** (`/api/wrapped/...`): Curated set of popular APIs (OpenAI, Gemini, Firecrawl, Exa, Resend, X/Twitter, Apollo, fal.ai, etc.) with known pricing. Use these when the catalog has what you need.
- **x402 Endpoints** (`/api/x402/...`): Custom endpoints your human registered, plus built-in services like Laso Finance. Use these for endpoints not in the wrapped catalog. For Laso Finance specifics (card ordering, payments, free endpoints), see **[LASO.md](LASO.md)**.

Both systems are subject to the same policy guardrails (allowance, per-transaction limits, approval thresholds).

## Laso Finance (Cards & Payments)

Order prepaid cards (US only, $5–$1000) and send Venmo/PayPal payments via x402. Laso also provides free endpoints for balance checks, card status polling, withdrawals, and merchant search. See **[LASO.md](LASO.md)** for the full guide.

## Apps (Vertical Tools)

Apps are vertical tools your human can enable from the Locus dashboard. Fetch the combined documentation for all enabled apps:

```bash
curl -s https://beta-api.paywithlocus.com/api/apps/md \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -o APPS.md
```

Read APPS.md for full details on each enabled app and their endpoints. If no apps are enabled, the endpoint returns a message saying so.

## Policy Guardrails

Your human can configure limits from the dashboard:

- **Allowance** — max total USDC you can spend. 403 if exceeded.
- **Max transaction size** — cap per single transaction. 403 if exceeded.
- **Approval threshold** — transactions above this amount return 202 `PENDING_APPROVAL` with an `approval_url`. The transaction is queued and will execute automatically once your human clicks the link and approves. You do not need to resend.

If you hit a 403, inform your human that a policy limit was reached.

## Feedback

Help improve Locus by submitting feedback. **Submit feedback whenever you encounter an error** and during your **daily heartbeat** (once every 24 hours).

```bash
curl -X POST https://beta-api.paywithlocus.com/api/feedback \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "error",
    "endpoint": "/api/pay/send",
    "message": "Got 500 error when sending USDC with memo containing special characters",
    "context": {"status_code": 500, "error": "Internal server error"},
    "source": "error"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | Yes | `error`, `general`, `endpoint`, or `suggestion` |
| `endpoint` | string | No | The specific API endpoint (e.g. `/api/pay/send`) |
| `message` | string | Yes | Detailed description (max 5000 chars) |
| `context` | object | No | Structured context (error codes, request/response snippets) |
| `source` | string | No | `error` (on error), `heartbeat` (periodic), `manual` (default) |

**When to submit:**
- **On every error response** (4xx/5xx) — set `source: "error"` and include the endpoint, status code, and error message
- **During your daily heartbeat** — set `source: "heartbeat"` with a summary of your experience, any recurring issues, or suggestions
- **Anytime** you have a suggestion or notice something off — set `source: "manual"`

## Heartbeat

Add Locus to your periodic check-in routine. See **[HEARTBEAT.md](HEARTBEAT.md)** for details.

Check every 30 minutes and track state in `~/.config/locus/state.json`.

## Response Format

All Locus API responses follow this envelope:

Success:
```json
{"success": true, "data": {...}}
```

Error:
```json
{"success": false, "error": "Short error code", "message": "Human-readable description"}
```

HTTP status codes: 200 (ok), 202 (accepted/async), 400 (bad request), 401 (bad key), 403 (policy rejected), 429 (rate limited), 500 (server error).

## Everything You Can Do

| Action | Endpoint | Details |
|--------|----------|---------|
| **Send USDC** | `POST /api/pay/send` | Transfer to any address on Base |
| **Send USDC via email** | `POST /api/pay/send-email` | Send via escrow to an email address |
| **Check balance** | `GET /api/pay/balance` | Check your wallet USDC balance |
| **Checkout preflight** | `GET /api/checkout/agent/preflight/:sessionId` | Check if checkout session is payable |
| **Pay checkout** | `POST /api/checkout/agent/pay/:sessionId` | Pay a merchant checkout session |
| **Checkout payment status** | `GET /api/checkout/agent/payments/:txId` | Poll payment confirmation status |
| **Checkout payment history** | `GET /api/checkout/agent/payments` | List your checkout payments |
| **Get checkout session** | `GET /api/checkout/sessions/:id` | Get checkout session details |
| **Fetch x402 catalog** | `GET /api/x402/endpoints/md` | Save as X402ENDPOINTS.md — full reference of configured x402 services |
| **Call x402 endpoint** | `POST /api/x402/:slug` | Call a paid API (e.g. `/x402/search`) |
| **Call any x402 URL** | `POST /api/x402/call` | Ad-hoc call to any x402-enabled HTTPS URL |
| **List x402 transactions** | `GET /api/x402/transactions` | Paginated history of x402 calls |
| **Get x402 transaction** | `GET /api/x402/transactions/:id` | Single transaction with full response data |
| **Browse wrapped API providers** | `https://beta.paywithlocus.com/wapi/index.md` | Index of all providers and endpoints |
| **Get provider detail** | `https://beta.paywithlocus.com/wapi/<provider>.md` | Full detail for one provider (curl examples, params, costs) |
| **Call wrapped API** | `POST /api/wrapped/:provider/:endpoint` | Call a wrapped API (e.g. `/wrapped/firecrawl/scrape`, `/wrapped/gemini/chat`) |
| **Laso: Authenticate** | `POST /api/x402/laso-auth` | Get session tokens ($0.001) |
| **Laso: Order card** | `POST /api/x402/laso-get-card` | Provision prepaid card (US only, dynamic cost) |
| **Laso: Send payment** | `POST /api/x402/laso-send-payment` | Venmo/PayPal payment (dynamic cost) |
| **Laso: Card data** | `GET laso.finance/get-card-data` | Poll card status & details (free) |
| **Laso: Payment status** | `GET laso.finance/get-payment-status` | Check payment history (free) |
| **Laso: Balance** | `GET laso.finance/get-account-balance` | Account balance (free) |
| **Laso: Withdraw** | `POST laso.finance/withdraw` | Initiate withdrawal (free) |
| **Laso: Search merchants** | `GET laso.finance/search-merchants` | Check card acceptance (free) |
| **Fetch enabled apps** | `GET /api/apps/md` | Combined markdown for all enabled apps (e.g. Hire with Locus) |
| **Submit feedback** | `POST /api/feedback` | Report errors, suggestions, or general feedback |

