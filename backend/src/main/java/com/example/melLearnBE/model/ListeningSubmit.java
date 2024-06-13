package com.example.melLearnBE.model;

import com.example.melLearnBE.enums.LearningLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class ListeningSubmit {

    @Id
    @GeneratedValue
    private Long id;
    @Enumerated(value = EnumType.ORDINAL)
    private LearningLevel level;

    @ManyToOne
    private Member member;

    @ManyToOne
    private ListeningQuiz listeningQuiz;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<String> submitAnswerList = new ArrayList<>();

    private double score;
    @CreationTimestamp
    private LocalDateTime createdTime;
}