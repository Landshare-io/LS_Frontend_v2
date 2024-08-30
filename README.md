
# LandShare DAPP v2

This project is a decentralized application (dApp) built with Next.js, RainbowKit, WAGMI, and styled using TailwindCSS.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Adding Custom Hooks](#adding-custom-hooks)
- [Context Management](#context-management)
- [Styling](#styling)
- [Learn More](#learn-more)

## Project Structure

```plaintext
root
│
├───src
│   │
│   ├───abis                        # ABI file(s) for smart contracts
│   │   ├───LandToken.json
│   │   ├───LandTokenV2.json
│   │   └───...
│   │
│   ├───components
│   │   ├───common                  # Shared/common components like buttons, modal, etc.
│   │   ├───layout                  # Layout components (e.g., Header, Footer)
│   │   └───dapp                    # Specific components for interacting with the dApp
│   │
│   ├───config
│   │   ├───wagmi.ts                # Configuration for WAGMI client
│   │   ├───ccip.ts                 # Configuration for CCIP environment
│   │   └───contractAddresses.ts    # Configuration for contract addresses
│   │
│   ├───context
│   │   ├───GlobalContext.tsx       # Context for managing global state
│   │   └───...
│   │
│   ├───hooks
│   │   ├───ccip
│   │   │   ├───useApproveLS.ts     # Approve LS CCIP custom hook
│   │   │   └───...
│   │   ├───common
│   │       └───...
│   │
│   ├───pages
│   │   ├───_app.tsx                # Custom App component
│   │   ├───index.tsx               # Homepage
│   │   └───[...other-pages]        # Other pages
│   │       └───index.tsx 
│   │
│   ├───public                      # Public assets like images, icons, etc.
│   │
│   ├───styles                      # Global styles, CSS modules, etc.
│   │   ├───[page].module.css       # Custom page css
│   │   └───globals.css             # Global stylesheet
│   │
│   └───utils
│       ├───helpers                 # Helper functions
│       │   ├───axios.ts            # API helper
│       │   └───...
│       └───types.ts                # TypeScript type definitions
│
├───.env                        # Environment variables (e.g., API keys, network URLs)
└───.gitignore                  # Git ignore file

```

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/.git
cd 
```

2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
Create a .env file at the root of the project and add our environment variables:
```bash
NEXT_PUBLIC_INFURA_ID=your-infura-id
NEXT_PUBLIC_ALCHEMY_ID=your-alchemy-id
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1
```

## Usage
1. Run the development server:
```bash
npm run dev
```

2. Open the app:
Open http://localhost:3000 in your browser to view the app.

## Scripts
- `npm run dev`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the production build.

## Configuration
- WAGMI
The WAGMI client is configured in src/config/wagmi.ts. This file sets up the connectors (e.g., MetaMask, WalletConnect) and providers (e.g., Infura, Alchemy).

## Adding Custom Hooks
Custom hooks are located in the src/hooks/ directory. To create a new hook:

1. Create a new file in the src/hooks/ directory, e.g., useYourHook.ts.
2. Write your hook using the React useState, useEffect, or other necessary hooks.
3. Export your hook in src/hooks/index.ts for easier import elsewhere in the app.

## Styling
This project uses TailwindCSS for styling. Global styles can be added to src/styles/globals.css, and you can use Tailwind’s utility classes in your components.



## Learn More

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.
- [TailwindCSS Documentation](https://tailwindcss.com/docs/installation) - Learn how to use Tailwind CSS.
