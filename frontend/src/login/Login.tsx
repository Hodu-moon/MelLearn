import { useForm } from "react-hook-form";
import axiosApi from "../api";
import BgCircle from "../components/BgCircle";
import { Link, useNavigate } from "react-router-dom";

interface Input {
  user_id: string;
  password: string;
}
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const navigate = useNavigate();
  const onSubmit = async (data: Input) => {
    const { user_id, password } = data;

    const res = await axiosApi.post("/login", {
      memberId: user_id,
      password,
    });

    const accessToken = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    navigate("/spotify");
  };

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] overflow-hidden sm:w-[450px] h-screen relative flex flex-col px-8 w-full items-center overflow-y-auto">
        <BgCircle />
        <div className="z-10 mt-24 w-[25%] sm:w-full">
          <div className="text-[#007aff] font-extrabold text-5xl whitespace-normal">
            MelLearn
          </div>
          <p className="mt-12 font-bold text-[#a39c9c] text-lg whitespace-normal">
            신나는 노래와 함께 <br />
            언어를 공부해보세요
          </p>
        </div>
        <div className="z-10 sm:w-full w-[25%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center align-middle mt-28"
          >
            <input
              {...register("user_id", { required: true })}
              placeholder="아이디"
              type="text"
              className="my-3 rounded-2xl h-12 shadow-[0px_4px_4px_#00000040] px-4 focus:outline-none focus:border-sky-500 focus:ring-2 border-none"
            />
            {errors.user_id && (
              <span className="text-center text-[red] font-bold">
                아이디를 입력해주세요
              </span>
            )}
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="비밀번호"
              className="my-3 rounded-2xl h-12 shadow-[0px_4px_4px_#00000040] px-4 focus:outline-none focus:border-sky-500 focus:ring-2 border-none"
            />
            {errors.password && (
              <span className="text-center text-[red] font-bold">
                비밀번호를 입력해주세요
              </span>
            )}
            <button className="mt-6 rounded-2xl bg-[#495867] h-12 text-[white] hover:opacity-60 font-bold flex items-center justify-center">
              로그인
            </button>
          </form>
          <div className="z-10 flex flex-col w-full mt-24 text-center">
            <span className="text-[#232121] text-[15px] font-bold mb-4 ">
              아직 회원이 아니시라구요?
            </span>
            <div className="flex items-center justify-center w-full">
              <div className=" h-[2px] bg-white w-[33%]"></div>
              <Link
                to="/join"
                className="text-[#007AFF] font-bold mx-2 hover:opacity-60 text-decoration-none w-[20%] whitespace-nowrap"
              >
                회원가입
              </Link>
              <div className="w-[33%] h-[2px]  bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
