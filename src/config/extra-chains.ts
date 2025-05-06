import { defineChain } from 'viem';

const plumeSourceId = 11_155_111 // sepolia

export const plumeTestnet = defineChain({
  id: 98_867,
  iconUrl: 'https://test-explorer.plume.org/assets/configs/network_icon.png',
  name: 'Plume Testnet',
  nativeCurrency: {
    name: 'Plume',
    symbol: 'Plume',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.plume.org'],
      webSocket: ['wss://testnet-rpc.plume.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.plume.org',
      apiUrl: 'https://testnet-explorer.plume.org/api/v2\?',
    },
  },
  testnet: true,
  sourceId: plumeSourceId,
})

export const plume = defineChain({
  id: 98_866,
  iconUrl: 'https://explorer.plume.org/assets/configs/network_icon.png',
  name: 'Plume Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Plume',
    symbol: 'Plume',
  },
  rpcUrls: {
    default: { 
      http: ['https://rpc.plume.org'],
      webSocket: ['wss://phoenix-rpc.plume.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.plume.org',
      apiUrl: 'https://explorer.plume.org/api/v2',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 39679,
    },
  },
})
