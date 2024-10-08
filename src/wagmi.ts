import { http } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  bsc,
  polygon,
  bscTestnet,
  sepolia,
  polygonAmoy
} from 'wagmi/chains';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const config = getDefaultConfig({
  appName: 'Landshare v2',
  projectId: 'YOUR_PROJECT_ID',
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet],
    }
  ],
  chains: [
    bsc,
    polygon,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [bscTestnet, sepolia, polygonAmoy] : []),
  ],
  ssr: true,
  transports: {
    [bsc.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? {
      [bscTestnet.id]: http(), 
      [sepolia.id]: http(), 
      [polygonAmoy.id]: http()
    } : {} as Record<number, typeof http>),
  },
});

export const supportChainIds = [
  bsc.id, polygon.id, arbitrum.id, ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [bscTestnet.id, sepolia.id, polygonAmoy.id] : []),
]
