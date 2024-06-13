package com.example.melLearnBE.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Quiz {
    @Id @GeneratedValue
    private Long id;
    @Column(columnDefinition="LONGTEXT")
    private String question;
    private String word;
    @ElementCollection
    @Builder.Default
    private List<String> optionList = new ArrayList<>(4);
    private int answer;
    @Column(columnDefinition="LONGTEXT")
    private String comment;
    @ManyToOne
    private QuizList quizList;
    private int submitCount;
    private int correctCount;
}