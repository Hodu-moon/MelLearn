package com.example.melLearnBE.repository;

import com.example.melLearnBE.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, JpaRepository> {
}
