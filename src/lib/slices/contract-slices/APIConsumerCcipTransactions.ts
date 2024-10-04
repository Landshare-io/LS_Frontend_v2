import { Address } from "viem";
import { createAppSlice } from "../../createAppSlice";
import { fetchCcipTransactionsCount } from "./APIs/fetchCcipTransactionsCount";
import { fetchPendingCcipTransactions } from "./APIs/fetchPendingCcipTransactions";
import { fetchLastPendingCcipTransaction } from "./APIs/fetchLastPendingCcipTransaction";
import { updateCcipTransaction as updateTransaction } from "./APIs/updateCcipTransaction";


export interface CCIPTransactionSliceState {
  ccipTransactions: number;
  ccipPendingTransactions: number;
  lastPendingCcipTransaction: any;
  coolDownTime: number
  isLoading: boolean;
}

const initialState: CCIPTransactionSliceState = {
  ccipTransactions: 0,
  ccipPendingTransactions: 0,
  lastPendingCcipTransaction: {},
  coolDownTime: 0,
  isLoading: false,
};

export const APIConsumerCcipTransactionsSlice = createAppSlice({
  name: "ccip-transaction",
  initialState,
  reducers: (create) => ({
    getTransactions: create.asyncThunk(
      async (address: Address | undefined) => {
        if (typeof address == 'undefined') return {
          coolDownTime: 0,
          ccipTransactions: 0,
          ccipPendingTransactions: 0,
          lastPendingCcipTransaction: {}
        }

        const ccipTransactions = await fetchCcipTransactionsCount(address) as number;
        const ccipPendingTransactions = await fetchPendingCcipTransactions(address) as number;
        const lastPendingCcipTransaction = await fetchLastPendingCcipTransaction(address) as any;
        const coolDownTime = new Date(lastPendingCcipTransaction.createDateTime).getTime() + lastPendingCcipTransaction.estimateTime - new Date().getTime()

        return {
          coolDownTime,
          ccipTransactions,
          ccipPendingTransactions,
          lastPendingCcipTransaction
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.coolDownTime = action.payload.coolDownTime;
          state.ccipTransactions = action.payload.ccipTransactions;
          state.ccipPendingTransactions = action.payload.ccipPendingTransactions;
          state.lastPendingCcipTransaction = action.payload.lastPendingCcipTransaction;
        },
        rejected: (state) => {
          state.isLoading = false;
        },
      },
    ),
    updateCcipTransaction: create.asyncThunk(
      async (data: any) => {
        const transactionData = await updateTransaction(data)
        const lastPendingCcipTransaction = await fetchLastPendingCcipTransaction(data.walletAddress) as any;
        const coolDownTime = new Date(lastPendingCcipTransaction.createDateTime).getTime() + lastPendingCcipTransaction.estimateTime - new Date().getTime()

        return {
          lastPendingCcipTransaction: transactionData,
          coolDownTime
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.coolDownTime = action.payload.coolDownTime;
          state.ccipTransactions = state.ccipTransactions + 1;
          state.ccipPendingTransactions = state.ccipPendingTransactions + 1;
          state.lastPendingCcipTransaction = action.payload.lastPendingCcipTransaction;
        },
        rejected: (state) => {
          state.isLoading = false;
        },
      },
    )
  }),
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectCoolDownTime: (state) => state.coolDownTime,
    selectCcipTransactionCounts: (state) => state.ccipTransactions,
    selectCcipPendingTransactions: (state) => state.ccipPendingTransactions,
    selectLastPendingCcipTransaction: (state) => state.lastPendingCcipTransaction,
  },
});

export const { getTransactions, updateCcipTransaction } =
APIConsumerCcipTransactionsSlice.actions;

export const { 
  selectIsLoading,
  selectCoolDownTime,
  selectCcipTransactionCounts, 
  selectCcipPendingTransactions, 
  selectLastPendingCcipTransaction 
} = APIConsumerCcipTransactionsSlice.selectors;
