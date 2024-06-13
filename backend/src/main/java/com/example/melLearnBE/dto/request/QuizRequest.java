package com.example.melLearnBE.dto.request;

import com.example.melLearnBE.enums.QuizType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizRequest {

    private String musicId;
    private QuizType quizType;
    private String lyric;
}
