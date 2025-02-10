import { createAppSlice } from "../../createAppSlice";

export interface vaultLoadingState {
    isManualLoading: boolean;
    isAutoLoading: boolean;
    lpLoading: boolean;
    usdtLoading: boolean;
}

const initialState: vaultLoadingState = {
  isManualLoading: true,
  isAutoLoading: true,
  lpLoading: true,
  usdtLoading: true
};

export const vaultLoadingSlice = createAppSlice({
    name: "vault-loading",
    initialState,
    reducers: {
        setAutoLoading: (state, action) => {
            state.isAutoLoading = action.payload;
        },
        setManualLoading: (state, action) => {
            state.isManualLoading = action.payload;
        },
        setLpLoading: (state, action) => {
            state.isManualLoading = action.payload;
        },
        setUsdtLoading: (state, action) => {
            state.isManualLoading = action.payload;
        }
    },
    selectors: {
        selectAutoLoading: (state) => state.isAutoLoading,
        selectManualLoading: (state) => state.isManualLoading,
        selectLpLoading: (state) => state.isManualLoading,
        selectUsdtLoading: (state) => state.isManualLoading,
        selectLoading: (state) => state.isAutoLoading || state.isManualLoading || state.lpLoading || state.usdtLoading
    },
});

export const {
    setAutoLoading,
    setManualLoading,
    setLpLoading,
    setUsdtLoading
} = vaultLoadingSlice.actions;

export const { 
    selectAutoLoading,
    selectManualLoading,
    selectLpLoading,
    selectUsdtLoading,
    selectLoading
} = vaultLoadingSlice.selectors;
