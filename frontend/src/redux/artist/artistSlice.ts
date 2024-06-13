import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArtistData } from "../type";

const initialState: { artistData: ArtistData } = {
  artistData: { artists: [] },
};

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtistData: (state, action: PayloadAction<ArtistData>) => {
      return { ...state, artistData: action.payload };
    },
  },
});
export const { setArtistData } = artistSlice.actions;
export default artistSlice.reducer;
