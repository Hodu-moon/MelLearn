package com.example.melLearnBE.util;

import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.enums.DetailedPromptInstruction;
import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.model.Member;
import org.springframework.stereotype.Component;

@Component
public class PromptDetailUtil {

    public String get(Member member, QuizRequest quizRequest) {
        QuizType quizType = quizRequest.getQuizType();
        LearningLevel level = member.getLevel();
        StringBuilder promptDetail = new StringBuilder();

        promptDetail.append(DetailedPromptInstruction.COMMON.getDetail());

        if (quizType.equals(QuizType.LISTENING)) {
            return getListeningPromptDetails(level, promptDetail);
        }

        else if (quizType.equals(QuizType.READING) || quizType.equals(QuizType.VOCABULARY)) {
            return getQuizPromptDetails(member, level, promptDetail);
        }

        return promptDetail.toString();
    }

    private static String getQuizPromptDetails(Member member, LearningLevel level, StringBuilder promptDetail) {
        if(level.equals(LearningLevel.Beginner)) {
            promptDetail.append(DetailedPromptInstruction.READING_OPTIONLIST_LANG_LEVEL1.getDetail() + "\n");
        } else {
            promptDetail.append(DetailedPromptInstruction.READING_OPTIONLIST_LANG_TYPE.getDetail() + " " + member.getLangType().toString() + ".\n");
        }

        if(level.equals(LearningLevel.Intermediate)) {
            promptDetail.append(DetailedPromptInstruction.READING_OPTIONLIST_LANG_LEVEL2.getDetail());
        } else if(level.equals(LearningLevel.Advanced)) {
            promptDetail.append(DetailedPromptInstruction.READING_OPTIONLIST_LANG_LEVEL3.getDetail());
        }

        return promptDetail.toString();
    }

    private static String getListeningPromptDetails(LearningLevel level, StringBuilder promptDetail) {
        if(level.equals(LearningLevel.Beginner)) {
            promptDetail.append(DetailedPromptInstruction.LISTENING_LEVEL1.getDetail());
        } else if (level.equals(LearningLevel.Intermediate)) {
            promptDetail.append(DetailedPromptInstruction.LISTENING_LEVEL2.getDetail());
        } else if (level.equals(LearningLevel.Advanced)) {
            promptDetail.append(DetailedPromptInstruction.LISTENING_LEVEL3.getDetail());
        }
        return promptDetail.toString();
    }
}
