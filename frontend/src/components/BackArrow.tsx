import { IoIosArrowRoundBack } from "react-icons/io";

function BackArrow() {
  return (
    <div className="relative z-10 w-12 h-12 px-0 mt-8 hover:text-gray-300">
      <IoIosArrowRoundBack className="absolute top-0 w-full h-full right-2" />
    </div>
  );
}

export default BackArrow;
