package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.enums.Language;
import com.example.melLearnBE.model.Music;
import com.example.melLearnBE.repository.MusicRepository;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MusicDto {

    private Long id;
    private String musicId;
    private Language language;
    private int liked;
    private int disLike;
    private boolean speaking;
    private boolean grammar;
    private boolean listening;
    private boolean reading;
    private boolean vocabulary;

    public MusicDto(Music music) {
        this.id = music.getId();
        this.musicId = music.getMusicId();
        this.language = music.getLanguage();
        this.liked = music.getLiked();
        this.disLike = music.getDisLike();
        this.speaking = music.isSpeaking();
        this.grammar = music.isGrammar();
        this.listening = music.isListening();
        this.reading = music.isReading();
        this.vocabulary = music.isVocabulary();
    }
}
