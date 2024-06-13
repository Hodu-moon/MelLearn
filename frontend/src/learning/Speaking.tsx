import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import LearningStart from "./LearningStart";
import { IoIosArrowRoundBack, IoIosArrowUp } from "react-icons/io";
import { useQuery } from "react-query";
import Lyric from "../musichome/Lyric";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Speaking = () => {
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const location = useLocation();
  const { track } = location.state;
  const [start, setStart] = useState<boolean>(false);
  const [isLyric, setIsLyric] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const premium = useSelector((state: RootState) => state.premium);

  const getLyric = async () => {
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    return res.data;
  };
  const { data: lyricData, isLoading: lyricLoading } = useQuery(
    ["lyric", track.id],
    () => getLyric(),
    {
      staleTime: 10800000,
    }
  );

  useEffect(() => {
    setDuration(track.duration_ms);
    return () => {
      if (premium.premium) {
        pause(); // 컴포넌트 언마운트시 음악 정지
        stopRecording(); // 컴포넌트 언마운트시 녹음 중지
      }
    };
  }, []);

  useEffect(() => {
    if (currentTime >= duration) {
      //노래 종료
      setCurrentTime(0);
      stopRecording();
      clearInterval(intervalId);
    }
  }, [currentTime, duration]);

  const accessMicrophone = async () => {
    try {
      // mic 접근 권한 허용
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // true 되면 실행
      if (stream.active) {
        playMusic(); // 마이크 연결 될시 음악 실행
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
          const wavAudioData = new Blob([e.data]);
          chunks.current = [];
          chunks.current.push(wavAudioData);
        };
        mediaRecorder.current.start();
        mediaRecorder.current.onstop = async () => {
          // 노래 끝나고 서버에 speaking data 보냄
          const recordedBlob = new Blob(chunks.current, { type: "audio/wav" });
          //const url = URL.createObjectURL(recordedBlob);
          const formData = new FormData();
          formData.append(`file`, recordedBlob);
          const lyricsBlob = new Blob([JSON.stringify(lyricData)], {
            type: "application/json",
          });
          formData.append("lyricList", lyricsBlob, "lyricList.json");
          const musicId = new Blob([track.id], {
            type: "text/plain",
          });

          formData.append("musicId", musicId, "musicId.json");
          const res = await axiosApi.post(
            "/api/problem/speaking/transcription",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          ); // 파일명은 선택사항
          setIsLoading(true);
          if (res.status === 200) {
            setIsLoading(false);
            navigate("/speakingScore", {
              state: {
                comments: res.data,

                track: track,
              },
            });
          }
        };
      }
    } catch (error) {
      alert("마이크를 연결해주세요");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      pause();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  const startProgressBar = () => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1000);
    }, 1000);
    setIntervalId(interval);
  };
  const playMusic = async () => {
    const res = await axiosSpotify.put("/me/player/play", {
      uris: ["spotify:track:" + track.id],
      position_ms: 0,
    });
    if (res.status === 202) {
      startProgressBar();
      // 노래 한곡 재생 데이터 보내주기
      //노래 끝나면 녹음 중지하면서 서버에 요청
    }
  };

  const pause = async () => {
    const res = await axiosSpotify.put("/me/player/pause");
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const progressPercentage = (currentTime / duration) * 100;
  const lyricClick = false;

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div
        className={` ${
          start ? "bg-black" : "bg-[#9bd1e5] relative"
        } overflow-hidden max-w-[450px] h-screen  flex flex-col px-5 items-center
        `}
      >
        {!start ? (
          <LearningStart start={start} setStart={setStart} track={track} />
        ) : (
          <div>
            <IoIosArrowRoundBack
              onClick={goBack}
              className="z-10 w-10 h-10 my-4 sm:w-10 sm:h-10 fill-white hover:opacity-40"
            />
            {isLyric && (
              <Lyric
                trackId={track.id}
                isLyric={isLyric}
                setIsLyric={setIsLyric}
                currentTime={currentTime}
                lyricClick={lyricClick}
                setCurrentTime={setCurrentTime}
                lyricData={lyricData}
                lyricLoading={lyricLoading}
              />
            )}
            <img
              src={track.album.images[0].url}
              alt="Album Cover"
              className="mb-4 rounded-2xl"
            />
            <span className="text-3xl font-bold text-white">{track.name}</span>
            <div className="w-full h-2 mt-4 bg-gray-200 rounded-full cursor-pointer">
              <div
                className={`h-full bg-[#7CEEFF] rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[#B3B3B3]">
                {Math.floor(currentTime / 1000 / 60)}:
                {Math.floor((currentTime / 1000) % 60) < 10
                  ? `0${Math.floor((currentTime / 1000) % 60)}`
                  : Math.floor((currentTime / 1000) % 60)}
              </span>
              <span className=" text-[#B3B3B3]">
                {Math.floor(duration / 1000 / 60)}:
                {Math.floor((duration / 1000) % 60) < 10
                  ? `0${Math.floor((duration / 1000) % 60)}`
                  : Math.floor((duration / 1000) % 60)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                onClick={() => setIsLyric(true)}
                className="flex flex-col justify-center items-center text-[#d3d3d3] hover:opacity-60"
              >
                <IoIosArrowUp />
                <span>가사</span>
              </div>
            </div>

            <button
              className="bg-[#007AFF] text-white font-bold w-[100%] h-10 rounded-xl mt-12"
              onClick={accessMicrophone}
            >
              시작하기
            </button>
            {isLoading && (
              <div className="z-10 flex items-center justify-center w-full h-12 font-bold text-center text-white animate-pulse top-50 rounded-xl">
                <div className="animate-bounce bg-[#007AFF] h-12 flex items-center rounded-xl w-[80%] justify-center">
                  인공지능이 채점중이에요
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Speaking;
