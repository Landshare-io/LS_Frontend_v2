import { useReadContract } from "wagmi";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../createAppSlice";
import type { AppThunk } from "../../store";

const initialState = {
  status: 'idle',
  getTotalValue: 0
};

// Define a service using a base URL and expected endpoints
export const apiConsumerContractSlice = createAppSlice({
  name: "ApiConsumerContract",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    getTotalValueAsync: create.asyncThunk(
      async () => {
        return 0
      },
      {
        pending: (state) => {
          state.status = "loading";
          return state;
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.getTotalValue = action?.payload ?? 0;
          return state;
        },
        rejected: (state) => {
          state.status = "failed";
          return state;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
  },
});

// Action creators are generated for each case reducer function.
export const { getTotalValueAsync } =
  apiConsumerContractSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {  } = apiConsumerContractSlice.selectors;

