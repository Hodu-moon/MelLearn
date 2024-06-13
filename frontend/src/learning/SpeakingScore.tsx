import { useLocation, useNavigate } from "react-router-dom";
import BgCircle from "../components/BgCircle";

function SpeakingScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const { comments, track } = location.state;
  console.log(comments.markedText);
  const parts = comments.markedText.split("\n");
  const viewRank = async () => {
    navigate("/rank", {
      state: {
        track,
      },
    });
  };
  const goHome = () => {
    navigate("/home");
  };
  console.log(comments);
  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] overflow-hidden w-[450px] h-screen relative flex flex-col ">
        <BgCircle />
        <div className="z-10 flex flex-col items-center justify-center w-full h-full px-12">
          <div className="w-full px-4 py-2 mb-8 overflow-y-auto scrollbarwhite text-black bg-white rounded-3xl h-96 shadow-[0px_4px_4px_#00000040] font-bold">
            {comments.markedText
              .split("\n")
              .map((sentence: string, index: number) => (
                <div key={index} className="sentence">
                  {sentence.split(" ").map((word, wordIndex) => {
                    if (word) {
                      if (word.startsWith("__")) {
                        return (
                          <span
                            key={wordIndex}
                            className="text-red-600 whitespace-nowrap"
                          >
                            {word.replace(/__/g, "")}{" "}
                          </span>
                        );
                      } else {
                        return <span key={wordIndex}>{word} </span>;
                      }
                    }
                    return null;
                  })}
                </div>
              ))}
          </div>
          <div className="bg-[#55A2FD] w-80 h-80 rounded-full flex justify-center items-center">
            <div className="flex items-center justify-center w-72 h-72 bg-[#9bd1e5] rounded-full">
              <div className="flex items-center justify-center w-64 h-64 bg-[#F8F8F8] rounded-full">
                <div className="flex flex-col items-center justify-center w-56 h-56 bg-[#ffffff] rounded-full relative border border-[#f8f8f8]">
                  <div className="flex items-center justify-center w-48 h-24 bg-[#55A2FD] rounded-t-full rounded-b-none overflow-hidden top-3 absolute"></div>
                  <span className="mt-24 mb-2 text-3xl font-bold">점수</span>
                  <span className="text-[#55A2FD] text-5xl ">
                    {comments.score.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-[80%] h-20 text-white font-bold flex-col  mt-8">
            <button
              className="bg-[#007AFF] mb-2 h-12 rounded-lg hover:opacity-60"
              onClick={viewRank}
            >
              랭킹 보기
            </button>
            <button
              className="bg-[#007AFF] h-12 rounded-lg hover:opacity-60"
              onClick={goHome}
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakingScore;
