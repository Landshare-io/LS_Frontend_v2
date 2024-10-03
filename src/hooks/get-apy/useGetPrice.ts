import { BigNumberish, formatEther } from "ethers";
import useGetReserves from "../../hooks/contract/BNBApePairContract/useGetReserves";
import useGetReservesPair from "../../hooks/contract/LpTokenV2Contract/useGetReserves";

export default function useGetPrice() {
  const reservesBNB = useGetReserves() as BigNumberish[];
  const resercesToken = useGetReservesPair() as BigNumberish[];

  const bnbPrice = reservesBNB ? Number(formatEther(reservesBNB[1])) / Number(formatEther(reservesBNB[0])) : 0;
  const coinPrice = resercesToken ? Number(formatEther(resercesToken[1])) / Number(formatEther(resercesToken[0])) : 0;
  const price = coinPrice * bnbPrice

  return {
    bnbPrice,
    coinPrice,
    price
  }
}
