import { collection, query, getDocs } from "firebase/firestore/lite";
import { db } from "../../../utils/firebase";
import { createAppSlice } from "../../createAppSlice";

const initialState = {
  loading: true,
  propertiesRentalData: [],
  grossRentPerMonth: 0,
  monthlyExpenses: 0,
  taxes: 0,
  insurance: 0,
  management: 0,
  capRate: 0,
  appreciation: 0,
  netRentalPerMonth: 0
};

// Define a service using a base URL and expected endpoints
export const firebasePropertiesRentalSlice = createAppSlice({
  name: "FirebasePropertiesRental",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    getData: create.asyncThunk(
      async () => {
        const docRef = collection(db, "properties-rental");
        const docQuery = query(docRef);
        const docSnapshots = await getDocs(docQuery);
        const data = docSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        let grossRentPerMonth = 0;
        let monthlyExpenses = 0;
        let taxes = 0;
        let insurance = 0;
        let management = 0;
        let capRate = 0;
        let appreciation = 0;
        let netRentalPerMonth = 0;

        data.forEach((x: any) => {
          grossRentPerMonth += x.grossRent
          monthlyExpenses += x.insurance + x.tax + x.grossRent * x.management / 12
          taxes += x.tax
          insurance += x.insurance
          management += x.management * x.grossRent
          capRate += (x.grossRent * (1 - x.management) * 12 - x.insurance - x.tax) / x.value * 100
          appreciation += x.appreciation * x.value
          netRentalPerMonth += x.grossRent - (x.insurance + x.tax + x.management * x.grossRent * 12) / 12
        })

        return {
          propertiesRentalData: data,
          grossRentPerMonth,
          monthlyExpenses,
          taxes,
          insurance,
          management,
          capRate,
          appreciation,
          netRentalPerMonth
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.propertiesRentalData = action.payload?.propertiesRentalData as never[];
          state.grossRentPerMonth = action?.payload?.grossRentPerMonth ?? 0;
          state.monthlyExpenses = action?.payload?.monthlyExpenses ?? 0;
          state.taxes = action?.payload?.taxes ?? 0;
          state.insurance = action?.payload?.insurance ?? 0;
          state.management = action?.payload?.management ?? 0;
          state.capRate = action?.payload?.capRate ?? 0;
          state.appreciation = action?.payload?.appreciation ?? 0;
          state.netRentalPerMonth = action?.payload?.netRentalPerMonth ?? 0;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectPropertiesRentalData: (action) => action.propertiesRentalData,
    selectLoadingStatus: (action) => action.loading,
    selectGrossRentPerMonth: (action) => action.grossRentPerMonth,
    selectMonthlyExpenses: (action) => action.monthlyExpenses,
    selectTaxes: (action) => action.taxes,
    selectInsurance: (action) => action.insurance,
    selectManagement: (action) => action.management,
    selectCapRate: (action) => action.capRate,
    selectAppreciation: (action) => action.appreciation,
    selectNetRentalPerMonth: (action) => action.netRentalPerMonth
  },
});

// Action creators are generated for each case reducer function.
export const { getData } =
firebasePropertiesRentalSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { 
  selectLoadingStatus,
  selectGrossRentPerMonth,
  selectMonthlyExpenses,
  selectTaxes,
  selectInsurance,
  selectManagement,
  selectCapRate,
  selectAppreciation,
  selectNetRentalPerMonth,
  selectPropertiesRentalData
} = firebasePropertiesRentalSlice.selectors;

