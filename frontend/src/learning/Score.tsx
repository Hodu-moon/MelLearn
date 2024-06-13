import BgCircle from "../components/BgCircle";
import { useLocation, useNavigate } from "react-router-dom";

export const Score = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { comments } = location.state;

  const goCommentary = () => {
    navigate("/comment", {
      state: {
        comments,
      },
    });
  };
  const goHome = () => {
    navigate("/home");
  };
  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen">
      <div className="bg-[#9bd1e5] overflow-hidden w-full sm:max-w-[450px] h-screen relative flex flex-col ">
        <BgCircle />
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
        </div>
        <div className="z-10 flex flex-col items-center justify-center w-full h-40 mb-12">
          <button
            onClick={goCommentary}
            className="bg-[#007AFF] sm:w-[60%] w-[30%] rounded-lg h-10 text-white font-bold hover:opacity-60 mb-4"
          >
            해설보기
          </button>
          <button
            onClick={goHome}
            className="bg-[#007AFF] sm:w-[60%] w-[30%] rounded-lg h-10 text-white font-bold hover:opacity-60"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};
