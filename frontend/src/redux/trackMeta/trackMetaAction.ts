import { axiosSpotify } from "../../api";
import { TrackMetaData } from "../type";

export const fetchMetaData = async (
  trackId: string
): Promise<TrackMetaData> => {
  const res = await axiosSpotify.get(`/audio-features/${trackId}`);
  return res.data;
};
