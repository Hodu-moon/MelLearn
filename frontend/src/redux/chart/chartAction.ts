import { ChartData } from "../type";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../../api";
interface Member {
  id: number;
  langType: string;
  level: string;
  levelPoint: number;
  memberId: string;
  name: string;
}
export const fetchChartData = async (
  langType: string | undefined
): Promise<ChartData> => {
  if (langType === "en") {
    langType = "us";
  } else if (langType === "ja") {
    langType = "jp";
  }

  const res = await axiosSpotifyScraper.get(
    `/chart/tracks/top?region=${langType}`
  );

  // track.playabe이 사라짐

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

  // const responses = await Promise.all(trackReq);

  // const tracks = responses.map((res) => res.data);

  // const playableTracks = tracks.filter((track) => track.preview_url !== null);

  return { tracks: playableTracks };
};
