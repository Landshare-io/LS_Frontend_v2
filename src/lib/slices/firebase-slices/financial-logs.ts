import { collection, query, getDocs } from "firebase/firestore/lite";
import { db } from "../../../utils/firebase";
import { createAppSlice } from "../../createAppSlice";

const initialState = {
  loading: true,
  financialLogs: []
};

// Define a service using a base URL and expected endpoints
export const firebaseFinancialLogsSlice = createAppSlice({
  name: "FirebaseFinancialLogs",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    getData: create.asyncThunk(
      async () => {
        const docRef = collection(db, "financeLogs");
        const docQuery = query(docRef);
        const docSnapshots = await getDocs(docQuery);
        const data = docSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const sortedData = data.sort((a: any, b: any) => b.datetime - a.datetime);

        return {
          financialLogs: sortedData
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          return state;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.financialLogs = action.payload?.financialLogs as never[];
          return state;
        },
        rejected: (state) => {
          state.loading = false;
          return state;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectFinancialLogs: (action) => action.financialLogs,
    selectLoadingStatus: (action) => action.loading,
  },
});

// Action creators are generated for each case reducer function.
export const { getData } =
firebaseFinancialLogsSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { 
  selectLoadingStatus,
  selectFinancialLogs
} = firebaseFinancialLogsSlice.selectors;

