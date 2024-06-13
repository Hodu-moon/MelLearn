import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../css/slider.css";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { fetchArtistData } from "../redux/artist/artistAction";
import { useQuery } from "react-query";
import { setArtistData } from "../redux/artist/artistSlice";
import { fetchChartData } from "../redux/chart/chartAction";
import { setChartData } from "../redux/chart/chartSlice";
import { fetchMetaData } from "../redux/trackMeta/trackMetaAction";
import { setTrackMetaData } from "../redux/trackMeta/trackMetaSlice";
import { fetchRecommendData } from "../redux/recommend/recommendAction";
import { setRecommendData } from "../redux/recommend/recommendSlice";
import { AiOutlineHome } from "react-icons/ai";
import axiosApi from "../api";
import { RiHistoryFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import MenuBook from "@mui/icons-material/MenuBook";

interface Member {
  id: number;
  langType: string;
  level: string;
  levelPoint: number;
  memberId: string;
  name: string;
}
interface Artist {
  id: string;
  type: string;
  name: string;
  shareUrl: string;
  visuals: {
    avatar: {
      url: string;
    }[];
  };
}

function MusicHome() {
  const [page, setPage] = useState(0);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [member, setMember] = useState<Member>(); //멤버 정보 데이터
  const [langType, setLangType] = useState();

  const getMember = async () => {
    const res = await axiosApi.get("/api/member/info");
    if (res.status === 200) {
      setMember(res.data);
      setLangType(res.data.langType);
    }
  };

  useEffect(() => {
    getMember();
  }, []);

  const { data: chartData, isLoading: chartLoading } = useQuery(
    ["chart", langType],
    () => fetchChartData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setChartData(data));
      },
    }
  );

  const { data: artistData, isLoading: artistLoading } = useQuery(
    ["artists", langType],
    () => fetchArtistData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setArtistData(data));
      },
    }
  );
  const { data: recommendData, isLoading: recommendLoading } = useQuery(
    ["recommends", langType],
    () => fetchRecommendData(langType),
    {
      enabled: !!langType,
      onSuccess: (data) => {
        dispatch(setRecommendData(data));
      },
      staleTime: 1800000,
    }
  );

  const handleChange = (newValue: number) => {
    setPage(newValue);
    switch (newValue) {
      case 0:
        //홈 화면
        navigation("/home");
        break;
      case 1:
        //모의고사
        navigation("/compQuiz");
        break;
      case 2:
        //히스토리
        navigation("/history");
        break;
      case 3:
        //설정
        navigation("/setting");
        break;
      default:
        break;
    }
  };

  const goDetailArtist = (artist: Artist) => {
    navigation(`/artistDetail?artistId=${artist.id}`, {
      state: { artist },
    });
  };

  const goPlayMusic = async (track: any) => {
    const metaData = await fetchMetaData(track.id);
    dispatch(setTrackMetaData(metaData));

    navigation("/playMusic", {
      state: {
        track,
      },
    });
  };
  if (chartLoading || artistLoading || recommendLoading) {
    return (
      <div className="bg-[black] flex flex-row justify-center w-full h-screen">
        <div className="relative bg-[black] overflow-hidden w-full max-w-[450px] h-screen  flex flex-col ">
          <div className="flex items-center justify-center h-[300%]">
            <Spinner className="border" variant="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[white] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="relative bg-black overflow-hidden w-full sm:max-w-[450px] h-screen flex sm:flex-col ">
        {/* 타이틀*/}
        <div className="flex flex-col items-center justify-between h-16 mb-2 bg-black  w-[33%] sm:w-full">
          <div className="flex flex-col items-start justify-between w-full px-4 mt-4 sm:items-center sm:flex-row">
            <span className="text-5xl font-bold text-white sm:text-3xl ">
              MelLearn
            </span>
            {window.innerWidth > 450 ? (
              <div
                onClick={() => navigation("/searchMusic")}
                className="relative flex items-center w-full mt-4 hover:opacity-60"
              >
                <FaMagnifyingGlass className="absolute w-6 h-6 fill-white right-3" />
                <input
                  placeholder="노래를 검색해주세요"
                  className="placeholder-gray-600 bg-[#282828] rounded-md h-10 p-3  w-full text-[white] "
                />
              </div>
            ) : (
              <FaMagnifyingGlass
                onClick={() => navigation("/searchMusic")}
                className="sm:w-5 sm:h-5 hover:opacity-60 fill-white"
              />
            )}
          </div>

          <div className="z-10 flex flex-col w-full mt-12 ml-8 sm:ml-0 b sm:fixed sm:bottom-0 sm:flex sm:flex-row sm:mt-0">
            <div
              onClick={() => handleChange(0)}
              className="flex sm:flex-col items-center sm:justify-center w-full sm:w-[25%] hover:text-white "
            >
              <AiOutlineHome
                className={`sm:w-7 sm:h-7 w-16 h-16 fill-${
                  page === 0 ? "white" : "gray"
                }`}
              />
              <span
                className={`font-bold text-${
                  page === 0 ? "white" : "gray"
                } sm:ml-0 ml-2 `}
              >
                홈
              </span>
            </div>
            <div
              onClick={() => handleChange(1)}
              className="w-full flex sm:flex-col items-center sm:justify-center sm:w-[25%] hover:text-white "
            >
              <MenuBook
                className={`sm:w-7 sm:h-7 w-16 h-16 fill-${
                  page === 1 ? "white" : "gray"
                }`}
              />
              <span
                className={`font-bold text-${
                  page === 1 ? "white" : "gray"
                } sm:ml-0 ml-2`}
              >
                모의고사
              </span>
            </div>
            <div
              onClick={() => handleChange(2)}
              className="flex sm:flex-col items-center sm:justify-center w-full sm:w-[25%] hover:text-white"
            >
              <RiHistoryFill
                className={`sm:w-7 sm:h-7 w-16 h-16 fill-${
                  page === 2 ? "white" : "gray"
                }`}
              />
              <span
                className={`font-bold text-${
                  page === 2 ? "white" : "gray"
                } sm:ml-0 ml-4`}
              >
                히스토리
              </span>
            </div>
            <div
              onClick={() => handleChange(3)}
              className="flex sm:flex-col items-center sm:justify-center w-full sm:w-[25%] hover:text-white "
            >
              <IoIosSettings
                className={`sm:w-7 sm:h-7 w-16 h-16 fill-${
                  page === 3 ? "white" : "gray"
                }`}
              />
              <span
                className={`font-bold text-${
                  page === 3 ? "white" : "gray"
                } sm:ml-0 ml-4 `}
              >
                설정
              </span>
            </div>
          </div>
        </div>

        <div className="sm:h-[85%] overflow-y-auto scrollbar">
          {/* 사용자 추천 음악*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between">
              <span className="px-2 text-xl font-extrabold text-white">
                사용자 추천 음악
              </span>
              <Link
                to={"/recommendCharts"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none"
              >
                모두 보기
              </Link>
            </div>
            <Swiper
              spaceBetween={10}
              slidesPerView={window.innerWidth <= 450 ? 2.1 : 4.1}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {recommendData?.recommends.slice(0, 10).map((track, index) => (
                <SwiperSlide
                  style={{
                    height: window.innerWidth <= 450 ? "220px" : "300px",
                  }}
                  key={index}
                  className="bg-black hover:opacity-60"
                  onClick={() => {
                    goPlayMusic(track);
                  }}
                >
                  <img
                    src={track.album.images[0].url}
                    className=""
                    alt="Album Cover"
                  />
                  <span className="px-3 overflow-hidden text-lg font-extrabold text-white whitespace-nowrap overflow-ellipsis">
                    {track.name}
                  </span>
                  <div className="flex px-3 overflow-hidden overflow-ellipsis">
                    {track.artists.length < 3 ? (
                      track.artists.map((artist, index) => (
                        <span
                          key={index}
                          className=" text-[#93989D] font-semibold text-sm whitespace-nowrap "
                        >
                          {artist.name}
                          {index !== track.artists.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className=" text-[#93989D] font-semibold text-sm">
                        Various Artists
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 인기 가수*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between ">
              <span className="px-2 text-xl font-extrabold text-white">
                인기 가수
              </span>

              <Link
                to={"/artists"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none "
              >
                모두 보기
              </Link>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={window.innerWidth <= 450 ? 3.3 : 5.3}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {artistData?.artists.slice(0, 10).map((artist, index) => (
                <SwiperSlide
                  style={{
                    height: window.innerWidth <= 450 ? "150px" : "250px",
                  }}
                  key={index}
                  className="bg-black hover:opacity-60 "
                  onClick={() => goDetailArtist(artist)}
                >
                  <img
                    src={artist.visuals.avatar[0].url}
                    alt="Artist Cover"
                    className="p-2 "
                  />
                  <span className="pb-3 text-sm font-extrabold text-white">
                    {artist.name}
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 인기 음악*/}
          <div className="px-3 mt-4 ">
            <div className="flex items-center justify-between ">
              <span className="px-2 text-xl font-extrabold text-white">
                인기 음악
              </span>

              <Link
                to={"/charts"}
                className="font-bold text-gray-500 hover:opacity-60 text-decoration-none"
              >
                모두 보기
              </Link>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={window.innerWidth <= 450 ? 2.1 : 5.1}
              modules={[Pagination]}
              loop={true}
              className=" mySwiper"
            >
              {chartData?.tracks.slice(0, 10).map((track, index) => (
                <SwiperSlide
                  style={{
                    height: window.innerWidth <= 450 ? "220px" : "300px",
                  }}
                  key={index}
                  className="bg-black swiper-slide-mid hover:opacity-60"
                  onClick={() => {
                    goPlayMusic(track);
                  }}
                >
                  <img
                    src={track.album.images[0]?.url}
                    className="p-2"
                    alt="Album Cover"
                  />
                  <span className="px-3 overflow-hidden text-lg font-extrabold text-white whitespace-nowrap overflow-ellipsis">
                    {track.name}
                  </span>
                  <div className="flex px-3 overflow-hidden overflow-ellipsis">
                    {track.artists.length < 3 ? (
                      track.artists.map((artist, index) => (
                        <span
                          key={index}
                          className=" text-[#93989D] font-semibold text-sm whitespace-nowrap "
                        >
                          {artist.name}
                          {index !== track.artists.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className=" text-[#93989D] font-semibold text-sm">
                        Various Artists
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* <div className="bottom-0 left-0 right-0 z-10 w-full "> */}

        {/* </div> */}
      </div>
    </div>
  );
}

export default MusicHome;
