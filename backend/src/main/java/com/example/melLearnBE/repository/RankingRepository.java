package com.example.melLearnBE.repository;

import com.example.melLearnBE.model.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RankingRepository extends JpaRepository<Ranking, Long> {

    Optional<Ranking> findByMusicId(String musicId);
}
