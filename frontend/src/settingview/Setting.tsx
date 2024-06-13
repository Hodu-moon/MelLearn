import React, { useEffect, useState } from "react";
import { ProgressBar, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import axiosApi from "../api";
import { useNavigate } from "react-router-dom";
interface Member {
  id: number;
  langType: string;
  level: string;
  levelPoint: number;
  memberId: string;
  name: string;
}

export const Setting = (): JSX.Element => {
  const [member, setMember] = useState<Member>(); //멤버 정보 데이터
  const [languages, setLanguages] = useState<string[]>(); //언어 정보
  const [langauge, setLanguage] = useState<string>("en"); // 지원하는 언어 정보 (default en)
  const [level, setLevel] = useState<string>("초급");
  const [point, setPoint] = useState<number>();
  const [img, setImg] = useState<string>();

  const navigation = useNavigate();

  // 멤버 정보 조회
  const getMember = async () => {
    const res = await axiosApi.get("/api/member/info");
    if (res.status === 200) {
      setMember(res.data);
    }
  };

  // 지원 언어 조회
  const getLanguage = async () => {
    const res = await axiosApi.get("/api/support/language");
    if (res.status === 200) {
      setLanguages(res.data);
    }
  };

  //언어 선택 후 변경된 정보 전송
  const selectLanguage = async (eventKey: any, event: Object) => {
    const res = await axiosApi.put("/api/member/info", {
      langType: eventKey,
    });

    if (res.status === 200) {
      setMember(res.data);
      setLanguage(eventKey);
    }
  };
  const selectLevel = async (eventKey: any, event: Object) => {
    const res = await axiosApi.put("/api/member/info", {
      level: eventKey,
    });
    if (res.status === 200) {
      setMember(res.data);
      setLevel(res.data.level);
    }
  };

  const remainPoint = () => {
    switch (member?.level) {
      case "Beginner":
        setPoint(1000 - member?.levelPoint);
        break;
      case "Intermediate":
        setPoint(2000 - member?.levelPoint);
        break;
      case "Advanced":
        setPoint(3000 - member?.levelPoint);
        break;
    }
  };
  const getImg = () => {
    switch (member?.level) {
      case "Beginner":
        setImg("/diamond/Diamond_1.png");
        break;
      case "Intermediate":
        setImg("/diamond/Diamond_2.png");
        break;
      case "Advanced":
        setImg("/diamond/Diamond_3.png");
        break;
      default:
        setImg("/diamond/Diamond_1.png");
        break;
    }
  };

  const goHome = () => {
    navigation("/home");
  };
  const getLevel = (level: string | undefined) => {
    switch (level) {
      case "Beginner":
        return "초급";
      case "Intermediate":
        return "중급";
      case "Advanced":
        return "고급";
      default:
        return "초급";
    }
  };

  useEffect(() => {
    getMember(); // 멤버 정보 불러오기
    getLanguage(); // 지원 언어 조회
  }, []);
  useEffect(() => {
    if (member) {
      remainPoint(); // 다음 레벨까지 잔여 포인트
      getImg(); // 레벨에 해당하는 이미지
    }
  }, [member]);

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-white overflow-hidden w-full sm:w-[450px] h-screen relative flex flex-col px-8 overflow-y-auto">
        <div className="z-10 mt-8 hover:text-gray-300">
          <IoIosArrowRoundBack onClick={goHome} className="w-10 h-10 right-2" />
        </div>
        {/** 아이콘 타이틀 */}

        <div className="flex flex-col items-center justify-start ">
          <div className="p-0 w-60 h-60 ">
            <img src={img} alt="Dia" />
          </div>
          <span className="font-bold text-[24px]">{member?.name}</span>
        </div>

        {/** Level */}
        {/** member point -> Beginner -> 1000 - levelPoint Intermediate -> 2000 - levelPoint Advanced -> 3000 - levelPoint  */}

        <div className="flex flex-col">
          <span className="font-bold text-[30px] mb-2 ">{member?.level}</span>
          <span className="text-[#0000004c] font-bold text-lg">
            {point} points to next level
          </span>
        </div>

        <div className="mt-8">
          <ProgressBar
            variant="warning"
            now={((member?.levelPoint ?? 0) / 1000) * 100}
            label={`⭐️${member?.levelPoint}/${point}`}
            style={{
              height: "28px",
              borderRadius: "24px",
              fontSize: "15px",
              fontWeight: "bold",
              color: "black",
            }}
          />
        </div>

        {/** 환경 설정 */}

        <div className="mt-20">
          <span className="font-bold text-[#0000004c] text-sm">환경설정</span>
          <hr className="object-cover mt-1 mb-3 border-2" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">학습 언어</span>
            {/* 언어 설정 drop down */}
            <Navbar>
              <Nav variant="dark">
                <NavDropdown title={member?.langType} onSelect={selectLanguage}>
                  {languages &&
                    languages.map((lang: string, index: number) => (
                      <NavDropdown.Item key={index} eventKey={lang}>
                        {lang}
                      </NavDropdown.Item>
                    ))}
                </NavDropdown>
              </Nav>
            </Navbar>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">난이도</span>
            {/* 난이도 설정 drop down */}
            <Navbar>
              <Nav variant="dark">
                <NavDropdown
                  title={getLevel(member?.level)}
                  onSelect={selectLevel}
                >
                  <NavDropdown.Item eventKey="Beginner">초급</NavDropdown.Item>
                  <NavDropdown.Item eventKey="Intermediate">
                    중급
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey="Advanced">고급</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar>
          </div>
        </div>

        <div className="flex items-center justify-center mt-16">
          <img src="/spotify/Spotify.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Setting;
