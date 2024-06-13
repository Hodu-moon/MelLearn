import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "../css/scroll.css";

interface Artist {
  id: string;
  type: string;
  name: string;
  shareUrl: string;
  visuals: {
    avatar: {
      url: string;
      width: number | null;
      height: number | null;
    }[];
  };
}

export const PoplularArtistList = (): JSX.Element => {
  const { artistData } = useSelector((state: RootState) => state.artist);
  const navigation = useNavigate();

  const goHome = () => {
    navigation(-1);
  };
  const goDetailArtist = (artist: Artist) => {
    navigation(`/artistDetail?artistId=${artist.id}`, {
      state: { artist },
    });
  };

  return (
    <div className="flex justify-center w-full h-screen font-[roboto]">
      <div className="flex  flex-col items-center w-full  bg-black sm:max-w-[450px]  p-3 ">
        <div className="flex items-center justify-between w-full py-2 mb-3">
          <div className="w-[33%] h-10 flex justify-start items-center ">
            <IoIosArrowRoundBack
              onClick={goHome}
              className="w-12 h-12 fill-white hover:fill-gray-500"
            />
          </div>
          <div className="w-[33%]  flex justify-center">
            <span className="text-lg font-bold text-center text-white whitespace-nowrap">
              인기 가수 목록
            </span>
          </div>
          <div className="w-[33%]"></div>
        </div>

        <div className="grid w-full h-full grid-cols-6 gap-4 py-4 overflow-y-auto sm:gap-4 sm:grid-cols-3 scrollbar">
          {artistData.artists.slice(0, 21).map((artist, index) => (
            <div
              key={index}
              className="flex flex-col items-center hover:opacity-60"
              onClick={() => goDetailArtist(artist)}
            >
              <img
                alt="Artist Cover"
                src={artist.visuals.avatar[0].url}
                className="w-[110px] h-[110px] rounded-full hover:opacity-70"
              />
              <span className="text-[white] font-bold mt-2">{artist.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
