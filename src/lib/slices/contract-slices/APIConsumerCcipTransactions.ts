import { Address } from "viem";
import { createAppSlice } from "../../createAppSlice";
import type { AppThunk } from "../../store";
import { fetchCcipTransactionsCount } from "./APIs/fetchCcipTransactionsCount";
import { fetchPendingCcipTransactions } from "./APIs/fetchPendingCcipTransactions";
import { fetchLastPendingCcipTransaction } from "./APIs/fetchLastPendingCcipTransaction";


export interface CCIPTransactionSliceState {
  ccipTransactions: number;
  ccipPendingTransactions: any[];
  lastPendingCcipTransaction: any;
  status: "idle" | "loading" | "failed";
}

const initialState: CCIPTransactionSliceState = {
  ccipTransactions: 0,
  ccipPendingTransactions: [],
  lastPendingCcipTransaction: {},
  status: "idle",
};

export const APIConsumerCcipTransactionsSlice = createAppSlice({
  name: "counter",
  initialState,
  reducers: (create) => ({
    getTransactions: create.asyncThunk(
      async (address: Address) => {
        const ccipTransactions = await fetchCcipTransactionsCount(address) as number;
        const ccipPendingTransactions = await fetchPendingCcipTransactions(address) as any[];
        const lastPendingCcipTransaction = await fetchLastPendingCcipTransaction(address) as any;

        return {
          ccipTransactions,
          ccipPendingTransactions,
          lastPendingCcipTransaction
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.ccipTransactions = action.payload.ccipTransactions;
          state.ccipPendingTransactions = action.payload.ccipPendingTransactions;
          state.lastPendingCcipTransaction = action.payload.lastPendingCcipTransaction;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),
  selectors: {
    selectStatus: (state) => state.status,
    selectCcipTransactionCounts: (state) => state.ccipTransactions,
    selectCcipPendingTransactions: (state) => state.ccipPendingTransactions,
    selectLastPendingCcipTransaction: (state) => state.lastPendingCcipTransaction,
  },
});

export const { getTransactions } =
APIConsumerCcipTransactionsSlice.actions;

export const { 
  selectCcipTransactionCounts, 
  selectStatus, 
  selectCcipPendingTransactions, 
  selectLastPendingCcipTransaction 
} = APIConsumerCcipTransactionsSlice.selectors;
