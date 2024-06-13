interface Comment {
  id: number;
  quizList: {
    id: number;
    level: number;
    musicId: string;
    quizzes: {
      answer: number;
      comment: string;
      correctRate: number;
      id: number;
      optionList: string[];
      question: string;
    }[];
  };
  submitAnswerList: number[];
}
interface IComment {
  comments: Comment;
}
interface CommentQuiz {
  answer: number;
  comment: string;
  correctRate: number;
  id: number;
  optionList: string[];
  question: string;
}

function Comments({ comments }: IComment) {
  return (
    <div className="font-[roboto]">
      {comments?.quizList?.quizzes.map((quiz: CommentQuiz, index: number) => (
        <div
          key={index}
          className="mb-8 bg-white w-[92%] h-[40%] rounded-3xl p-3"
        >
          <div className="flex items-center justify-between">
            {/* 문제 표시 */}
            <span
              className={`text-3xl font-extrabold text-[${
                quiz.answer === comments.submitAnswerList[index]
                  ? "#007AFF"
                  : "red"
              }]`}
            >
              Q{index + 1}.
            </span>
            <span className="text-sm text-gray-400">
              정답률{" "}
              {!isNaN(Number(quiz.correctRate))
                ? quiz.correctRate.toFixed(2) + "%"
                : "없음"}
            </span>
          </div>

          <div className="flex flex-col mt-2">
            <span className="mb-3 text-xl font-bold">
              {quiz.question.includes("_____") ? (
                <>
                  {quiz.question.split("_____")[0]}
                  <span
                    className={`text-[${
                      quiz.answer === comments.submitAnswerList[index]
                        ? "#007AFF"
                        : "red"
                    }]`}
                  >
                    {quiz.optionList[quiz.answer - 1]?.replace(/\d+\./g, "")}
                  </span>
                  {quiz.question.split("_____")[1]}
                </>
              ) : (
                quiz.question
              )}
            </span>
            <div className="flex justify-center mt-2 border border-black  shadow-[0px_4px_4px_#00000040] rounded-md items-center py-1">
              <span className="mr-2 font-bold whitespace-nowrap">
                사용자 답안:{" "}
              </span>
              <span
                className={`font-extrabold  text-[${
                  quiz.answer === comments.submitAnswerList[index]
                    ? "#007AFF"
                    : "red"
                }]`}
              >
                {quiz.optionList[comments.submitAnswerList[index] - 1]?.replace(
                  /\d+\./g,
                  ""
                )}
              </span>
            </div>

            {/* Comment */}
            <div className="mt-2">
              <span className="text-lg font-extrabold ">Note:</span>
              <p className="px-1 text-[9px] text-gray-500 text-sm font-bold">
                {quiz.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;
