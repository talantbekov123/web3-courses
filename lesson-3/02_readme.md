
- Allowance
- ERC-20 does NOT guarantee safe transfers, to can be anything
- Never assume supply is static
- events matter more than storage

# Burn address
- 0x0000000000000000000000000000000000000000
- 0x000000000000000000000000000000000000dEaD
- 0xdead000000000000000042069420694206942069

These are ERC-20 compliant but dangerous:
- fee-on-transfer tokens
- rebasing tokens
- blacklistable tokens
- pausable tokens

ERC-20 is intentionally dumb: balances + allowances + events — everything else is convention.

- show real ERC-20 bugs from history
- or explain why ERC-777 failed
