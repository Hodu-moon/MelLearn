import React from "react";

interface SpeakingComment {
  markedText: string;
  submit: string;
}

interface ISpeakingComment {
  comments: SpeakingComment;
}

function SpeakingComments({ comments }: ISpeakingComment) {
  const formatText = (text: string) => {
    return text.split("\n").map((sentence, index) => (
      <div key={index} className="sentence">
        {sentence.split(" ").map((word, wordIndex) => {
          if (word) {
            if (word.startsWith("__")) {
              return (
                <span
                  key={wordIndex}
                  className="text-red-600 whitespace-nowrap"
                >
                  {word.replace(/__/g, "")}{" "}
                </span>
              );
            } else {
              return <span key={wordIndex}>{word} </span>;
            }
          }
          return null;
        })}
      </div>
    ));
  };

  return (
    <div className="w-full h-[90%] mb-8 text-2xl overflow-y-auto">
      {formatText(comments.markedText)}
    </div>
  );
}

export default SpeakingComments;
