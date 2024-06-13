import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api";
import { Pagination } from "react-bootstrap";
import { ChartData } from "../redux/type";
interface Listening {
  quizType: string;
}
interface History {
  content: {
    id: number;
    createdTime: string;
    level: number;
    listeningQuiz: {
      id: number;
      blankedText: string;
      answerList: string[];
    };

    score: number;
    submitAnswerList: string[];
  }[];
  number: number;
  numberOfElements: number;
  size: number;
  totalPages: number;
}

function HistoryListListenig({ quizType }: Listening) {
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

    setHistory(res.data);
    // const musicIds = res.data.content.map((item: any) => item.quizList.musicId);
    // if (musicIds.length >= 1) {
    //   const idsParam = musicIds.join(",");
    //   const trackReq = await axiosSpotify.get(`/tracks?ids=${idsParam}`);
    //   setTracks(trackReq.data);
    // }
  };
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchHistory(pageNumber);
    setPageGroup(Math.ceil(pageNumber / 5));
  };
  const goComment = (item: any) => {
    navigate("/lsScore", {
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
        <div key={index} className="flex justify-between h-16 my-2 ">
          <div className="mr-4">
            <img alt="" className="w-16 h-16 rounded-lg" />
          </div>
          <div className="flex flex-col items-start justify-center  w-[70%]">
            <span className="font-bold text-md">Lucky</span>
            <div className="flex justify-between w-full">
              <span className="text-[#DED9D9] text-sm">Json Mraz</span>
              <span className="text-sm font-bold text-white sm:mr-12">
                {getLevel(item?.level)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center  w-[15%] ">
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
      <div className="flex items-end justify-center w-full fixed-bottom">
        <Pagination>
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

export default HistoryListListenig;
