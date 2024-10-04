import axios from "axios"
import { CCIP_BACKEND_URL } from "../../../../config/constants/environments"

export const updateCcipTransaction = async (data: any) => {
  const { data: transactionData } = await axios.post(`${CCIP_BACKEND_URL}/ccip-transaction`, data)

  return transactionData
}