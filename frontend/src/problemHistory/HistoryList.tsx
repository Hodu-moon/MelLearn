import React, { useEffect, useState } from "react";
import axiosApi, { axiosSpotify } from "../api";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { ChartData } from "../redux/type";

interface History {
  content: {
    id: number;
    quizList: {
      id: number;
      musicId: string;
      level: number;
      quizzes: {
        id: number;
        question: string;
        answer: number;
        comment: string;
        correctRate: number;
        optionList: string[];
      }[];
    };
    score: number;
    submitAnswerList: number[];
  }[];
  number: number;
  numberOfElements: number;
  size: number;
  totalPages: number;
}
interface IHistory {
  quizType: string;
}
function HistoryList({ quizType }: IHistory) {
  const [tracks, setTracks] = useState<ChartData>();
  const [history, setHistory] = useState<History>();
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);
  const navigate = useNavigate();

  const fetchHistory = async (page: number) => {
    const upperQuiz = quizType.toUpperCase();
    const res = await axiosApi.get(
      `/api/quiz/submit?page=${page - 1}&quizType=${upperQuiz}`
    );

    const musicIds = res.data.content.map((item: any) => item.quizList.musicId);

    if (musicIds.length >= 1) {
      const idsParam = musicIds.join(",");
      const trackReq = await axiosSpotify.get(`/tracks?ids=${idsParam}`);
      setTracks(trackReq.data);
    }
    setHistory(res.data);
  };
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchHistory(pageNumber);
    setPageGroup(Math.ceil(pageNumber / 5));
  };
  const goComment = (item: any) => {
    navigate("/comment", {
      state: {
        comments: item,
      },
    });
  };
  const getLevel = (level: number | undefined) => {
    switch (level) {
      case 1:
        return "초급";
      case 2:
        return "중급";
      case 3:
        return "고급";
      default:
        return "초급";
    }
  };
  useEffect(() => {
    setPage(1);
    fetchHistory(1);
  }, [quizType]);
  if (!history) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <div className="w-full h-full px-4 overflow-y-auto text-white">
      {history.content.map((item, index) => (
        <div key={index} className="flex justify-between h-16 my-2">
          <div className="mr-4">
            <img
              src={tracks?.tracks[index]?.album?.images[2]?.url}
              alt="Album Cover"
              className="w-16 h-16 rounded-lg"
            />
          </div>
          <div className="flex flex-col items-start justify-center  w-[70%]">
            <span className="font-bold text-md">
              {tracks?.tracks[index]?.name}
            </span>
            <div className="flex justify-between w-full">
              <span className="text-[#DED9D9] text-sm">
                {tracks?.tracks[index]?.artists[0]?.name}
              </span>
              <span className="text-sm font-bold text-white sm:mr-12">
                {getLevel(item.quizList.level)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-[15%] ">
            <span className="mb-2 font-bold">{item.score}점</span>
            <button
              onClick={() => goComment(item)}
              className="font-bold bg-[#1889FE] h-4 text-xs w-20 rounded-sm hover:opacity-60 flex items-center justify-center"
            >
              <span>해설 보기</span>
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-end justify-center w-full px-4 fixed-bottom">
        <Pagination className="px-4">
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => setPageGroup(pageGroup - 1)}
            disabled={pageGroup === 1}
          />
          {Array.from({ length: 5 }, (_, i) => (pageGroup - 1) * 5 + i + 1)
            .filter((pageNumber) => pageNumber <= history?.totalPages)
            .map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
          <Pagination.Next
            onClick={() => setPageGroup(pageGroup + 1)}
            disabled={pageGroup === Math.ceil(history?.totalPages / 5)}
          />
          <Pagination.Last
            onClick={() => handlePageChange(history?.totalPages)}
          />
        </Pagination>
      </div>
    </div>
  );
}

export default HistoryList;
