import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { APIConsumerCcipTransactionsSlice } from "./slices/contract-slices/APIConsumerCcipTransactions";
import { apiConsumerContractSlice } from "./slices/contract-slices/APIConsumerContractSlice";
import { firebasePropertiesRentalSlice } from "./slices/firebase-slices/properties-rental";
import { firebasePropertyRentalSlice } from "./slices/firebase-slices/properties-rental-item";
import { firebaseFinancialLogsSlice } from "./slices/firebase-slices/financial-logs";
import { vaultLoadingSlice } from "./slices/app-slices/vault-loading";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(
  apiConsumerContractSlice,
  firebasePropertiesRentalSlice,
  firebasePropertyRentalSlice,
  firebaseFinancialLogsSlice,
  APIConsumerCcipTransactionsSlice,
  vaultLoadingSlice,
);
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
