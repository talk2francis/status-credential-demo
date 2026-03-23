# Locus Budget Broker — Architecture & Safety

## Goal
A Telegram bot that acts as a budget broker: it evaluates paid API calls (Email Reputation via Locus wrapped APIs), shows the proposed spend, enforces Locus spending controls, executes the call through the Locus wallet when the user approves, and logs every action for judges.

## Telegram Flow
1. **User prompt** → “Check the reputation of this email” (or similar).
2. **Bot plan** → Summarize intent + quoted price, confirm budget, ask for approval.
3. **Approval guard** → If amount <= allowance threshold, accept inline “Approve” button; otherwise request manual confirmation.
4. **Execution** → Call our backend endpoint → Locus wrapped API 
5. **Result & audit** → Reply with structured summary (score, risk) + amount spent, and append entry to audit log file + Locus transaction log.

## Components
- `bot/telegram.ts`: Telegraf bot handling commands and inline approvals.
- `services/locusClient.ts`: wraps Locus REST calls (balance, spending policy, wrapped API, audit log push).
- `services/auditLog.ts`: appends JSON lines to `data/audit-log.json` with timestamp, intent, cost, tx hash.
- `config/safety.ts`: thresholds + copy for warnings.

## Where Locus is used
- **Wallet + spend controls**: we read/update allowance/max txn via `/api/laso/policies` endpoints (per LASO doc) so the agent cannot overspend.
- **Wrapped API call**: `POST /api/wrapped/abstract-email-reputation/check` charges the wallet each time.
- **Audit**: we’ll record Locus transaction IDs + tx hashes from the wrapped API response alongside our local audit log.

## Data handling
- **Secrets**: API key/private key/Telegram token live in `secrets/` (already saved).
- **Runtime state**: per-chat approvals + pending intents stored in-memory (and reset on restart) — fine for demo.
- **Persistent outputs**: `data/audit-log.json` (human-readable), plus README proof section referencing it.

## Spending Controls & Approvals
- Default allowance = 10 USDC, single-tx cap = 5 USDC.
- Before each call, bot fetches `/api/pay/balance` and ensures `amount <= max_transaction_size` (or imposes manual cap if null).
- For demo request we keep spend below 1 USDC (Email Reputation ~$0.006). Still, bot will:
  - Show planned action + estimated cost
  - Require explicit “Approve” tap before hitting the wrapped API
  - Abort if allowance/max cap breached or wallet balance insufficient.

## Safety Policy (to embed in prompts)
1. Never spend without describing the plan and showing the quoted cost.
2. Refuse/abort if the request would exceed allowance, max transaction size, or wallet balance.
3. Require explicit approval for every paid action (and re-approval if the plan changes).
4. Never leak the Locus API key or owner private key; only call `https://beta-api.paywithlocus.com/api/*` endpoints.
5. Log every financial action (intent, amount, tx hash, outcome) to the audit log + Telegram response.
6. Handle errors safely: explain the failure, include the Locus error message, and leave the wallet unchanged.
7. If Locus responds with `PENDING_APPROVAL`, surface the approval URL so the human can finalize it.

## Demo Script Outline
1. `/start` → bot explains capabilities + current budget.
2. User: “Check fraud risk for fraud@scam-mail.com under $1.”
3. Bot: “Plan: use Locus Email Reputation API ($0.006). Approve?” (inline button).
4. User taps Approve → bot confirms, calls wrapped API, replies with score + cost + tx ID.
5. Bot posts link to audit log entry and states remaining balance.
6. README includes screenshot of Locus dashboard showing the spend + audit log snippet.
