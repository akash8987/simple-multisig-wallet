# Simple Multi-Signature Wallet

A decentralized wallet implementation that demands consensus. Unlike a standard wallet where one private key controls all funds, this contract defines a set of "Owners" and a "Confirmation Threshold."

## Features
- **M-of-N Security:** e.g., 3 owners total, requires 2 signatures to move funds.
- **Transaction Lifecycle:** Submit -> Confirm -> Execute.
- **Transparency:** All owners can see pending transactions and confirmation status on-chain.
- **Funds Management:** Can receive ETH and send it to external addresses securely.

## Workflow
1. **Deploy:** Define the owners and required signatures (e.g., 2) in `deploy.js`.
2. **Submit:** Owner A proposes to send 1 ETH to Address X.
3. **Confirm:** Owner B confirms the proposal.
4. **Execute:** Once the threshold (2) is met, any owner can trigger execution.

## Quick Start
1. `npm install`
2. Configure `deploy.js` with your owner addresses.
3. `npx hardhat run deploy.js --network goerli`
4. Update `app.js` with the new contract address.
5. Open `index.html`.

## Tech Stack
- Solidity ^0.8.17
- Ethers.js
- Hardhat
