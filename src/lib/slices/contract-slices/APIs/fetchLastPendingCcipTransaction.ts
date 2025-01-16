import { Address } from "viem";
import { CCIP_BACKEND_URL } from "../../../../config/constants/environments";


export const fetchLastPendingCcipTransaction = async (address: Address) => {
  const response = await fetch(`${CCIP_BACKEND_URL}/ccip-transaction/get-last-pending-tx/${address}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  return data;
};
