package com.example.melLearnBE.repository;

import com.example.melLearnBE.model.WordList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordListRepository extends JpaRepository<WordList, Long> {
}
