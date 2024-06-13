import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axiosApi, { axiosSpotify, axiosSpotifyScraper } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../css/scroll.css";
import { useQuery } from "react-query";
import { FaPlay } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import Spinner from "react-bootstrap/Spinner";

interface SearchTrack {
  items: {
    album: {
      images: {
        url: string;
      }[];
    };
    artists: {
      id: string;
      name: string;
    }[];
    is_playable: boolean;
    name: string;
    type: string;
    uri: string;
    duration_ms: number;
  }[];
}

export const SearchMusic = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getArtistAlbum = async (search: string) => {
    const response = await axiosSpotify.get(`/search?q=${search}&type=track`);
    return response.data.tracks;
  };
  const {
    data: tracks,
    isLoading,
    refetch,
  } = useQuery<SearchTrack>(
    ["artistAlbums", search],
    () => getArtistAlbum(search),
    {
      enabled: false, // 초기에는 비활성화
    }
  );
  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 동작 중지
    // Search 요청 을 보낸다.
    refetch();
  };

  const goPlayMusic = (track: any) => {
    navigate("/playMusic", {
      state: {
        track,
      },
    });
  };
  const goStudy = async (track: any) => {
    const res1 = await axiosSpotifyScraper.get(
      `/track/lyrics?trackId=${track.id}&format=json`
    );
    const res2 = await axiosApi.post(
      `/api/support/quiz/category/${track.id}`,
      res1.data
    );
    const { grammar, vocabulary, reading } = res2.data;

    if (grammar && vocabulary && reading) {
      navigate("/category", {
        state: {
          track,
        },
      });
    } else {
      alert("지원하지 않는 언어입니다.");
    }
  };

  return (
    <div className="flex justify-center w-full h-screen font-[roboto]">
      <div
        className={`flex flex-col items-center w-full bg-[black]  px-8 py-12 `}
      >
        {/* 검색 창 */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between w-full px-2"
        >
          <div className="flex items-center justify-center w-full rounded-md ">
            <input
              value={search}
              onChange={onChangeInput}
              className="bg-[#282828] rounded-md h-10 p-3 sm:w-[85%] w-[55%] text-[white] "
              placeholder="노래를 검색해주세요"
            />

            <Link to={"/home"} className="text-decoration-none">
              <span className="ml-4 text-white sm:ml-2 text-md hover:opacity-60">
                취소
              </span>
            </Link>
          </div>
        </form>

        {/* 검색한 가수 앨범 목록*/}
        <div className="flex flex-col items-center w-full px-2 mt-8 overflow-y-auto scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full px-3 py-4 bg-black">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            tracks?.items
              .filter((track) => track.is_playable)
              .map((track, index) => (
                <div
                  key={index}
                  className=" rounded-2xl bg-[#282828]  sm:h-40 h-56 mb-4 sm:w-full w-[60%]"
                >
                  <div className="flex items-center p-4 ">
                    <img
                      src={track.album.images[2].url}
                      alt="Album Cover"
                      className="w-32 h-32 rounded-md sm:w-16 sm:h-16"
                    />
                    <div className="flex flex-col justify-between ml-4 ">
                      <span className="text-bold text-[white] sm:text-md">
                        {track.name.length > 30
                          ? `${track.name.slice(0, 25)}...`
                          : track.name}
                      </span>
                      <span className="text-[#B3B3B3] text-sm font-semibold">
                        {track.artists[0].name}
                      </span>
                      <span className="text-[#B3B3B3] sm:text-sm">
                        {Math.floor(track.duration_ms / 1000 / 60)}:
                        {Math.floor((track.duration_ms / 1000) % 60) < 10
                          ? `0${Math.floor((track.duration_ms / 1000) % 60)}`
                          : Math.floor((track.duration_ms / 1000) % 60)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between px-4 mb-4">
                    <button
                      onClick={() => goPlayMusic(track)}
                      className="bg-[white] w-28 rounded-2xl h-8 hover:opacity-60 flex items-center justify-center"
                    >
                      <FaPlay className="mr-2" />
                      <span className="font-bold">재생</span>
                    </button>
                    <button
                      onClick={() => goStudy(track)}
                      className="bg-[white] w-28 rounded-2xl h-8 hover:opacity-60 flex items-center justify-center"
                    >
                      <LuPencilLine className="mr-2 fill-black" />
                      <span className="font-bold">학습</span>
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
