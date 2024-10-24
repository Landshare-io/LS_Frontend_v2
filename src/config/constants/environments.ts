import { getDefaultProvider } from "ethers";
import { bsc, bscTestnet } from "wagmi/chains";
import type { Address } from "viem";
import { Inter_Tight } from "next/font/google";
import { MULTI_CHAIN_CONTRACT_TYPE } from "../../utils/type";

export const IS_TEST_MODE = false
export const MAJOR_WORK_CHAIN = IS_TEST_MODE ? bscTestnet : bsc
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
export const PROVIDERS: {
  [key: number]: any
} = {
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
export const LAND_TOKEN_V1_CONTRACT_ADDRESS = "0x9D986A3f147212327Dd658F712d5264a73a1fdB0" as Address
export const LP_TOKEN_V1_CONTRACT_ADDRESS = "0x468CDe4aD48cbAfA3cDfb68Fd9f2c114DDfE6c08" as Address
export const PSC_ROUTER_CONTRACT_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E" as Address
export const TOKEN_MIGRATE_CONTRACT_ADDRESS = "0x99402838AEcf77ebA0dAdD060cA34fBBE5A493b0" as Address
export const AUTO_LAND_V1_CONTRACT_ADDRESS = "0x4EF4b3ADEc44f2754BFD809Bb53a97a167D94488" as Address
export const LAND_TOKEN_STAKE_V2_CONTRACT_ADDRESS = "0x165448D15C5C4a3629dDf83AF6dfD0A10ecd435a" as Address
export const LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS = "0xeDD10AD0335512338C029DbE2bec30A02A428f9E" as Address
export const AUTO_LAND_V2_CONTRACT_ADDRESS = "0x25925237C151CEc7E7F83cD2e9E9CD1b1814Dc75" as Address
export const AUTO_LAND_V3_CONTRACT_ADDRESS = "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3" as Address
export const LP_FARM_CONTRACT_ADDRESS = "0xDa4ec02C0e8089c9E1A341BB09bafc77F51622C8" as Address
export const LAND_TOKEN_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C',
  97: '0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9',
  1: '' as Address,
  11155111: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
  137: '0xC03E6ad83dE7C58c9166fF08D66B960d78e64105',
  80002: '0xcab0EF91Bee323d1A617c0a027eE753aFd6997E4',
  42161: '0x27Bc2757fAb0b8aB406016D1f71d8123452095d3',
  421614: '0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D'
}
export const SWIPELUX_SETTING = {
  apiKey: '1d1fe8ad-a154-4dc0-a6bd-3fe8939ba7d0'
};
export const NFT_GAME_BACKEND_URL = 'http://localhost:3001'
export const CCIP_BACKEND_URL = 'http://localhost:3002'
export const APOLLO_RWA_BUY_URL = "https://api.studio.thegraph.com/query/81176/landshare-rwa-buy/v0.1.0"
export const APOLLO_RWA_URL = "https://api.studio.thegraph.com/query/81176/landshare-rwa/v0.1.0"
export const LAND_PRICE_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/81176/landshare-price/v0.1.0'
export const LANDSHARE_COST_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=landshare&vs_currencies=usd'
export const LANDPRICE_URL = 'http://159.203.181.148:5000/land_pricedata/'
export const LANDMARKET_URL = 'http://159.203.181.148:5000/land_market'
export const LIVE_COIN_LIST_URL = 'https://api.livecoinwatch.com/coins/list'
export const LIVE_COIN_API_KEY= '95ce49d3-3e89-475d-b61e-6638a002b1fe'
export const ZERO_ID_WIDGET_API_KEY = '10000000-0000-0000-0000-7f9a2af16a1c'
export const ZERO_ID_WIDGET_VERIFIER_URL = 'https://landshare-zeroid-verdict.onrender.com/verdict'
export const ZERO_ID_WIDGET_ENV = 'zeroid'
export const ADMIN_WALLET_ADDRESS = ""
export const PREMIUM_NFT_CONTRACT_ADDRESS: Record<string, MULTI_CHAIN_CONTRACT_TYPE> = {
  "Porcelain Tile": {
    56: '0x7E96B1A21Cc702D495eD9c430A4B87CB1e163ab3' as Address,
    97: '' as Address
  },
  "Pool Table": {
    56: '0x422FCBc638E3f45E8b5555537A83AB59D9903716' as Address,
    97: '' as Address
  },
  "Marble Countertops": {
    56: '0x345E80D12b38E85E0CB205e54FA1A5853c1B91b7' as Address,
    97: '' as Address
  }
}
export const PORCELAIN_TILE_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x7E96B1A21Cc702D495eD9c430A4B87CB1e163ab3' as Address,
  97: '' as Address
}
export const POOL_TALBE_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x422FCBc638E3f45E8b5555537A83AB59D9903716' as Address,
  97: '' as Address
}
export const MARBLE_COUNTEROPS_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x345E80D12b38E85E0CB205e54FA1A5853c1B91b7' as Address,
  97: '' as Address
}
export const API_CONSUMER_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x234fCeB8e266cc0843ea134f378f0157dB4d09dE' as Address,
  97: '' as Address
}
export const LP_TOKEN_V2_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address,
  97: '' as Address
}
export const MASTERCHEF_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x3f9458892fB114328Bc675E11e71ff10C847F93b' as Address,
  97: '' as Address
}
export const WBNB_TOKEN_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as Address,
  97: '' as Address
}
export const BNB_APE_PAIR_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93' as Address,
  97: '' as Address
}
export const PANCAKE_PAIR_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x13F80c53b837622e899E1ac0021ED3D1775CAeFA' as Address,
  97: '' as Address
}
export const RWA_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x475eD67Bfc62B41c048b81310337c1D75D45aADd' as Address,
  97: '' as Address
}
export const RWA_LP_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x89bad177367736C186F7b41a9fba7b23474A1b35' as Address,
  97: '' as Address
}
export const AUTO_REDEEM_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0xcA45Cd5032327DE336363D65Dd3bf90901fd2C15' as Address,
  97: '' as Address
}
export const USDC_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  97: '' as Address
}
export const USDT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x55d398326f99059fF775485246999027B3197955',
  97: '' as Address
}
export const RWA_POOL_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0xB709b98D9999Cf8C6B49bDcB16F1cca84fe38bc3' as Address,
  97: '' as Address
}
export const LANDSHARE_SALE_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x50ba4cEaF1b1B6FF0745Cc6fA4B7B7587D9cF9C4' as Address,
  97: '' as Address
}
export const LANDSHARE_BUY_SALE_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x41Cd41C417854988638dBBBA7adA66deE627DC48' as Address,
  97: '' as Address
}
export const AUTO_VAULT_V3_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3' as Address,
  97: '' as Address
}
export const CCIP_CHAIN_SENDER_CONTRACT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '' as Address,
  97: '' as Address,
  1: '' as Address,
  11155111: '0xaCBd41a11B8FbE0549E3a4e57258d4aB745888F8',
  137: '0x4166286e9ad3be3E3647389795Be3bCf5d675Fb5',
  80002: '0x21b09f2606A724f8660D7690681826EaD509Ac02',
  42161: '0xed3165829122749D7bC3Ec4eE032D941366C1F48',
  421614: '0xb3933B182fE82b17Fa81649bFaF43E28FBEE0988'
}
export const DAO_TREASURY_ADDRESS = "0x28454a7Ec0eD4b3aAAA350a1D87304355643107f" as Address
export const MARKETING_TREASURY_ADDRESS = "0xee39392eCAc26a321D22bAfAE79b6e923a3ad413" as Address
export const REALITY_MODULE_ADDRESS = "0xfb934692b8Da0cd4d02F4dfDd8F619312eeC0D87" as Address
export const MULTISEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761" as Address

export const CCIP_CHAIN_ID: {
  [key: number]: string
} = {
  56: '11344663589394136015',
  97: '13264668187771770619',
  1: '',
  11155111: '16015286601757825753',
  137: '4051577828743386545',
  80002: '16281711391670634445',
  42161: '4949039107694359620',
  421614: '3478487238524512106'
}

export const CCIP_CHAIN_RECEIVER: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x8506Eb2e34e2162Bb584a03463E1D977eDeF06a4',
  97: '0xcf18991bc9d401264254090b7cBBDbfd70691c05',
  11155111: '0x7Fa336E9EB48A854b6Bbf022A3c7821304a96F24'
}

export const CCIP_CHAIN_VAULT_ADDRESS: MULTI_CHAIN_CONTRACT_TYPE = {
  56: '0x9B41c7De79fc267C464775F7D40DB401b78d2DfD',
  97: '0x94D8d6cF4E832f3E7Fdb244D8991a2Bf6FA5d1C7',
  1: '' as Address,
  11155111: '0x62f9384DA710533F0b9977078BFa2b238803758E',
  137: '' as Address,
  80002: '' as Address,
  42161: '' as Address
}

export const GAS_COSTS: {
  [key: number]: number
} = {
  42161: 0.0004,
  137: 2,
  421614: 0.0001,
  11155111: 0.1
}
