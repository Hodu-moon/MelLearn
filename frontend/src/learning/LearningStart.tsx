import React from "react";
import { useNavigate } from "react-router-dom";
import BgCircle from "../components/BgCircle";
import { IoIosArrowRoundBack } from "react-icons/io";

interface Track {
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
}

interface Start {
  start: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  track: Track;
}

function LearningStart(props: Start) {
  const { start, setStart, track } = props;

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-start justify-start h-full pt-8 ">
      <BgCircle />
      <IoIosArrowRoundBack
        onClick={goBack}
        className="z-10 w-10 h-10 mb-24 fill-black hover:opacity-40"
      />
      <img
        src={track.album.images[0].url}
        alt="Album Cover"
        className="z-10 mb-4 rounded-xl"
      />
      <div className="z-10 flex justify-center w-full mb-20">
        <span className="text-4xl font-extrabold text-center text-black">
          {track.name}
        </span>
      </div>

      <button
        onClick={() => setStart(true)}
        className="z-10 hover:opacity-70 bg-[#007AFF] w-full h-12 rounded-md text-white font-bold text-lg"
      >
        문제 풀기
      </button>
    </div>
  );
}

export default LearningStart;
