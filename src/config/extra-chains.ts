import { defineChain } from 'viem';

const plumeSourceId = 11_155_111 // sepolia

export const plumeTestnet = defineChain({
  id: 98_864,
  iconUrl: 'https://test-explorer.plumenetwork.xyz/assets/configs/network_icon.png',
  name: 'Plume Testnet',
  nativeCurrency: {
    name: 'Plume Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://test-rpc.plumenetwork.xyz'],
      webSocket: ['wss://test-rpc.plumenetwork.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://test-explorer.plumenetwork.xyz',
      apiUrl: 'https://test-explorer.plumenetwork.xyz/api/v2\?',
    },
  },
  testnet: true,
  sourceId: plumeSourceId,
})

export const plume = defineChain({
  id: 98_865,
  iconUrl: 'https://explorer.plumenetwork.xyz/assets/configs/network_icon.png',
  name: 'Plume Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: ['https://rpc.plumenetwork.xyz'],
      webSocket: ['wss://rpc.plumenetwork.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.plumenetwork.xyz/',
      apiUrl: 'https://explorer.plumenetwork.xyz/api/v2',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 48577,
    },
  },
})
