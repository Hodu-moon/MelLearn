import { useLocation, useNavigate } from "react-router-dom";
import BgCircle from "../components/BgCircle";
import "../css/scroll.css";

function ListeningScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const { comments } = location.state;

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] w-full overflow-hidden sm:max-w-[450px] h-screen relative flex sm:flex-col sm:items-center px-4">
        <BgCircle />
        <div className="z-10 w-[40%]  sm:w-[90%] px-4 py-2 mt-8 overflow-y-auto bg-white border h-[80%] sm:h-[100%] scrollbarwhite rounded-xl shadow-[0px_4px_4px_#00000040] sm:ml-0 ml-20">
          <div className="text-2xl font-bold text-black">
            {comments.listeningQuiz.blankedText
              .split("__")
              .map((part: string, index: number) => {
                if (index < comments.listeningQuiz.answerList.length) {
                  return (
                    <span key={index} className="">
                      <span className="text-xl">{part}</span>
                      <span
                        className={`text-2xl ${
                          comments.listeningQuiz.answerList[index] ===
                          comments.submitAnswerList[index]
                            ? "text-blue-600" // 같을 때는 파란색
                            : "text-red-500" // 다를 때는 빨간색
                        }`}
                      >
                        {comments.listeningQuiz.answerList[index]}
                      </span>
                    </span>
                  );
                } else {
                  return (
                    <span className="text-xl" key={index}>
                      {part}
                    </span>
                  );
                }
              })}
          </div>
        </div>
        <div className="z-10 flex flex-col items-center justify-center w-full h-full">
          <div className="bg-[#55A2FD] w-80 h-80 rounded-full flex justify-center items-center">
            <div className="flex items-center justify-center w-72 h-72 bg-[#9bd1e5] rounded-full">
              <div className="flex items-center justify-center w-64 h-64 bg-[#F8F8F8] rounded-full">
                <div className="flex flex-col items-center justify-center w-56 h-56 bg-[#ffffff] rounded-full relative border border-[#f8f8f8]">
                  <div className="flex items-center justify-center w-48 h-24 bg-[#55A2FD] rounded-t-full rounded-b-none overflow-hidden top-3 absolute"></div>
                  <span className="mt-24 mb-2 text-3xl font-bold">점수</span>
                  <span className="text-[#55A2FD] text-5xl ">
                    {comments.score}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/home")}
            className="z-10 mt-4 hover:opacity-60 flex items-center justify-center w-[40%] sm:w-[80%] h-12 bg-[#007AFF] rounded-lg "
          >
            <button className="font-bold w-[60%] text-white text-lg">
              홈 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListeningScore;
