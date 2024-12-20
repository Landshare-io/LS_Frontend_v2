import { http } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  bsc,
  polygon,
  bscTestnet,
  sepolia,
  polygonAmoy,
  hardhat
} from 'wagmi/chains';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { IS_TEST_MODE } from './config/constants/environments';
import { plume, plumeTestnet } from './config/extra-chains';

export const config = getDefaultConfig({
  appName: 'Landshare v2',
  projectId: '4f656a05b513be8ae06173f4b9262692',
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
    plume,
    ...(IS_TEST_MODE ? [bscTestnet, sepolia, polygonAmoy, plumeTestnet, hardhat] : []),
  ],
  ssr: true,
  transports: {
    [bsc.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [plume.id]: http(),
    ...(IS_TEST_MODE ? {
      [bscTestnet.id]: http(), 
      [sepolia.id]: http(), 
      [polygonAmoy.id]: http(),
      [plumeTestnet.id]: http(), 
      [hardhat.id]: http()
    } : {} as Record<number, typeof http>),
  },
});

export const supportChainIds = [
  bsc.id, polygon.id, arbitrum.id, plume.id, ...(IS_TEST_MODE ? [bscTestnet.id, sepolia.id, polygonAmoy.id, plumeTestnet.id, hardhat.id] : []),
]
