package com.example.melLearnBE.repository;

import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.model.ListeningQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListeningQuizRepository extends JpaRepository<ListeningQuiz, Long> {
    Optional<ListeningQuiz> findByMusicIdAndLevel(String musicId, LearningLevel level);
}
