import React from "react";

interface Submission {
  title: string;
  submissions: string[] | number[];
}
const MockSubmitDisplay: React.FC<Submission> = ({ title, submissions }) => {
  const getIndex = (index: number) => {
    switch (title) {
      case "Grammar":
        return index + 1;
      case "Reading":
        return index + 6;
      case "Vocabulary":
        return index + 11;
      case "Listening":
        return index + 16;
    }
  };

  return (
    <div className="font-[roboto]">
      <span className="text-xl font-bold">{title}</span>
      <div className="p-2 bg-white rounded-lg shadow-[0px_4px_4px_#00000040]">
        {submissions.map((answer, index) => (
          <div key={index} className="flex ">
            <span className="font-bold">{getIndex(index)}. </span>
            <span className="ml-2">{answer === 0 ? "" : answer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockSubmitDisplay;
