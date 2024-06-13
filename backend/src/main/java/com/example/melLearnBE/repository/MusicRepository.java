package com.example.melLearnBE.repository;

import com.example.melLearnBE.model.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MusicRepository extends JpaRepository<Music, Long> {

    Optional<Music> findByMusicId(String musicId);
}
