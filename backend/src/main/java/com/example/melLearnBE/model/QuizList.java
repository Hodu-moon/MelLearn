package com.example.melLearnBE.model;

import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.enums.QuizType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "quiz_list", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"music_id", "level", "quiz_type"})
})
public class QuizList {
    @Id @GeneratedValue
    private Long id;
    @Enumerated(value = EnumType.ORDINAL)
    private QuizType quizType;
    @Enumerated(value = EnumType.ORDINAL)
    private LearningLevel level;
    @OneToMany(mappedBy = "quizList", cascade = CascadeType.ALL)
    private List<Quiz> quizzes;
    @OneToMany(mappedBy = "quizList", cascade = CascadeType.ALL)
    private List<QuizSubmit> submitList;
    private String musicId;
    @CreationTimestamp
    private LocalDateTime createdTime;
}
