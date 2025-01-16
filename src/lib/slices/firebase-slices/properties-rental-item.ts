import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../../utils/firebase";
import { createAppSlice } from "../../createAppSlice";

const initialState = {
  loading: true,
  propertyRentalData: {}
};

// Define a service using a base URL and expected endpoints
export const firebasePropertyRentalSlice = createAppSlice({
  name: "FirebasePropertyRental",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    getData: create.asyncThunk(
      async (itemId: string) => {
        const docRef = doc(db, "properties-rental", itemId);
        const docSnapshots = await getDoc(docRef);
        const data = docSnapshots.data()

        return {
          propertyRentalData: data
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          return state;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.propertyRentalData = action.payload?.propertyRentalData as never[];
          return state
        },
        rejected: (state) => {
          state.loading = false;
          return state
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectPropertyRentalData: (action) => action.propertyRentalData,
    selectIsLoading: (action) => action.loading
  },
});

// Action creators are generated for each case reducer function.
export const { getData } = firebasePropertyRentalSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { 
  selectPropertyRentalData,
  selectIsLoading
} = firebasePropertyRentalSlice.selectors;

