import { defineChain } from 'viem';

const plumeSourceId = 11_155_111 // sepolia

export const plumeTestnet = defineChain({
  id: 98_864,
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
      apiUrl: 'https://test-explorer.plumenetwork.xyz/api\?',
    },
  },
  testnet: true,
  sourceId: plumeSourceId,
})

export const plume = defineChain({
  id: 98_865,
  name: 'Plume Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://phoenix-rpc.plumenetwork.xyz'] },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://phoenix-explorer.plumenetwork.xyz/',
      apiUrl: 'https://phoenix-explorer.plumenetwork.xyz/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xD630fb6A07c9c723cf709d2DaA9B63325d0E0B73',
      blockCreated: 83183,
    },
  },
})
