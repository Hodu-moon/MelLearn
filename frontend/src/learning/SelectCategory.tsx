import React, { useEffect, useState } from "react";
import BgCircle from "../components/BgCircle";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import axiosApi, { axiosSpotifyScraper } from "../api";
import { Menu } from "antd";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

interface Category {
  name: string;
  value: boolean;
}

function SelectCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { track } = location.state;

  const [category, setCategory] = useState("");
  const [serverLyric, setServerLyric] = useState("");
  const [lyric, setLyric] = useState();
  const [cancelTokenSource, setCancelTokenSource] = useState<any>(); // 문제 요청 도중 나갈시 취소 용 cancel Token
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);
    return () => {
      source.cancel(); // 컴포넌트 언마운트시 요청 취소
    };
  }, []);

  const { data: categories, isLoading } = useQuery<Category[]>(
    ["categories", track.id],
    async () => {
      //서버에 보낼 가사 데이터, 데이터 변환
      const res = await axiosSpotifyScraper.get(
        `/track/lyrics?trackId=${track.id}`
      );
      const data = res.data;
      let modifiedString = data.replace(/\[.*?\]/g, "");
      modifiedString = modifiedString.replace(/\n/g, ".\n");
      setServerLyric(modifiedString);

      // 카테고리 조회용 가사
      const res1 = await axiosSpotifyScraper.get(
        `/track/lyrics?trackId=${track.id}&format=json`
      );
      setLyric(res1.data);
      const res2 = await axiosApi.post(
        `/api/support/quiz/category/${track.id}`,
        res1.data
      );

      return Object.entries(res2.data)
        .filter(([key, value]) =>
          [
            "grammar",
            "speaking",
            "listening",
            "reading",
            "vocabulary",
          ].includes(key)
        )
        .map(([name, value]) => ({
          name,
          value: value as boolean,
        }));
    }
  );

  const handleMenuClick = (e: any) => {
    setCategory(e.key);
  };
  const goSolveProblem = async () => {
    setLoading(true);
    try {
      if (
        category === "reading" ||
        category === "vocabulary" ||
        category === "grammar"
      ) {
        const res = await axiosApi.post(
          `/api/quiz/${category}`,
          {
            musicId: track.id,
            quizType: category.toUpperCase(),
            lyric: serverLyric,
          },
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        if (res.status === 200) {
          setLoading(false);
          navigate("/question", {
            state: {
              category,
              track,
              quiz: res.data,
            },
          });
        }
      } else if (category === "speaking") {
        //speaking
        setLoading(false);
        navigate("/speaking", {
          state: {
            track,
          },
        });
      } else if (category === "listening") {
        // Listening
        setLoading(false);
        const res = await axiosApi.post(
          `/api/quiz/${category}`,
          {
            musicId: track.id,
            quizType: category.toUpperCase(),
            lyric: serverLyric,
          },
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        if (res.status === 200) {
          setLoading(false);
          navigate("/listening", {
            state: {
              category,
              track,
              quiz: res.data,
            },
          });
        }
      }
    } catch (e) {
      if (axios.isCancel(e)) {
      }
    } finally {
      cancelTokenSource.cancel("사용자가 페이지 떠남");
    }
  };

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] overflow-hidden w-[450px] h-screen relative flex flex-col ">
        <BgCircle />
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <Spinner animation="border" variant="primary"></Spinner>
          </div>
        ) : (
          <div className="z-10 ">
            <div className="px-4">
              <IoIosArrowRoundBack
                onClick={() => navigate(-1)}
                className="w-10 h-10 mt-4 fill-black hover:opacity-55"
              />
            </div>

            <img
              src="/images/image.png"
              alt="Category Cover"
              className="w-full mt-12 h-88"
            />
            {loading && (
              <div className="absolute left-0 z-10 flex items-center justify-center w-full h-12 font-bold text-center text-white animate-pulse top-50 rounded-xl ">
                <div className="animate-bounce bg-[#007AFF] h-12 flex items-center rounded-xl w-[80%] justify-center">
                  인공지능이 문제를 만들고 있어요
                </div>
              </div>
            )}

            <div className="flex flex-col items-center justify-center w-full bg-white fixed-bottom h-88 rounded-t-2xl">
              <div className="flex justify-start w-full pt-4 pl-4">
                <span className="text-2xl font-extrabold text-black">
                  Category
                </span>
              </div>

              <Menu
                mode="vertical"
                className="flex flex-col items-center justify-center text-xl font-bold rounded-t-2xl"
                onSelect={handleMenuClick}
                items={categories?.map((category, index) => ({
                  key: category.name,
                  label: `${category.name}`,
                  disabled: !category.value,
                }))}
              />
              <div className="flex justify-center w-full ">
                <button
                  onClick={goSolveProblem}
                  className="bg-[#007AFF] w-[90%] h-12 rounded-xl mt-3 mb-3 text-white font-bold hover:opacity-60"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectCategory;
