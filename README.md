# Status Credential Demo Stack

Status Credential Demo is a Status Network–powered credential engine that issues verifiable attestations in seconds.

## TL;DR (judges start here)
- **What this is:** a Telegram-style workflow (bot + web UI) that mints on-chain credentials on the gasless Status L2.
- **Why it matters:** programs, bootcamps, and DAOs can grant proof-of-skill instantly without forcing learners to pay gas or touch complex wallets.
- **Proof it works:**
  - Contract `StatusCredential` → `0xb735a8373CCf7F81B06B159dD7bC704897665B58`
  - Deployment tx → https://sepoliascan.status.network/tx/0x4982abfffd0e574461aadc7a353fc8ad36c56b9132470fe13a270a90a7f51289
  - Credential issuance tx → https://sepoliascan.status.network/tx/0x1447cdc83b899bd46555324a9c72a5e2f2e624450768134656964a28f7f6fb78
- **One-command demo:** `npm run issue:status` (after filling `.env`), which reproduces the credential issuance.

## Problem → Solution → Impact
| Problem | Solution | Why Status Network | Impact |
| --- | --- | --- | --- |
| Issuing verifiable credentials still requires manual reviews, spreadsheets, and centralized trust. | A bot + dashboard that auto-issues credentials tied to learning progress, sandbox trades, and instructor approvals. | Gasless transactions mean instant attestations without fees; public explorer provides transparent proofs. | Programs can certify progress, DAOs can grant reputation, and learners leave with portable, on-chain credentials. |

## Repo layout

```
.
├── packages
│   ├── frontend   # React + Vite SPA
│   └── api        # Express mock backend
├── demo-data      # JSON seed payloads
├── docs           # Specs, storyboard, and pitch artifacts
└── scripts        # Tooling (seeding, exports)
```

## Quick start

```bash
npm install
npm run demo:init     # validates + caches seed data
npm run dev           # launches API on 4000 & Vite on 5173
```

Set `VITE_API_URL` in `packages/frontend/.env` if the API runs on a non-default host.

## Acceptance criteria (snapshot)
- 6 routed screens (landing, catalog, detail, player, sandbox, assessments, dashboards)
- Auth panel with magic link + wallet connect mocks wired to Express endpoints
- Sandbox trades hit `/api/sandbox/trade` and refresh the ledger
- Certificate generator calls `/api/certificates/generate` and surfaces base64 assets
- Social kit, lesson scripts, assessments, and reels captured in `docs/`

## Next up
- Add Cypress smoke tests covering auth -> course -> sandbox -> certificate
- Build social kit export command (`npm run export:bundle`) incl. ZIP + storyboard assets
- Attach Figma prototype link + 90s demo video once produced

## Status Network automation
```bash
# Prepare deps once
cd status-network
npm install
cp .env.example .env   # fill PRIVATE_KEY, STATUS_RPC_URL, STATUS_CONTRACT_ADDRESS

# Deploy a fresh StatusCredential contract
npm run deploy:status

# Issue a demo credential (set STATUS_CONTRACT_ADDRESS first)
STATUS_CONTRACT_ADDRESS=<deployed_contract> npm run issue:status
```

> `STATUS_CONTRACT_ADDRESS` can live in `status-network/.env` so you don’t have to pass it inline.

## On-chain proof
See [`docs/status-proof.md`](docs/status-proof.md) for the deployed contract, explorer links, and the credential issuance transaction.

## Deploying to Vercel
1. Create a Vercel project and either import this repo or add a Vercel token for CLI deploys.
2. Ensure the project root is the repo root (monorepo aware via `vercel.json`).
3. Build command: `npm install && npm run build -w packages/frontend`
4. Output directory: `packages/frontend/dist`
5. Environment variables: optional `VITE_API_URL` if the API is hosted elsewhere (not required because `/api` is served via the bundled serverless Express function in `api/[[...path]].ts`).
6. Run `vercel deploy --prod` once authenticated to issue the public URL.
