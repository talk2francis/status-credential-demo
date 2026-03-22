# Status Credential Demo — Build Log

1. **Frontend + API scaffold** — created the React + Express workspaces, seeded sample courses, sandbox flows, assessments, admin dashboards, and wired mock API endpoints.
2. **Status Network integration** — generated a deployer key, configured Hardhat for `https://public.sepolia.rpc.status.network`, and added deploy/issue scripts.
3. **On-chain proof** — deployed `StatusCredential` (`0xb735...665B58`) and issued the first credential (`0x1447...6fb78`) with explorer links captured in `docs/status-proof.md`.
4. **Automation & docs** — added npm scripts (`deploy:status`, `issue:status`), `.env.example`, README TL;DR, problem/solution story, and the proof doc.
5. **Rebrand & packaging** — renamed everything to “Status Credential Demo,” refreshed assets, and produced `status-credential-demo.zip` for judges.
