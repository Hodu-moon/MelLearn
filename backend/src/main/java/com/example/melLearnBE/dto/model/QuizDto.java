package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.model.Quiz;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {

    private Long id;
    private String question;
    private List<String> optionList;
    private int answer;
    private String comment;
    private double correctRate;
    public QuizDto(Quiz quiz) {
        this.id = quiz.getId();
        this.question = quiz.getQuestion();
        this.optionList = List.copyOf(quiz.getOptionList());
        this.answer = quiz.getAnswer();
        this.comment = quiz.getComment();
        this.correctRate = ((double) quiz.getCorrectCount() / (double) quiz.getSubmitCount()) * 100.0;
    }
}
