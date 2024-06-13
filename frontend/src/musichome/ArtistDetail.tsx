import { useQuery } from "react-query";
import { axiosSpotify } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Spinner from "react-bootstrap/Spinner";
import "../css/scroll.css";
import { ChartData } from "../redux/type";

interface LocationState {
  artist: {
    visuals: {
      avatar: {
        url: string;
        width: number | null;
        height: number | null;
      }[];
    };
    name: string;
  };
}

export const ArtistDetial = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const artistId = searchParams.get("artistId");
  const { artist } = location.state as LocationState;
  const goBack = () => {
    navigate(-1);
  };

  //Artist Album 조회
  const getArtistAlbum = async () => {
    const res = await axiosSpotify.get(`/artists/${artistId}/top-tracks`);
    return res.data;
  };

  const goPlayMusic = async (track: any) => {
    navigate("/playMusic", {
      state: {
        track,
      },
    });
  };

  const { data: artistAlbum, isLoading: artistAlbumLoading } =
    useQuery<ChartData>(["artistAlbum", artistId], () => getArtistAlbum(), {
      staleTime: 10800000, //캐싱기간 3시간 설정
    });

  if (artistAlbumLoading) {
    return (
      <div className="flex justify-center w-full h-screen">
        <div className="flex flex-col justify-center items-center w-full bg-black sm:max-w-[450px] h-full px-3 py-4">
          <Spinner animation="border" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-screen font-[roboto]">
      <div className="flex flex-col items-center w-full bg-black  sm:max-w-[450px]  px-3 py-4">
        {/* Artist 커버 이미지, 이름*/}
        <div className="flex flex-col items-center justify-center w-full ">
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-start w-full px-5 mb-4 ">
              <IoIosArrowRoundBack
                onClick={goBack}
                className="w-10 h-10 fill-white hover:fill-gray-500"
              />
            </div>

            <img
              src={artist.visuals.avatar[0].url}
              className="sm:w-[58%] sm:h-[200px] rounded-md "
              alt="Artist Cover"
            />
            <div className="w-[21%] "></div>
          </div>

          <span className="font-bold text-[white] text-3xl mt-4">
            {artist.name}
          </span>
        </div>

        {/* Artist 앨범 목록 */}
        <div className="mt-12 overflow-y-auto scrollbar">
          {artistAlbum?.tracks
            .filter((track) => track.is_playable)
            .map((track, index) => (
              <div
                onClick={() => goPlayMusic(track)}
                key={track.id}
                className="flex items-center mb-4 hover:opacity-60"
              >
                <img
                  className="w-[70px] h-[70px] rounded-md"
                  src={track.album.images[2].url}
                  alt="Album Cover"
                />
                <div className="flex flex-col ml-3">
                  <span className="text-[white] font-semibold">
                    {track.name}
                  </span>
                  <span className="text-[gray] font-semibold">
                    {artist.name} {Math.floor(track.duration_ms / 1000 / 60)}:
                    {Math.floor((track.duration_ms / 1000) % 60) < 10
                      ? `0${Math.floor((track.duration_ms / 1000) % 60)}`
                      : Math.floor((track.duration_ms / 1000) % 60)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
