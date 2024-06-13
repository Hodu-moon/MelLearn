package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.model.ListeningSubmit;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ListeningSubmitDto {

    private Long id;
    private ListeningQuizDto listeningQuiz;
    private LearningLevel level;
    private List<String> submitAnswerList = new ArrayList<>();
    private double score;
    private LocalDateTime createdTime;

    public ListeningSubmitDto(ListeningSubmit listeningSubmit) {
        this.id = listeningSubmit.getId();
        this.listeningQuiz = new ListeningQuizDto(listeningSubmit.getListeningQuiz());
        this.level = listeningSubmit.getLevel();
        this.submitAnswerList = listeningSubmit.getSubmitAnswerList();
        this.score = listeningSubmit.getScore();
        this.createdTime = listeningSubmit.getCreatedTime();
    }

    @QueryProjection
    public ListeningSubmitDto(Long id, ListeningQuizDto listeningQuiz, LearningLevel level, List<String> submitAnswerList, double score, LocalDateTime createdTime) {
        this.id = id;
        this.listeningQuiz = listeningQuiz;
        this.level = level;
        this.submitAnswerList = List.copyOf(submitAnswerList);
        this.score = score;
        this.createdTime = createdTime;
    }
}