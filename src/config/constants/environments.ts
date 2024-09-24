import { getDefaultProvider } from "ethers";
import type { Address } from "viem";
import { Inter_Tight } from "next/font/google";
import { MULTI_CHAIN_CONTRACT_TYPE } from "../../utils/type";

export const BOLD_INTER_TIGHT = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});
export const FIREBASE_CONNECT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
export const SWIPELUX_SETTING = {
  apiKey: '1d1fe8ad-a154-4dc0-a6bd-3fe8939ba7d0'
};
export const LAND_PRICE_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/81176/landshare-price/v0.1.0'
export const LANDPRICE_URL = 'http://159.203.181.148:5000/land_pricedata/'
export const LANDMARKET_URL = 'http://159.203.181.148:5000/land_market'
export const API_CONSUMER_CONTRACT_ADDRESS = '0x234fCeB8e266cc0843ea134f378f0157dB4d09dE' as Address
export const LP_TOKEN_V2_CONTRACT_ADDRESS = '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address
export const MASTERCHEF_CONTRACT_ADDRESS = '0x3f9458892fB114328Bc675E11e71ff10C847F93b' as Address
export const WBNB_TOKEN_CONTRACT_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as Address
export const BNB_APE_PAIR_CONTRACT_ADDRESS = '0x51e6D27FA57373d8d4C256231241053a70Cb1d93' as Address
export const PANCAKE_PAIR_CONTRACT_ADDRESS = '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address
export const RWA_CONTRACT_ADDRESS = '0x475eD67Bfc62B41c048b81310337c1D75D45aADd' as Address
export const AUTO_REDEEM_CONTRACT_ADDRESS = '0xcA45Cd5032327DE336363D65Dd3bf90901fd2C15' as Address
export const USDC_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
}
export const RWA_POOL_CONTRACT_ADDRESS = '0xB709b98D9999Cf8C6B49bDcB16F1cca84fe38bc3' as Address
export const LANDSHARE_SALE_CONTRACT_ADDRESS = '0x50ba4cEaF1b1B6FF0745Cc6fA4B7B7587D9cF9C4' as Address
