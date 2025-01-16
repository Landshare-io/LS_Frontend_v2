import axios from "axios"
import { CCIP_BACKEND_URL } from "../../../../config/constants/environments"
import { Address } from "viem"

export const updateCcipTransaction = async (data: any) => {
  const { data: transactionData } = await axios.post(`${CCIP_BACKEND_URL}/ccip-transaction`, data)

  return transactionData
}

export const getCcipTransactions = async (address: Address | undefined, newOffset: number, itemsPerPage: number) => {
  if (typeof address == "undefined") return
  const { data } = await axios.get(`${CCIP_BACKEND_URL}/ccip-transaction/all/${address}?skip=${newOffset}&take=${itemsPerPage}`)

  return data
}
