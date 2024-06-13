import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import "../css/scroll.css";
import { FaPause, FaPlay } from "react-icons/fa6";
import MockSubmitDisplay from "./MockSubmitDisplay";
import MockSpeaking from "./MockSpeaking";
import BgCircle from "../components/BgCircle";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ReadComp {
  id: number;
  quizzes: {
    answer: number;
    comment: string;
    correctRate: number;
    question: string;
    optionList: string[];
  }[];
}
interface Listening {
  answerList: string[];
  blankedText: string;
}
interface Exam {
  grammarQuiz: ReadComp;
  listeningQuizDto: Listening;
  readingQuiz: ReadComp;
  vocaQuiz: ReadComp;
}

function MockExam() {
  const location = useLocation();
  const navigate = useNavigate();
  const { track } = location.state;
  const [currentPage, setCurrentPage] = useState(1);

  const [lrcLyricList, setlrcLyricList] = useState();
  const [exam, setExam] = useState<
    {
      answer: number;
      comment: string;
      correctRate: number;
      question: string;
      optionList: string[];
    }[]
  >([]);
  const [listening, setListening] = useState<Listening>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();

  const quizLen = 5;
  const listenLen = 10;
  const [readingSubmit, setReadingSubmit] = useState<number[]>(
    new Array(quizLen).fill(0)
  );
  const [vocabularySubmit, setVocabularySubmit] = useState<number[]>(
    new Array(quizLen).fill(0)
  );
  const [grammarSubmit, setGrammarSubmit] = useState<number[]>(
    new Array(quizLen).fill(0)
  );
  const [listeningSubmit, setListeningSubmit] = useState<string[]>(
    new Array(listenLen).fill("")
  );
  const recordedBlobUrl = useSelector(
    (state: RootState) => state.record.recordedBlobUrl
  );

  const combineQuizzArray = (quiz: Exam) => {
    const combinArray = [];
    if (quiz.grammarQuiz.quizzes) combinArray.push(...quiz.grammarQuiz.quizzes);
    if (quiz.readingQuiz.quizzes) combinArray.push(...quiz.readingQuiz.quizzes);
    if (quiz.vocaQuiz.quizzes) combinArray.push(...quiz.vocaQuiz.quizzes);

    return combinArray;
  };

  const fetchExam = async () => {
    const res = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );

    setlrcLyricList(res.data);
    const res2 = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}`
    );
    const res3 = await axiosApi.post("/api/comprehensive-quiz", {
      musicId: track.id,
      quizType: "GRAMMAR",
      lyric: res2.data,
    });
    setIsLoading(false);

    setListening(res3.data.listeningQuizDto);
    const combineQuizArr = combineQuizzArray(res3.data);
    setExam(combineQuizArr);
  };
  const getIndex = (index: number) => {
    switch (currentPage) {
      case 1:
        return index + 1;
      case 2:
        return index + 6;
      case 3:
        return index + 11;
    }
  };

  const startTime = () => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1000);
    }, 1000);
    setIntervalId(interval);
  };
  const stopTime = () => {
    clearInterval(intervalId);
  };

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
  const getSubmitArray = () => {
    switch (currentPage) {
      case 1:
        return grammarSubmit;
      case 2:
        return readingSubmit;
      case 3:
        return vocabularySubmit;
      default:
        return [];
    }
  };
  const onChagneAnswer = (answer: number, index: number) => {
    if (answer !== undefined) {
      if (currentPage === 1) {
        const newArr = [...grammarSubmit];
        newArr[index] = answer;
        setGrammarSubmit(newArr);
      } else if (currentPage === 2) {
        const newArr = [...readingSubmit];
        newArr[index] = answer;
        setReadingSubmit(newArr);
      } else if (currentPage === 3) {
        const newArr = [...vocabularySubmit];
        newArr[index] = answer;
        setVocabularySubmit(newArr);
      }
    }
  };
  const listenAnswerChange = (index: any, event: any) => {
    const newAnswers = [...listeningSubmit];
    newAnswers[index] = event.target.value;
    setListeningSubmit(newAnswers);
  };

  const submitQuiz = async () => {
    const formData = new FormData();
    const submitRequest = {
      readingSubmit,
      musicId: track.id,
      lrcLyricList,
      vocabularySubmit,
      grammarSubmit,
      listeningSubmit,
    };
    const validateReading = readingSubmit.includes(0);
    const validateVoca = grammarSubmit.includes(0);
    const validateGrammar = vocabularySubmit.includes(0);
    const validateListening = listeningSubmit.includes("");

    if (
      validateReading ||
      validateVoca ||
      validateGrammar ||
      validateListening ||
      !recordedBlobUrl
    ) {
      alert("작성하지 않은 답안이 있습니다.");
    } else {
      const res = await fetch(recordedBlobUrl);
      const blob = await res.blob();
      formData.append("speakingSubmitFile", blob);
      const submitBlob = new Blob([JSON.stringify(submitRequest)], {
        type: "application/json",
      });
      formData.append("submitRequest", submitBlob, "submit.json");
      const res2 = await axiosApi.post(
        "/api/comprehensive-quiz/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        navigate("/mockComment", {
          state: {
            comment: res2.data,
          },
        });
      }
    }
  };
  useEffect(() => {
    fetchExam();
    if (listening) {
      setListeningSubmit(Array(listening.answerList.length).fill(""));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
        <div className="bg-[#9bd1e5] w-full overflow-hidden sm:max-w-[450px] h-full relative flex flex-col px-8 ">
          <div className="absolute left-0 z-10 flex items-center justify-center w-full h-12 font-bold text-center text-white animate-pulse top-50 rounded-xl ">
            <div className="animate-bounce bg-[#007AFF] h-12 flex items-center rounded-xl w-[80%] justify-center">
              모의고사 생성중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5]  overflow-hidden w-full sm:max-w-[450px] h-full relative flex flex-col px-8 ">
        {/* 모의고사 제목*/}
        <BgCircle />
        <div className="h-[10%] z-10 ">
          <div className="my-2 border-t-2 border-black"></div>
          <div className="flex flex-col items-center justify-center w-full">
            <span className="text-3xl font-bold ">{track.name}</span>
            <span className="text-xl font-bold">모의고사</span>
          </div>
          <div className="my-2 border-t-2 border-black"></div>
        </div>

        {/* 문제 */}
        <div className="h-[70%] z-10 mt-4">
          <span className="font-bold sm:text-md">
            {currentPage === 1 &&
              "[01-05] Read the following passages. Then choose the option that best completes the passage."}
            {currentPage === 2 &&
              "[06-10] Read the following passages. Then choose the option that best completes the passage."}
            {currentPage === 3 &&
              "[11-15] Read the following passages. Then choose the option that best completes the passage."}
            {currentPage === 4 &&
              listening &&
              `[16-${
                16 + listening?.answerList.length - 1
              }]  Listen to the music and write appropriate words in the blank spaces.`}
            {currentPage === 5 &&
              listening &&
              `[${
                16 + listening.answerList.length
              }] Listen to the song and sing along paying attention to pronunciation.`}
          </span>
          <div className="h-full overflow-y-auto whitespace-normal scrollbarwhite ">
            {exam
              .slice((currentPage - 1) * 5, currentPage * 5)
              ?.map((problem, index) => (
                <div key={index} className="flex flex-col mt-2">
                  <span className="font-bold">{getIndex(index)}.</span>
                  <div className="p-2 mb-2 font-semibold border border-black">
                    {problem.question}
                  </div>
                  <RadioGroup
                    className="radio-buttons-group-focus"
                    row
                    onChange={(e: any) =>
                      onChagneAnswer(parseInt(e.target.value), index)
                    }
                    value={getSubmitArray()[index]}
                  >
                    {problem.optionList.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={index + 1}
                        control={<Radio className="items-center" />}
                        label={
                          <div className="">
                            <div className="flex items-center">
                              <span className="text-[black] text-md  ">
                                {index + 1}. {option.replace(/^\d+\.\s*/, "")}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    ))}
                  </RadioGroup>
                </div>
              ))}
            {/* 듣기 문제*/}
            {currentPage === 4 && (
              <div className="py-2 text-2xl font-bold text-black bg-white rounded-3xl h-[80%] mt-2">
                <div className="flex flex-col items-start">
                  <div className="flex items-center w-full h-16 p-2 mb-4 border rounded-2xl shadow-[0px_4px_4px_#00000040] justify-between">
                    <div className="flex items-center">
                      <img
                        src={track.album.images[2].url}
                        alt="Album Cover"
                        className="w-12 h-12 rounded-xl"
                      />
                      <div className="flex flex-col justify-start ml-2">
                        <span className="text-sm font-bold">{track.name}</span>
                        <span className="text-xs">{track.artists[0].name}</span>
                      </div>
                    </div>

                    <div className="ml-36 hover:opacity-50">
                      {isPlaying ? (
                        <FaPause onClick={pause} className="w-6 h-6" />
                      ) : (
                        <FaPlay onClick={resume} className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-full p-3 overflow-y-auto leading-[normal] bg-white scrollbarwhite shadow-[0px_4px_4px_#00000040] rounded-b-2xl">
                  {listening?.blankedText
                    ?.split("__")
                    ?.map((lyric: string, index: number) => (
                      <span key={index} className="text-xl">
                        {lyric.replace(/\[\d+:\d+\.\d+\]/g, "")}
                        {index !==
                          listening.blankedText.split("__").length - 1 && (
                          <span>
                            <span className="text-xs">{index + 16}.</span>

                            <input
                              type="text"
                              onChange={(event) =>
                                listenAnswerChange(index, event)
                              }
                              value={listeningSubmit[index] || ""}
                              className="w-24 h-5 text-lg text-center text-blue-500 bg-white rounded-md border-gray"
                            />
                          </span>
                        )}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {currentPage === 5 && (
              <div className="h-full">
                <div className="h-full">
                  <MockSpeaking
                    track={track}
                    label={listening?.answerList.length}
                  />
                </div>
              </div>
            )}
            {currentPage === 6 && (
              <div className="h-[70%] w-full">
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <MockSubmitDisplay
                    title="Grammar"
                    submissions={grammarSubmit}
                  />
                  <MockSubmitDisplay
                    title="Reading"
                    submissions={readingSubmit}
                  />
                  <MockSubmitDisplay
                    title="Vocabulary"
                    submissions={vocabularySubmit}
                  />
                  <MockSubmitDisplay
                    title="Listening"
                    submissions={listeningSubmit}
                  />
                </div>
                <div className="flex justify-center w-full mt-12 hover:opacity-60">
                  <button
                    onClick={submitQuiz}
                    className="font-bold text-white bg-[#007AFF] w-[50%] h-8 rounded-xl"
                  >
                    제출하기
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center w-full h-[10%] mt-8  ">
            {Array.from(
              { length: (exam.length + 10) / 5 + 1 },
              (_, i) => i + 1
            ).map((page) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockExam;
