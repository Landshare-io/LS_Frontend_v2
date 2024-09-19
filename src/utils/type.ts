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
