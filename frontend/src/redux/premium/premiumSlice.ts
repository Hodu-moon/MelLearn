import { createSlice } from "@reduxjs/toolkit";

interface PremiumState {
  premium: boolean;
}
const initialState: PremiumState = {
  premium: true,
};

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremium: (state, action) => {
      state.premium = action.payload;
    },
  },
});

export const { setPremium } = premiumSlice.actions;
export default premiumSlice.reducer;
