import { createSlice } from "@reduxjs/toolkit";
import { RecommendData } from "../type";

const initialState: { recommendData: RecommendData } = {
  recommendData: { recommends: [] },
};

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {
    setRecommendData: (state, action: { payload: RecommendData }) => {
      return { ...state, recommendData: action.payload };
    },
  },
});
export const { setRecommendData } = recommendSlice.actions;
export default recommendSlice.reducer;
