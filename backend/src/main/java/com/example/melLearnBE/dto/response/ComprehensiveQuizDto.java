package com.example.melLearnBE.dto.response;

import com.example.melLearnBE.dto.model.ListeningQuizDto;
import com.example.melLearnBE.dto.model.QuizListDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprehensiveQuizDto {

    private QuizListDto grammarQuiz;
    private QuizListDto vocaQuiz;
    private QuizListDto readingQuiz;
    private ListeningQuizDto listeningQuizDto;
}
