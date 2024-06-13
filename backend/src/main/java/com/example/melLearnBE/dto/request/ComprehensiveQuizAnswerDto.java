package com.example.melLearnBE.dto.request;

import com.example.melLearnBE.dto.model.ListeningSubmitDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.model.SpeakingSubmitDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprehensiveQuizAnswerDto {

    private ListeningSubmitDto listeningSubmit;
    private SpeakingSubmitDto speakingSubmit;
    private QuizSubmitDto vocabularySubmit;
    private QuizSubmitDto readingSubmit;
    private QuizSubmitDto grammarSubmit;
}
