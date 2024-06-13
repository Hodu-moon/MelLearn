package com.example.melLearnBE.repository;

import com.example.melLearnBE.model.SpeakingSubmit;
import com.example.melLearnBE.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SpeakingSubmitRepository extends JpaRepository<SpeakingSubmit, Long> {

    @Query("SELECT ss FROM SpeakingSubmit ss WHERE ss.musicId = :musicId AND ss.member = :member ORDER BY ss.score DESC")
    Optional<SpeakingSubmit> findTopByMusicIdAndMemberOrderByScoreDesc(String musicId, Member member);
}
