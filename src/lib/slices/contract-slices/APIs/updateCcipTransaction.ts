import axios from "axios"

export const updateCcipTransaction = async (data: any) => {
  const { data: transactionData } = await axios.post('/ccip-transaction', data)

  return transactionData
}