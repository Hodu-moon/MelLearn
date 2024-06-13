import React, { useEffect, useState } from "react";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { IoIosArrowRoundBack, IoIosArrowUp } from "react-icons/io";
import { LuPencilLine } from "react-icons/lu";
import Lyric from "./Lyric";
import { useQuery } from "react-query";
import { LyricData } from "../redux/type";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "../css/scroll.css";
import MenuBook from "@mui/icons-material/MenuBook";

export interface CurrentTimeData {
  progress_ms: number;
}

function PlayMusic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); //현 재생 progress_ms;
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();
  const [duration, setDuration] = useState<number>(0); //트랙 시간 길이
  const [isLyric, setIsLyric] = useState<boolean>(false);

  const player = useSelector((state: RootState) => state.player);
  const premium = useSelector((state: RootState) => state.premium);

  const { track } = location.state;

  const getFetchLyric = async () => {
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    return res.data;
  };
  const { data: lyricData, isLoading: lyricLoading } = useQuery<
    LyricData[],
    Error
  >(["lyric", track.id], getFetchLyric, {
    staleTime: 10800000,
  });

  useEffect(() => {
    setDuration(track.duration_ms);
    return () => {
      if (premium.premium) {
        pause();
      }
    };
  }, []);

  useEffect(() => {
    if (currentTime >= duration) {
      clearInterval(intervalId);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentTime, duration]);

  const startProgressBar = () => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1000);
    }, 1000);
    setIntervalId(interval);
  };
  const stopProgressBar = () => {
    clearInterval(intervalId);
  };

  const resume = async () => {
    await player.player?.activateElement();
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
      startProgressBar();
      setIsPlaying(true);
    }
  };
  const dragResume = async (progressMs: number) => {
    const res = await axiosSpotify.put("/me/player/play", {
      uris: ["spotify:track:" + track.id],
      position_ms: progressMs,
    });
    if (res.status === 202) {
      setIsPlaying(true);
    }
  };

  //정지
  const pause = async () => {
    const res = await axiosSpotify.put("/me/player/pause");
    if (res.status === 202) {
      setIsPlaying(false);
      stopProgressBar();
    }
  };

  const goBack = () => {
    navigate(-1); //뒤로가기
  };

  // 가사보기
  const goLyric = () => {
    setIsLyric(true);
  };
  const goStudy = async (track: any) => {
    const res1 = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    const res2 = await axiosApi.post(
      `/api/support/quiz/category/${track.id}`,
      res1.data
    );
    const { grammar, vocabulary, reading } = res2.data;
    if (grammar && vocabulary && reading) {
      navigate("/category", {
        state: {
          track,
        },
      });
    } else {
      alert("지원하지 않는 언어입니다.");
    }
  };
  const lyricClick = true;

  const progressPercentage = (currentTime / duration) * 100;

  const goMockExam = async (track: any) => {
    const res1 = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    const res2 = await axiosApi.post(
      `/api/support/quiz/category/${track.id}`,
      res1.data
    );
    const { grammar, vocabulary, reading } = res2.data;
    if (grammar && vocabulary && reading) {
      navigate("/mockExam", {
        state: {
          track,
        },
      });
    } else {
      alert("지원하지 않는 언어입니다.");
    }
  };

  return (
    <div className="bg-[black] flex flex-row justify-center w-full h-screen font-[roboto] overflow-y-auto">
      <div className=" bg-[black] overflow-hidden  max-w-[450px] h-screen  flex flex-col px-5 overflow-y-auto scrollbar">
        <div>
          <IoIosArrowRoundBack
            onClick={goBack}
            className="fill-[white] w-10 h-10 mt-8 hover:opacity-60 "
          />
        </div>

        {isLyric && (
          <Lyric
            trackId={track.id}
            isLyric={isLyric}
            setIsLyric={setIsLyric}
            setCurrentTime={setCurrentTime}
            currentTime={currentTime}
            lyricClick={lyricClick}
            lyricData={lyricData || []}
            lyricLoading={lyricLoading}
          />
        )}
        {/* 앪범 커버 */}
        <div className="flex items-center justify-center mt-4">
          <img
            src={track.album.images[0].url}
            alt="Album Cover"
            className="rounded-lg w-84 h-84"
          />
        </div>

        {/* 트랙 명 */}
        <span className="text-[white]  text-3xl font-bold mt-4 mb-1">
          {track.name}
        </span>

        {/* 아티스트 이름*/}
        <div className="">
          {track.artists.map((artist: any, index: number) => (
            <span key={index} className="text-[#B3B3B3] text-left text-lg ">
              {artist.name}
            </span>
          ))}
        </div>

        {/* progress Bar */}
        <div
          className="w-full h-2 mt-12 bg-gray-200 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progressPercentage = (clickX / rect.width) * 100;
            const progressMs = (progressPercentage / 100) * track.duration_ms;
            setCurrentTime(progressMs);
            dragResume(progressMs);
          }}
        >
          <div
            className={`h-full bg-[#7CEEFF] rounded-full transition-all duration-500 ease-in-out `}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/** 재생 시간*/}
        <div className="flex justify-between mt-1">
          <span className="text-[#B3B3B3]">
            {Math.floor(currentTime / 1000 / 60)}:
            {Math.floor((currentTime / 1000) % 60) < 10
              ? `0${Math.floor((currentTime / 1000) % 60)}`
              : Math.floor((currentTime / 1000) % 60)}
          </span>
          <span className=" text-[#B3B3B3]">
            {Math.floor(track.duration_ms / 1000 / 60)}:
            {Math.floor((track.duration_ms / 1000) % 60) < 10
              ? `0${Math.floor((track.duration_ms / 1000) % 60)}`
              : Math.floor((track.duration_ms / 1000) % 60)}
          </span>
        </div>
        {/* 버튼 div */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-col items-center">
            <div
              onClick={goLyric}
              className="flex flex-col justify-center items-center text-[#d3d3d3] hover:opacity-60"
            >
              <IoIosArrowUp />
              <span>가사</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-8">
          <button
            onClick={() => goStudy(track)}
            className="font-bold bg-[white] rounded-2xl h-9 w-32 flex items-center justify-center hover:opacity-60"
          >
            <LuPencilLine />
            <span className="ml-1 text-sm whitespace-nowrap">학습하기</span>
          </button>
          {!isPlaying ? (
            <FaPlayCircle
              className="fill-[white] w-16 h-16 hover:opacity-60 mx-8"
              onClick={resume}
            />
          ) : (
            <FaPauseCircle
              className="fill-[white] w-16 h-16 hover:opacity-60 mx-4"
              onClick={pause}
            />
          )}
          <button
            onClick={() => goMockExam(track)}
            className=" font-bold bg-[white] rounded-2xl h-9 w-32 flex items-center justify-center hover:opacity-60"
          >
            <MenuBook />
            <span className="ml-1 text-sm whitespace-nowrap">모의고사</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayMusic;
