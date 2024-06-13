package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.model.Member;
import com.example.melLearnBE.model.QuizList;
import com.example.melLearnBE.model.QuizSubmit;
import com.querydsl.core.annotations.QueryProjection;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
public class QuizSubmitDto {


    private Long id;
    private QuizListDto quizList;
    private List<Integer> submitAnswerList;
    private double score;
    private LocalDateTime createdTime;

    public QuizSubmitDto(QuizSubmit quizSubmit) {
        this.id = quizSubmit.getId();
        this.quizList = new QuizListDto(quizSubmit.getQuizList());
        this.submitAnswerList = quizSubmit.getSubmitAnswerList();
        this.score = quizSubmit.getScore();
        this.createdTime = quizSubmit.getCreatedTime();
    }

    @QueryProjection
    public QuizSubmitDto(Long id, QuizListDto quizList, List<Integer> submitAnswerList, double score, LocalDateTime createdTime) {
        this.id = id;
        this.quizList = quizList;
        this.submitAnswerList = List.copyOf(submitAnswerList);
        this.score = score;
        this.createdTime = createdTime;
    }
}
