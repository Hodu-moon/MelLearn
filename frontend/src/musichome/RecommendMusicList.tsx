import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../css/scroll.css";

export const RecommendMusicList = (): JSX.Element => {
  const { recommendData } = useSelector((state: RootState) => state.recommend);
  const navigation = useNavigate();

  const goHome = () => {
    navigation("/home");
  };
  const goPlayMusic = (track: any) => {
    navigation("/playMusic", {
      state: {
        track,
      },
    });
  };

  return (
    <div className="flex justify-center w-full h-screen font-[roboto]">
      <div className="flex  flex-col items-center w-full  bg-black sm:max-w-[450px]  p-3">
        <div className="flex items-center justify-between w-full py-2 mb-3">
          <div className="w-[33%] h-10 flex justify-start items-center ">
            <IoIosArrowRoundBack
              onClick={goHome}
              className="w-12 h-12 fill-white hover:fill-gray-500"
            />
          </div>
          <div className="w-[33%]  flex justify-center">
            <span className="text-lg font-bold text-center text-white whitespace-nowrap">
              추천 음악 목록
            </span>
          </div>
          <div className="w-[33%]"></div>
        </div>

        <div className="grid w-full grid-cols-5 gap-4 px-3 overflow-y-auto sm:grid-cols-3 scrollbar">
          {recommendData.recommends.slice(0, 30).map((track, index) => (
            <div
              key={index}
              className="flex flex-col items-start hover:opacity-60"
              onClick={() => goPlayMusic(track)}
            >
              <img
                alt="Artist Cover"
                src={track.album.images[0].url}
                className="w-40 rounded-md h-30 "
              />
              <span className="text-[white] font-bold mt-2 overflow-hidden overflow-ellipsis ">
                {track.name}
              </span>
              <span className="text-bold text-[gray] text-[12px]">
                {track.artists[0].name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
