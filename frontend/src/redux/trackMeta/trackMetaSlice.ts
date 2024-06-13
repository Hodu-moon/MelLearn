import { TrackMetaData } from "../type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { trackMetaData: TrackMetaData } = {
  trackMetaData: {
    id: "",
    duration_ms: 0,
  },
};

const trackMetaSlice = createSlice({
  name: "trackMeta",
  initialState,
  reducers: {
    setTrackMetaData: (state, action: PayloadAction<TrackMetaData>) => {
      state.trackMetaData = action.payload;
    },
  },
});

export const { setTrackMetaData } = trackMetaSlice.actions;
export default trackMetaSlice.reducer;
