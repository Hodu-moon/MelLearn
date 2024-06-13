import BgCircle from "../components/BgCircle";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosApi from "../api";

interface Input {
  username: string;
  user_id: string;
  password: string;
  confirmPassword: string; //비밀번호 확인용 전송 x
}

function Join() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<Input>();
  const goLogin = () => {
    navigate("/");
  };
  const onSubmit = async (data: Input) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
    } else {
      const { username, user_id, password } = data;
      setValue("username", "");
      setValue("user_id", "");
      setValue("password", "");
      setValue("confirmPassword", "");
      const res = await axiosApi.post("/join", {
        name: username,
        memberId: user_id,
        password,
      });

      if (res.status === 200) {
        //회원가입 성공한 경우
        goLogin();
      }
    }
  };

  return (
    <div className="bg-[#9bd1e5] flex flex-row justify-center w-full h-screen font-[roboto]">
      <div className="bg-[#9bd1e5] overflow-hidden sm:w-[450px] w-full h-screen relative flex flex-col px-8 items-center overflow-y-auto">
        <BgCircle />

        <div className="z-10 flex flex-col items-start justify-between mt-12 sm:w-full w-[25%]">
          <IoIosArrowRoundBack
            onClick={goLogin}
            className="w-10 h-10 fill-black hover:opacity-50"
          />
          <span className=" mt-28 text-3xl text-[#007AFF] font-extrabold ">
            회원가입
          </span>
        </div>

        <div className="z-10 sm:w-full w-[25%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="z-10 flex flex-col justify-center mt-8 align-middle"
          >
            <input
              {...register("username", { required: true })}
              placeholder="이름"
              type="text"
              className="mb-3 border-none rounded-2xl h-12 shadow-[0px_4px_4px_#00000040] px-4  focus:outline-none focus:border-sky-500 focus:ring-2"
            />
            {errors.username && (
              <span className="text-center text-[red] font-bold">
                이름을 입력해주세요
              </span>
            )}
            <input
              {...register("user_id", { required: true })}
              placeholder="아이디"
              type="text"
              className="my-3 rounded-2xl border-none h-12 shadow-[0px_4px_4px_#00000040] px-4  focus:outline-none focus:border-sky-500 focus:ring-2"
            />
            {errors.user_id && (
              <span className="text-center text-[red] font-bold">
                아이디를 입력해주세요
              </span>
            )}

            <input
              {...register("password", { required: true })}
              placeholder="비밀번호"
              type="password"
              className="my-3 rounded-2xl h-12 border-none shadow-[0px_4px_4px_#00000040] px-4  focus:outline-none focus:border-sky-500 focus:ring-2"
            />
            {errors.password && (
              <span className="text-center text-[red] font-bold">
                비밀번호를 입력해주세요
              </span>
            )}

            <input
              {...register("confirmPassword", { required: true })}
              placeholder="비밀번호 확인"
              type="password"
              className="my-3 rounded-2xl h-12 border-none shadow-[0px_4px_4px_#00000040] px-4  focus:outline-none focus:border-sky-500 focus:ring-2"
            />

            {errors.confirmPassword && (
              <span className="text-center text-[red] font-bold">
                {errors.confirmPassword.type === "manual"
                  ? "비밀번호가 일치하지 않습니다"
                  : "비밀번호를 한번더 입력해 주세요"}
              </span>
            )}

            <button className="mt-6 rounded-2xl  bg-[#495867] h-12 text-[white] hover:bg-[gray] hover:text-[#495867] font-bold ">
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Join;
