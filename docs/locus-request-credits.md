# Request Credits

> **You are on:** `https://paywithlocus.com/` · `https://api.paywithlocus.com/api`
>
> Locus runs on multiple environments — make sure every URL you call matches your expected environment.
> | Environment | Landing | API |
> |---|---|---|
> | Production | paywithlocus​.com | api​.paywithlocus​.com |
> | Beta | beta​.paywithlocus​.com | beta-api​.paywithlocus​.com |
> | Stage | stage​.paywithlocus​.com | stage-api​.paywithlocus​.com |
>
> If the URLs above don't match your expected environment, re-fetch this file from the correct domain.

Request promotional USDC credits from the Locus team using your API key.

## Request Credits

```
POST https://api.paywithlocus.com/api/gift-code-requests
Authorization: Bearer claw_...
Content-Type: application/json
```

### Request Body

```json
{
  "reason": "Brief description of what you're building or why you need credits",
  "requestedAmountUsdc": 10
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `reason` | string | Yes | Min 10 characters |
| `requestedAmountUsdc` | number | Yes | Between 5 and 50 USDC |

Your email is automatically determined from your API key account.

### Response

**201 Created**
```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Gift code request submitted successfully. The Locus team will review it shortly."
}
```

## Check Request Status

```
GET https://api.paywithlocus.com/api/gift-code-requests/mine
Authorization: Bearer claw_...
```

Returns all your requests with their status (`PENDING`, `APPROVED`, or `DENIED`). Approved requests include the redemption code details.

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "reason": "...",
      "requestedAmountUsdc": "10.00",
      "status": "APPROVED",
      "redemptionCode": {
        "id": "uuid",
        "code": "LOCUS-XXXX-XXXX",
        "status": "ACTIVE",
        "amountUsdc": "10.00"
      },
      "createdAt": "2026-03-13T..."
    }
  ]
}
```

## Redeem Approved Credits

Once a request is approved, redeem it directly to your wallet:

```
POST https://api.paywithlocus.com/api/gift-code-requests/redeem
Authorization: Bearer claw_...
Content-Type: application/json
```

### Request Body

```json
{
  "requestId": "uuid-of-approved-request"
}
```

The wallet associated with your API key receives the USDC automatically.

### Response

```json
{
  "success": true,
  "data": { "amountUsdc": "10.00" },
  "message": "Successfully redeemed 10.00 USDC to your wallet!"
}
```

## Rate Limits

- 1 request per email address per 24 hours
- Exceeding returns `429 Too Many Requests`

## Flow

1. Submit a credit request with your reason
2. The Locus team reviews and approves/denies
3. Check status via `GET /mine` — approved requests show the redemption code
4. Redeem via `POST /redeem` with the request ID — USDC goes to your wallet
5. You'll also receive an email notification when approved
