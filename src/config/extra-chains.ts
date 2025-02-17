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
      apiUrl: 'https://test-explorer.plumenetwork.xyz/api/v2\?',
    },
  },
  testnet: true,
  sourceId: plumeSourceId,
  iconUrl: "https://public.bnbstatic.com/image/pgc/202405/0b69a26e48ff996d099a08686b75ebeb.png",
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
    default: { http: ['https://rpc.plumenetwork.xyz'] },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://explorer.plumenetwork.xyz/',
      apiUrl: 'https://explorer.plumenetwork.xyz/api/v2',
    },
  },
  contracts: {
    multicall3: {
      address: '0xD630fb6A07c9c723cf709d2DaA9B63325d0E0B73',
      blockCreated: 83183,
    },
  },
  iconUrl: "https://public.bnbstatic.com/image/pgc/202405/0b69a26e48ff996d099a08686b75ebeb.png",
})
