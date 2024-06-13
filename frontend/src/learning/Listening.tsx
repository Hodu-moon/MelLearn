import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BgCircle from "../components/BgCircle";
import "../css/scroll.css";
import { FaPause, FaPlay } from "react-icons/fa6";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import { IoIosArrowRoundBack } from "react-icons/io";

interface TimeLyric {
  startMs: number;
  durMs: number;
}

const Listening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, track, quiz } = location.state;
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<string>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();

  const [timeLyric, setTimeLyric] = useState<TimeLyric[]>([]);

  const [userAnswers, setUserAnswers] = useState(
    Array(quiz.answerList.length).fill("")
  );
  const getFetchTimeLyric = async () => {
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    setTimeLyric(res.data);
  };
  useEffect(() => {
    getFetchTimeLyric();

    setLyrics(quiz.blankedText);
    setDuration(track.duration_ms);
  }, []);

  useEffect(() => {
    if (currentTime >= duration) {
      clearInterval(intervalId);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentTime, duration]);

  const startTime = () => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1000);
    }, 1000);
    setIntervalId(interval);
  };
  const stopTime = () => {
    clearInterval(intervalId);
  };

  const handleAnswerChange = (index: any, event: any) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers(newAnswers);
  };
  //const [idx, setIdx] = useState(0);

  const resume = async () => {
    startTime();
    const res = await axiosSpotify.get("/me/player/currently-playing");
    let progress_ms = 0;
    if (res.data.item === undefined) {
      progress_ms = 0;
    } else {
      if (track.id === res.data.item.id) {
        progress_ms = res.data.progress_ms;
      } else {
        progress_ms = 0;
      }
    }
    const res2 = await axiosSpotify.put("/me/player/play", {
      uris: ["spotify:track:" + track.id],
      position_ms: progress_ms,
    });

    if (res2.status === 202) {
      setIsPlaying(true);
    }
  };
  const pause = async () => {
    stopTime();
    const res = await axiosSpotify.put("/me/player/pause");
    if (res.status === 202) {
      setIsPlaying(false);
    }
  };

  const submitAnswer = async () => {
    const res = await axiosApi.post(`/api/quiz/submit/${category}`, {
      musicId: track.id,
      submitWordList: userAnswers,
    });
    if (res.status === 200) {
      navigate("/lsScore", {
        state: {
          comments: res.data,
        },
      });
    }
  };

  const handleSelect = (e: any) => {};
  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto] ">
      <div className="bg-[#9bd1e5] overflow-hidden w-full sm:max-w-[450px] h-full relative flex flex-col px-8 items-center">
        <BgCircle />
        <div className="z-10 flex justify-start w-full mt-4 hover:opacity-60 h-[5%]">
          <IoIosArrowRoundBack
            onClick={() => navigate(-1)}
            className="w-8 h-10"
          />
        </div>
        <div className="z-10 flex items-center w-[40%] sm:w-full mt-2 mb-4 bg-white rounded-2xl shadow-[0px_4px_4px_#00000040] sm:h-[20%] h-[15%] px-2 justify-between">
          <div className="flex items-center">
            <img
              src={track.album.images[2].url}
              alt="Album Cover"
              className="w-16 h-16 sm:w-12 sm:h-12 rounded-xl"
            />
            <div className="flex flex-col ml-4">
              <span className="text-lg font-bold whitespace-nowrap sm:text-md">
                {track.name}
              </span>
              <span className="text-sm font-semibold text-gray-500">
                {track.artists[0].name}
              </span>
            </div>
          </div>
          <div className="hover:opacity-50">
            {isPlaying ? (
              <FaPause onClick={pause} className="w-8 h-8 sm:w-6 sm:h-6" />
            ) : (
              <FaPlay onClick={resume} className="w-8 h-8 sm:w-6 sm:h-6" />
            )}
          </div>
        </div>
        <div className="rounded-3xl sm:w-full w-[40%]  bg-white z-10 font-bold text-black text-2xl leading-[normal] whitespace-normal  overflow-y-auto scrollbarwhite px-4 py-2 shadow-[0px_4px_4px_#00000040]">
          {timeLyric &&
            lyrics?.split("__")?.map((lyric: string, index: number) => (
              <span
                key={index}
                className="text-xl"
                // className={`text-[${
                //   currentTime >= timeLyric[index]?.startMs &&
                //   currentTime <=
                //     timeLyric[index]?.startMs + timeLyric[index]?.durMs
                //     ? "gray"
                //     : "black"
                // }] hover:text-[gray] text-2xl font-semibold`}
              >
                {lyric}
                {index !== lyrics.split("__").length - 1 && (
                  <input
                    onSelect={handleSelect}
                    type="text"
                    onChange={(event) => handleAnswerChange(index, event)}
                    value={userAnswers[index] || ""}
                    className="h-5 text-lg text-center text-blue-500 bg-white rounded-md w-28 border-gray"
                  />
                )}
              </span>
            ))}
        </div>

        <div className="flex justify-center sm:w-[50%] w-[20%] h-24 sm:h-20 mt-12 mb-4">
          <button
            onClick={submitAnswer}
            className="z-10  bg-[#007AFF] text-white font-bold w-full rounded-lg hover:opacity-60 "
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listening;
