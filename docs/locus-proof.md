# Locus Budget Broker — Proof Bundle

| Item | Details |
| --- | --- |
| Locus wallet | `0xdf17b4c0394ef7f231e1db629018a1189ff9cdaf` (Base) |
| Funding tx | Gift code `b8484ca4-f2d6-45f8-bf7f-fdb0ef6ec79b` redeemed via `0x8fbff6d578d7179ff4a84c71e56d4c509f79992eee2a07910f03638b04095dfb` |
| Wrapped API spend | Email Reputation check on `scam@example.com` (cost ~0.006 USDC) recorded in `data/locus-audit-log.jsonl` |
| Telegram workflow | `/check email@example.com` → plan/approval → automated spend via Locus → audit log update |

## Demo Steps
1. `cd bots/locus-budget-broker && cp .env.example .env`
2. Fill `LOCUS_API_KEY` + `TELEGRAM_BOT_TOKEN` + optional `AUDIT_LOG_PATH`.
3. `npm install && npm run dev`
4. In Telegram, send `/check scam@example.com` → approve → bot replies with deliverability + remaining balance.

## Audit Log Sample
```
{"timestamp": "2026-03-23T00:05:25Z", "intentId": "4f530901-7274-4724-a9b4-3b429cae306a", "email": "scam@example.com", "wallet": "0xdf17b4c0394ef7f231e1db629018a1189ff9cdaf", "estimatedCost": 0.006, "actualCost": 0.006, "balanceBefore": 10.0, "balanceAfter": 9.994, "resultSummary": {"deliverability": "undeliverable", "addressRisk": "high"}, "source": "manual-test"}
```

## Submission Checklist
- ✅ Locus API key + wallet registered via beta self-registration.
- ✅ Wallet funded (10 USDC) via gift-code redeem.
- ✅ Wrapped API usage with spending controls + approval prompts.
- ✅ Audit trail stored in repo (`data/locus-audit-log.jsonl`).
- ✅ Architecture + safety doc (`docs/locus-budget-broker-plan.md`).
