import { getDefaultProvider } from "ethers";
import type { Address } from "viem";
import { Inter_Tight } from "next/font/google";

export const BOLD_INTER_TIGHT = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});
export const FIREBASE_CONNECT_CONFIG = {
  apiKey: "AIzaSyBjrzJ0FSNpeFxeeB-8ZmfNPIQ0HceEnNw",
  authDomain: "landshare-28977.firebaseapp.com",
  projectId: "landshare-28977",
  storageBucket: "landshare-28977.appspot.com",
  messagingSenderId: "644674595145",
  appId: "1:644674595145:web:b72e453f72272dc602d298",
  measurementId: "G-BLF8H8PN8W",
};
export const PROVIDER_URLS = {
  56: 'https://bsc-dataseed2.binance.org/',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  1: 'https://mainnet.infura.io/v3/',
  11155111: 'https://rpc.sepolia.org',
  137: 'https://polygon-rpc.com/',
  80002: 'https://rpc-amoy.polygon.technology',
  42161: 'https://arb1.arbitrum.io/rpc',
  421614: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public'
}
export const PROVIDERS = {
  56: getDefaultProvider(PROVIDER_URLS['56']),
  97: getDefaultProvider(PROVIDER_URLS['97']),
  1: getDefaultProvider(PROVIDER_URLS['1']),
  11155111: getDefaultProvider(PROVIDER_URLS['11155111']),
  137: getDefaultProvider(PROVIDER_URLS['137']),
  80002: getDefaultProvider(PROVIDER_URLS['80002']),
  42161: getDefaultProvider(PROVIDER_URLS['42161']),
  421614: getDefaultProvider(PROVIDER_URLS['42161'])
}
export const ADDRESS_BOOK_ID = 731780 // 18c3953f93f00ab7003571dbd4e0a915
export const LANDTOKENCONTRACT_ADDRESS = {
  56: '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C' as Address,
  97: '0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9' as Address,
  1: '' as Address,
  11155111: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05' as Address,
  137: '0xC03E6ad83dE7C58c9166fF08D66B960d78e64105' as Address,
  80002: '0xcab0EF91Bee323d1A617c0a027eE753aFd6997E4' as Address,
  42161: '0x27Bc2757fAb0b8aB406016D1f71d8123452095d3' as Address,
  421614: '0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D' as Address
}
export const APICONSUMERCONTRACT_ADDRESS = '0x234fCeB8e266cc0843ea134f378f0157dB4d09dE' as Address
export const LPTOKENV2CONTRACT_ADDRESS = '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address
export const MASTERCHEFCONTRACT_ADDRESS = '0x3f9458892fB114328Bc675E11e71ff10C847F93b' as Address
export const WBNBTOKENCONTRACT_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as Address
export const BNBAPEPAIRCONTRACT_ADDRESS = '0x51e6D27FA57373d8d4C256231241053a70Cb1d93' as Address
export const PANCAKEPAIRCONTRACT_ADDRESS = '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address
