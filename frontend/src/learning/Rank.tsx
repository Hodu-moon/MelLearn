import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../api";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../css/scroll.css";
interface IMember {
  id: number;
  langType: string;
  level: string;
  levelPoint: number;
  memberId: string;
  name: string;
}
interface ScoreList {
  [key: string]: number;
}
interface IRank {
  id: number;
  musicId: string;
  score_list: ScoreList;
}

export const Rank = (): JSX.Element => {
  const location = useLocation();
  const { track } = location.state;
  const navigate = useNavigate();
  const [rank, setRank] = useState<[string, number][]>([]);

  const [member, setMember] = useState<IMember>();
  const [memberId, setMemberId] = useState<string>();

  const getRank = async () => {
    const res = await axiosApi.get(
      `/api/problem/speaking/ranking?musicId=${track.id.replace(/['"]+/g, "")}`
    );

    const entries: [string, number][] = Object.entries(res.data.score_list);

    const sortedEntries: [string, number][] = entries.sort(
      (a, b) => b[1] - a[1]
    );

    setRank(sortedEntries);
  };
  const getMember = async () => {
    const res = await axiosApi.get("/api/member/info");

    setMember(res.data);
    setMemberId(res.data.memberId);
  };

  const getIndex = () => {
    const index = rank.findIndex(([id, score]) => id === member?.memberId);

    return index;
  };

  useEffect(() => {
    getRank();
    getMember();
  }, []);
  return (
    <div className="bg-[white] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[black] overflow-hidden w-[450px] h-screen relative flex flex-col px-8 overflow-y-auto">
        <div className="flex items-center justify-between mt-4">
          <div className="w-[33%]">
            <IoIosArrowRoundBack
              onClick={() => navigate(-1)}
              className="w-10 h-10 fill-white hover:opacity-60"
            />
          </div>
          <div className="flex items-center justify-center my-4 w-[33%]">
            <span className="text-3xl font-bold text-white ">랭킹</span>
          </div>
          <div className="w-[33%]"></div>
        </div>

        <div className="flex items-center justify-center">
          <img
            className="rounded-md w-80 h-80"
            src={track.album.images[0].url}
            alt="Album Cover"
          />
        </div>
        <div className="flex justify-start mt-4">
          <span className="text-3xl font-bold text-white">{track.name}</span>
        </div>

        <div className="w-full my-4">
          <table className="bg-[#007AFF] w-full rounded-xl text-white font-bold h-28">
            <thead>
              <tr>
                <th className="p-2 w-[33%]">순위</th>
                <th className="p-2 w-[33%]">유저</th>
                <th className="p-2 w-[33%]">점수</th>
              </tr>
            </thead>
            <tbody>
              {rank.slice(0, 3).map((user, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <div className="flex items-center text-lg">
                      <span>{index + 1}</span>
                      <div className="w-8 h-8">
                        {index + 1 === 1 && "🥇"}
                        {index + 1 === 2 && "🥈"}
                        {index + 1 === 3 && "🥉"}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 ">{user[0]}</td>
                  <td className="p-2 ">{user[1].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ">
          <div className="mb-2">
            <span className="text-sm font-bold text-[#8A9A9D]">내 순위</span>
          </div>

          <table className="bg-[#007AFF] w-full rounded-xl text-white font-bold h-12 ">
            <thead>
              <tr>
                <td className="p-2  w-[33%] ">
                  <div className="flex items-center text-lg">
                    <span>{getIndex() + 1}</span>

                    <div className="w-8 h-8">
                      {getIndex() + 1 === 1 && "🥇"}
                      {getIndex() + 1 === 2 && "🥈"}
                      {getIndex() + 1 === 3 && "🥉"}
                    </div>
                  </div>
                </td>
                <td className="ml-4  w-[33%]">{member?.memberId}</td>
                <td className="px-2 w-[33%]">
                  {rank.find(([key]) => key === memberId)?.[1].toFixed(2)}
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};
