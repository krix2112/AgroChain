# AgroChain

A full-stack Web3 application for agricultural supply chain management.

## Project Structure

- `/frontend`: Next.js web application (Tailwind CSS, ethers.js).
- `/backend`: Node.js + Express REST API.
- `/contracts`: Hardhat project for Solidity smart contracts.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies in each directory:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../contracts && npm install
   ```

### Running the Project

- **Contracts**: `npx hardhat node` and `npx hardhat run scripts/deploy.js --network localhost`
- **Backend**: `npm start` (from `/backend`)
- **Frontend**: `npm run dev` (from `/frontend`)
