import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChartData } from "../type";

const initialState: { chartData: ChartData } = {
  chartData: { tracks: [] },
};

const charSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setChartData: (state, action: PayloadAction<ChartData>) => {
      return { ...state, chartData: action.payload };
    },
  },
});
export const { setChartData } = charSlice.actions;
export default charSlice.reducer;
