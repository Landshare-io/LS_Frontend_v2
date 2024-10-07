import useGetApr from './useGetApr';

export default function useGetApy(chainId: number) {
  const apr = useGetApr(chainId);
  const apy = ((1 + (Number(apr) / 100 / 365) * 0.98) ** 365 - 1) * 100;

  return apy
}
