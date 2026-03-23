# Submission Pack — Locus Budget Broker

## Summary
Locus Budget Broker is a Telegram agent that keeps teams from overspending on pay-per-use APIs. A user asks it to vet an email address, the bot quotes the Locus wrapped Email Reputation cost (~$0.006), enforces allowance/max-transaction guardrails, collects an explicit approval, pays through the Locus wallet (`0xdf17…cdaf`), and logs the reasoning + transaction details to `data/locus-audit-log.jsonl` for judges.

## Problem Statement
Agents that make payments or call SaaS APIs typically require hard-coded API keys or manual reviews. There’s no single budget surface, no approval workflow, and no audit trail that explains why money left the wallet. As a result, teams either forbid agents from spending or risk unbounded charges with zero visibility.

## Solution Statement
We plug the agent directly into Locus: every spend goes through Locus’s wallet, allowance, and approval policies. The Telegram bot only runs a wrapped API after it shows the user the plan + estimated cost and the human taps “Approve.” Locus’s own rails execute the payment, the bot records the Locus transaction + risk report in the audit log, and the README documents how to reproduce it in <60 seconds. The agent never sees upstream API keys and all spend is centrally logged.

## 60-Second Demo Script
1. `/start` → bot explains it can vet emails and shows the Locus wallet balance (~10 USDC).
2. `/check scam@example.com` → bot replies with a plan: “Call Locus Email Reputation (~$0.006). Approve?” with Approve/Cancel buttons.
3. Tap **Approve** → bot shows “Running email reputation…” and waits for Locus.
4. Bot replies with deliverability, risk scores, amount spent (actual cost), remaining balance, and the Locus wallet address.
5. Open `data/locus-audit-log.jsonl` (or the README section) to show the JSON entry with the same intent ID + wallet + balance delta.
6. Optional: open `https://beta.paywithlocus.com/dashboard` to show the same transaction in the Locus UI.

## README Outline
- TL;DR of the Locus agent and why Locus is core to the workflow.
- `bots/locus-budget-broker/` setup instructions (`npm install`, `.env`, `npm run dev`).
- Usage (`/check email@example.com` → approval flow).
- Links to `docs/locus-budget-broker-plan.md`, `docs/locus-proof.md`, and `data/locus-audit-log.jsonl` for proofs.

## Proof Checklist
- [x] Wallet registered via beta self-registration (API key + owner key saved in `secrets/locus.json`).
- [x] Wallet funded (gift-code request `b8484ca4-f2d6-45f8-bf7f-fdb0ef6ec79b` → redeem tx `0x8fbf…95dfb`).
- [x] Wrapped API call executed (balance drop from 10 USDC → 9.994 USDC logged in `data/locus-audit-log.jsonl`).
- [x] Telegram flow requires explicit approval and surfaces the spend + remaining balance.
- [x] README + docs explain the guardrails and how to reproduce.

## Why Locus Is Load-Bearing
The agent never holds any external API keys. Every action routes through Locus’s wallet, allowance, approvals, and wrapped API proxy. The Telegram bot is just the UX on top: without Locus there’s no budget enforcement, no pay-per-use billing, no approval URL, and no audit log. All proofs (wallet, audit log, README) point back to the Locus infrastructure.
