# Email Reputation — Wrapped API

> **You are on:** `https://beta-api.paywithlocus.com/api` | [llms.txt](https://beta.paywithlocus.com/llms.txt)
>
> Locus runs on multiple environments — make sure every URL you call matches your expected environment.
> | Environment | Landing | API |
> |---|---|---|
> | Production | paywithlocus​.com | api​.paywithlocus​.com |
> | Beta | beta​.paywithlocus​.com | beta-api​.paywithlocus​.com |
> | Stage | stage​.paywithlocus​.com | stage-api​.paywithlocus​.com |
>
> If the API URL above doesn't match your expected environment, re-fetch this file from the correct domain.

> Check the reputation and risk score of an email address.

**Category:** Validation | **Website:** [www.abstractapi.com/api/email-reputation-api](https://www.abstractapi.com/api/email-reputation-api) | **Docs:** [docs.abstractapi.com/email-reputation](https://docs.abstractapi.com/email-reputation)

Pay-per-use API proxy. Each call is automatically billed to your wallet in USDC.

## Access

**Base URL:** `https://beta-api.paywithlocus.com/api/wrapped/abstract-email-reputation/`
**Auth:** `Authorization: Bearer <LOCUS_API_KEY>`

> Also available via MPP (no account needed): [mpp/abstract-email-reputation.md](https://beta.paywithlocus.com/mpp/abstract-email-reputation.md)

## Endpoints

### Check

Get reputation score and risk assessment for an email address.

**Estimated cost:** $0.006

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address to check |

```bash
curl -X POST https://beta-api.paywithlocus.com/api/wrapped/abstract-email-reputation/check \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"<string>"}'
```
