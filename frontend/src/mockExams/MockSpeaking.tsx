import React, { useEffect, useRef, useState } from "react";
import { axiosSpotify, axiosSpotifyScraper } from "../api";
import { useQuery } from "react-query";
import { LyricData } from "../redux/type";
import { IoMdMicrophone } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setRecordBlobUrl } from "../redux/mockSpeaking/recordSlice";
import { RootState } from "../redux/store";

interface ITrack {
  album: {
    images: {
      url: string;
    }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
  is_playable: boolean;
  name: string;
  type: string;
  uri: string;
  duration_ms: number;
  id: string;
}
interface Track {
  track: ITrack;

  label: number | undefined;
}

function MockSpeaking({ track, label }: Track) {
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();

  const dispatch = useDispatch();
  const premium = useSelector((state: RootState) => state.premium);
  const getLyric = async () => {
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    return res.data;
  };

  const { data: lyricData, isLoading: lyricLoading } = useQuery<LyricData[]>(
    ["lyric", track.id],
    () => getLyric(),
    {
      staleTime: 10800000,
    }
  );

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
          const blobUrl = URL.createObjectURL(recordedBlob);
          dispatch(setRecordBlobUrl(blobUrl));
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

  useEffect(() => {
    if (currentTime >= duration) {
      //노래 종료
      setCurrentTime(0);
      stopRecording();
      clearInterval(intervalId);
    }
  }, [currentTime, duration]);
  useEffect(() => {
    setDuration(track.duration_ms);
    return () => {
      if (premium.premium) {
        pause(); // 컴포넌트 언마운트시 음악 정지
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-start h-[15%]">
        <div className="flex items-center w-full h-16 p-2 my-2 bg-white rounded-2xl shadow-[0px_4px_4px_#00000040] justify-between">
          <div className="flex items-center justify-center ">
            <img
              src={track.album.images[2].url}
              alt="Album Cover"
              className="w-12 h-12 rounded-xl"
            />
            <div className="flex flex-col justify-start ml-4">
              <span className="text-sm font-bold">{track.name}</span>
              <span className="text-sm">{track.artists[0].name}</span>
            </div>
          </div>
          <IoMdMicrophone
            className="w-8 h-8 hover:opacity-60"
            onClick={accessMicrophone}
          />
        </div>
      </div>
      <span className="font-bold h-[5%]">{label && 16 + label}.</span>
      <div className="h-[80%] p-3 overflow-y-auto leading-[normal] bg-white scrollbarwhite rounded-xl shadow-[0px_4px_4px_#00000040]">
        {lyricData?.map((lyric, index) => (
          <div key={index}>
            <p
              className={`text-${
                currentTime >= lyric.startMs &&
                currentTime <= lyric.startMs + lyric.durMs
                  ? "#B3B3B3"
                  : "black"
              } hover:opacity-60 text-2xl font-semibold`}
            >
              {lyric.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MockSpeaking;
