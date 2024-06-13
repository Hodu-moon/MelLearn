import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecordState {
  recordedBlobUrl: string | null;
}

const initialState: RecordState = {
  recordedBlobUrl: null,
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    setRecordBlobUrl: (state, action: PayloadAction<string>) => {
      state.recordedBlobUrl = action.payload;
    },
  },
});

export const { setRecordBlobUrl } = recordSlice.actions;
export default recordSlice.reducer;
