package com.example.melLearnBE.dto.response;

import com.example.melLearnBE.dto.model.ListeningQuizDto;
import com.example.melLearnBE.dto.model.QuizListDto;
import com.example.melLearnBE.dto.request.ComprehensiveQuizAnswerDto;
import com.example.melLearnBE.enums.LearningLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComprehensiveQuizSubmitDto {

    private String musicId;
    private LearningLevel level;
    private ComprehensiveQuizAnswerDto comprehensiveQuizAnswer;
}
