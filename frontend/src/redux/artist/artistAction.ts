import { ArtistData } from "../type";
import { axiosSpotify, axiosSpotifyScraper } from "../../api";

export const fetchArtistData = async (
  langType: string | undefined
): Promise<ArtistData> => {
  if (langType === "en") {
    langType = "us";
  } else if (langType === "ja") {
    langType = "jp";
  }
  const res = await axiosSpotifyScraper.get(
    `/chart/artists/top?region=${langType}`
  );
  return res.data;
  // const artistIds = res.data.artists
  //   .slice(0, 50)
  //   .map((artist: any) => artist.id);
  // const artistReq = artistIds.map((id: string) =>
  //   axiosSpotify.get(`/artist/${id}/top-tracks`)
  // );
  // const responses = await Promise.all(artistReq);
  // const artists = responses.map((res) => res.data.tracks);
  // const playableArtists = artists.filter((artist) => {
  //   const playableAlbumCount = artist.filter(
  //     (album: any) => album.is_playable
  //   ).length;

  //   return playableAlbumCount >= 5;
  // });

  // return { artists: playableArtists };
};
