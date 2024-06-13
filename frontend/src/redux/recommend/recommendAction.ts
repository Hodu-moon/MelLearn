import { axiosSpotify, axiosSpotifyScraper } from "../../api";
import { RecommendData } from "../type";

export const fetchRecommendData = async (
  langType: string | undefined
): Promise<RecommendData> => {
  if (langType === "en") {
    langType = "us";
  } else if (langType === "ja") {
    langType = "jp";
  }
  const res = await axiosSpotifyScraper.get(
    `/chart/tracks/viral?region=${langType}`
  );

  const trackIds = res.data.tracks.slice(0, 50).map((track: any) => track.id);
  const trackIdsString = trackIds.join(",");
  const trackReq = axiosSpotify.get(`/tracks?ids=${trackIdsString}`);
  // const trackReq = trackIds.map((id: string) =>
  //   axiosSpotify.get(`/tracks/${id}`)
  // );

  const responses = await trackReq;

  const tracks = responses.data;

  const playableTracks = tracks.tracks.filter(
    (track: any) => track.preview_url !== null
  );

  return { recommends: playableTracks };
};
