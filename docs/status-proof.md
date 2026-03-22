# Status Network On-Chain Proofs

## Contract Deployment
- **Contract:** `StatusCredential`
- **Address:** `0xb735a8373CCf7F81b06B159dD7bC704897665B58`
- **Tx Hash:** `0x4982abfffd0e574461aadc7a353fc8ad36c56b9132470fe13a270a90a7f51289`
- **Explorer:** https://sepoliascan.status.network/tx/0x4982abfffd0e574461aadc7a353fc8ad36c56b9132470fe13a270a90a7f51289

## Demo Credential Issuance
- **Recipient:** `0xc4d91a1a7d17cf640393eEc976429Dd02E162237`
- **XP Awarded:** `1000`
- **Tx Hash:** `0x1447cdc83b899bd46555324a9c72a5e2f2e624450768134656964a28f7f6fb78`
- **Explorer:** https://sepoliascan.status.network/tx/0x1447cdc83b899bd46555324a9c72a5e2f2e624450768134656964a28f7f6fb78

## Reproduce Locally
```bash
# 1. Set up Status Network secrets
cp status-network/.env.example status-network/.env
# edit PRIVATE_KEY and STATUS_CONTRACT_ADDRESS in status-network/.env

# 2. Deploy (writes a new contract)
npm run deploy:status

# 3. Issue a credential from the deployed contract
STATUS_CONTRACT_ADDRESS=<your_contract> npm run issue:status
```

> `STATUS_CONTRACT_ADDRESS` can be set in `status-network/.env` to avoid passing it inline.
