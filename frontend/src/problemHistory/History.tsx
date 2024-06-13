import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import HistoryList from "./HistoryList";
import { useNavigate } from "react-router-dom";
import HistoryListListenig from "./HistoryListListenig";
import HistorySpeaking from "./HistorySpeaking";

const History = () => {
  const navigate = useNavigate();

  const categories = [
    "Reading",
    "Grammar",
    "Vocabulary",
    "Listening",
    "Speaking",
  ];
  const [quizType, setQuizType] = useState("Reading");

  const onClickCategory = (category: string) => {
    setQuizType(category);
  };

  return (
    <>
      <div className="bg-[white] flex flex-row justify-center w-full h-screen font-[roboto]">
        <div className="bg-[black] overflow-hidden w-full sm:max-w-[450px] h-screen relative flex flex-col">
          <div className="flex items-center justify-between w-full px-4 mt-4">
            <div className=" w-[33%] hover:opacity-60">
              <IoIosArrowRoundBack
                onClick={() => navigate("/home")}
                className="w-10 h-10 fill-white"
              />
            </div>
            <div className="w-[33%] text-center">
              <span className="text-2xl font-bold text-white">히스토리</span>
            </div>

            <div className="w-[33%]"></div>
          </div>
          <div className="flex items-end w-full mt-4 ">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => onClickCategory(category)}
                className={`${
                  quizType === category
                    ? "text-[#3D5AF1] h-16 rounded-t-xl"
                    : "text-[#C0C0C0] "
                } flex items-center justify-center w-[20%] h-12 bg-white font-bold text-md px-2 hover:opacity-60`}
              >
                <div>
                  <span>{category}</span>
                </div>
              </div>
            ))}
          </div>
          {(quizType === "Reading" ||
            quizType === "Vocabulary" ||
            quizType === "Grammar") && (
            <div className="h-[70%] ">
              <HistoryList quizType={quizType} />
            </div>
          )}
          {quizType === "Listening" && (
            <div className="h-[70%]">
              <HistoryListListenig quizType={quizType} />
            </div>
          )}
          {quizType === "Speaking" && (
            <div className="h-[70%]">
              <HistorySpeaking quizType={quizType} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
