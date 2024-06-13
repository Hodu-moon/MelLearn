import React from "react";
import { axiosSpotify } from "../api";
import { LyricData } from "../redux/type";
import Spinner from "react-bootstrap/Spinner";
import "../css/scroll.css";
import { IoIosArrowDown } from "react-icons/io";

interface LyricProps {
  trackId: string;
  isLyric: boolean;
  setIsLyric: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  lyricClick: boolean;
  lyricData: LyricData[];
  lyricLoading: boolean;
}

function Lyric(props: LyricProps) {
  const {
    trackId,
    isLyric,
    setIsLyric,
    currentTime,
    lyricClick,
    setCurrentTime,
    lyricData,
    lyricLoading,
  } = props;
  // const getFetchLyric = async () => {
  //   const res = await axiosSpotifyScraper.get(
  //     `/track/lyrics?trackId=${trackId}&format=json`
  //   );
  //   return res.data;
  // };
  // const { data: lyricData, isLoading: lyricLoading } = useQuery<
  //   LyricData[],
  //   Error
  // >(["lyric", trackId], getFetchLyric, {
  //   staleTime: 10800000,
  // });

  const lyricTimeline = async (progressMs: number) => {
    if (lyricClick) {
      setCurrentTime(progressMs);
      const res = await axiosSpotify.put("/me/player/play", {
        uris: ["spotify:track:" + trackId],
        position_ms: progressMs,
      });
    }
  };

  if (lyricLoading) {
    return (
      <div className="flex justify-center w-full h-screen">
        <div className="flex flex-col justify-center items-center w-full bg-black max-w-[450px] h-full px-3 py-4">
          <Spinner animation="border" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-black max-w-[450px] mx-auto px-4 py-4 h-screen 
        opacity-85"
    >
      <IoIosArrowDown
        onClick={() => setIsLyric(false)}
        className="fill-[white] hover:opacity-60 w-8 h-8 mb-4"
      />
      <div className="scrollbar flex flex-col items-start w-full max-w-[450px]   py-2 overflow-y-auto h-screen">
        {lyricData?.map((lyric, index) => (
          <div key={index}>
            <p
              onClick={() => lyricTimeline(lyric.startMs)}
              className={`text-${
                currentTime >= lyric.startMs &&
                currentTime <= lyric.startMs + lyric.durMs
                  ? "white"
                  : "#B3B3B3"
              } hover:text-[white] text-2xl font-semibold`}
            >
              {lyric.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lyric;
