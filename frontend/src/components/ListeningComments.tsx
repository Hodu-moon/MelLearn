interface ListeningComment {
  listeningQuiz: {
    blankedText: string;
    answerList: string[];
  };
  submitAnswerList: string[];
}
interface IListeningComment {
  comments: ListeningComment;
}
function ListeningComments({ comments }: IListeningComment) {
  return (
    <div className="h-full ">
      <div className="text-2xl font-bold text-black">
        {comments.listeningQuiz.blankedText
          .replaceAll(/\[\d{2}:\d{2}\.\d{2}\]/g, "")
          .split("__")
          .map((part: string, index: number) => {
            if (index < comments.listeningQuiz.answerList.length) {
              return (
                <span key={index} className="">
                  <span className="text-2xl">{part}</span>
                  <span
                    className={`text-2xl ${
                      comments.listeningQuiz.answerList[index] ===
                      comments.submitAnswerList[index]
                        ? "text-blue-500" // 같을 때는 파란색
                        : "text-red-500" // 다를 때는 빨간색
                    }`}
                  >
                    {comments.listeningQuiz.answerList[index]}
                  </span>
                </span>
              );
            } else {
              return (
                <span className="" key={index}>
                  {part.replace(/\[\d+:\d+\.\d+\]/, "")}
                </span>
              );
            }
          })}
      </div>
    </div>
  );
}

export default ListeningComments;
