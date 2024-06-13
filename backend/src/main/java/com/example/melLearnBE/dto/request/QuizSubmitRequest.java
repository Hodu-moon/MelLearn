package com.example.melLearnBE.dto.request;

import com.example.melLearnBE.enums.QuizType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitRequest {

    private String musicId;
    private QuizType quizType;
    private List<Integer> answers;
}
