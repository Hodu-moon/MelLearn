import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BgCircle from "../components/BgCircle";
import Comments from "../components/Comments";
import ListeningComments from "../components/ListeningComments";
import "../css/scroll.css";
import SpeakingComments from "../components/SpeakingComments";
import HomeIcon from "@mui/icons-material/Home";

function MockComment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { comment } = location.state;

  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] whi overflow-hidden w-[450px] h-full relative flex flex-col px-8">
        <BgCircle />
        <div className="z-10 h-full">
          {currentPage === 1 && (
            <div className="font-bold text-2xl h-[10%] flex w-full  justify-around items-center">
              <span>문법</span>
              <span className="text-[#007AFF]">
                {comment.comprehensiveQuizAnswer.grammarSubmit.score}점
              </span>
            </div>
          )}
          {currentPage === 2 && (
            <div className="font-bold text-2xl h-[10%] flex w-full  justify-around items-center">
              <span>단어</span>
              <span className="text-[#007AFF]">
                {comment.comprehensiveQuizAnswer.vocabularySubmit.score}점
              </span>
            </div>
          )}
          {currentPage === 3 && (
            <div className="font-bold text-2xl h-[10%] flex w-full  justify-around items-center">
              <span>독해</span>
              <span className="text-[#007AFF]">
                {comment.comprehensiveQuizAnswer.readingSubmit.score}점
              </span>
            </div>
          )}
          {currentPage === 4 && (
            <div className="font-bold text-2xl h-[10%] flex w-full  justify-around items-center">
              <span>듣기</span>
              <span className="text-[#007AFF]">
                {comment.comprehensiveQuizAnswer.listeningSubmit.score}점
              </span>
            </div>
          )}
          {currentPage === 5 && (
            <div className="font-bold text-2xl h-[10%] flex w-full  justify-around items-center">
              <span>스피킹</span>
              <span className="text-[#007AFF]">
                {comment.comprehensiveQuizAnswer.speakingSubmit.score.toFixed(
                  2
                )}
                점
              </span>
            </div>
          )}

          {currentPage === 1 && (
            <div className="h-[80%] overflow-y-auto scrollbarwhite">
              <Comments
                comments={comment.comprehensiveQuizAnswer.grammarSubmit}
              />
            </div>
          )}
          {currentPage === 2 && (
            <div className="h-[80%] overflow-y-auto scrollbarwhite">
              <Comments
                comments={comment.comprehensiveQuizAnswer.vocabularySubmit}
              />
            </div>
          )}
          {currentPage === 3 && (
            <div className="h-[80%] overflow-y-auto scrollbarwhite">
              <Comments
                comments={comment.comprehensiveQuizAnswer.readingSubmit}
              />
            </div>
          )}
          {currentPage === 4 && (
            <div className="h-[80%] overflow-y-auto scrollbarwhite px-4 py-2 bg-white rounded-xl">
              <ListeningComments
                comments={comment.comprehensiveQuizAnswer.listeningSubmit}
              />
            </div>
          )}
          {currentPage === 5 && (
            <div className="h-[80%] overflow-y-auto flex felx-col scrollbarwhite bg-white rounded-xl px-4 py-2">
              <SpeakingComments
                comments={comment.comprehensiveQuizAnswer.speakingSubmit}
              />
            </div>
          )}
          <div className=" flex justify-center w-full h-[10%] mt-4">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`p-2 w-10 h-10 mx-1  rounded-md cursor-pointer bg-[${
                  currentPage === page ? "#007AFF" : "white"
                }] text-[${
                  currentPage === page ? "white" : "black"
                }] text-center hover:opacity-60`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => navigate("/home")}
              className="w-10 h-10 p-2 mx-1 bg-white rounded-md cursor-pointer hover:opacity-60"
            >
              <HomeIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockComment;
