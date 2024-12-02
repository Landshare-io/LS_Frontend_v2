import type { Address } from "viem";

export type StringKeyStringValueObject = {
  [key: string]: string;
};

export type PAGE = {
  name: string
  path?: string
  url?: string
}

export type DASHBOARD_FEATURE = {
  icon: any
  darkIcon: any
  title: string
  description: string
  routeName?: string
  externalLink?: string
}

export type PROPERTY = {
  preview: any
  title: string
  type: string
  propertyValue: string
  capRate: string
  annReturn: string
}

export type BREADCRUMB = {
  name: string
  url: string
}

export type MULTI_CHAIN_CONTRACT_TYPE = {
  [key: number]: Address
}

export type TOKEN_TYPE = {
  icon: any
  symbol: string
}

export interface leaderboardDataProps {
  rank: number;
  account: string;
  total_amount: number;
  referred_users: number;
  referred_volume: number;
}

export type PremiumNftType = "Porcelain Tile" | "Pool Table" | "Marble Countertops"
