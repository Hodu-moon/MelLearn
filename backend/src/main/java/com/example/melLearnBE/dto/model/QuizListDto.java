package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.model.Quiz;
import com.example.melLearnBE.model.QuizList;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizListDto {

    private Long id;
    private List<QuizDto> quizzes;
    @Column(unique = true)
    private String musicId;
    private int level;
    private LocalDateTime createdTime;

    public QuizListDto(QuizList quizList) {
        this.id = quizList.getId();
        quizzes = new ArrayList<>();
        for (Quiz quiz : quizList.getQuizzes()) {
            quizzes.add(new QuizDto(quiz));
        }
        this.musicId = quizList.getMusicId();
        this.level = quizList.getLevel().getValue();
        this.createdTime = quizList.getCreatedTime();
    }
}
