package com.example.melLearnBE.service;

import com.example.melLearnBE.dto.model.MusicDto;
import com.example.melLearnBE.dto.request.LrcLyric;
import com.example.melLearnBE.dto.response.naverCloud.DetectLang;
import com.example.melLearnBE.enums.Language;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.jwt.JwtTokenProvider;
import com.example.melLearnBE.model.Member;
import com.example.melLearnBE.model.Music;
import com.example.melLearnBE.openFeign.naverCloudClient.NaverCloudClient;
import com.example.melLearnBE.repository.MusicRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final NaverCloudClient naverCloudClient;
    private final JwtTokenProvider jwtTokenProvider;
    private final MusicRepository musicRepository;
    private static final int MAX_CHAR_SIZE = 100;

    public List<String> getSupportLang() {
        List<Language> langList = Arrays.stream(Language.values()).toList();
        ArrayList<String> isoList = new ArrayList<>();
        for (Language language : langList) {
            isoList.add(language.getIso639Value());
        }

        return isoList;
    }

    public MusicDto getSupportQuizCategory(String musicId, List<LrcLyric> lrcLyrics, HttpServletRequest request) {
        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Music music = new Music();
        Optional<Music> optionalMusic = musicRepository.findByMusicId(musicId);
        if (optionalMusic.isPresent()) {
            music = optionalMusic.get();
            if(music.isCheckCategoryAvailable()) {
                return new MusicDto(optionalMusic.get());
            }
        }

        boolean listening = false;
        boolean speaking = false;
        boolean reading = false;
        boolean grammar = false;
        boolean vocabulary = false;

        String pureLyric = getPureLyric(lrcLyrics);

        if(StringUtils.hasText(pureLyric)) {
            String truncateLyric = truncateLyricByCharLimit(pureLyric);
            DetectLang language = naverCloudClient.detectLanguage(truncateLyric);
            if (member.getLangType().getIso639Value().equals(language.getLangCode())) {
                listening = true;
                reading = true;
                grammar = true;
                vocabulary = true;
            }

            // lrc 포맷인지 체크
            if (lrcLyrics.size() != 0) {
                LrcLyric lrcLyric = lrcLyrics.get(0);
                if (lrcLyric.getDurMs() != 0) {
                    speaking = true;
                }
            }
        }

        if(optionalMusic.isPresent()) {
            music.setCheckCategoryAvailable(true);
            music.setListening(listening);
            music.setGrammar(grammar);
            music.setSpeaking(speaking);
            music.setReading(reading);
            music.setVocabulary(vocabulary);
        }

        else {
            music = Music.builder()
                    .musicId(musicId)
                    .grammar(grammar)
                    .language(member.getLangType())
                    .speaking(speaking)
                    .listening(listening)
                    .vocabulary(vocabulary)
                    .reading(reading)
                    .checkCategoryAvailable(true)
                    .build();
        }


        return new MusicDto(musicRepository.save(music));
    }

    private String truncateLyricByCharLimit(String lyric) {
        int charCount = lyric.length();

        if (charCount > MAX_CHAR_SIZE) {
            return lyric.substring(0, MAX_CHAR_SIZE);
        }
        return lyric;
    }


    private String getPureLyric(List<LrcLyric> lrcLyrics) {
        StringBuilder stringBuilder = new StringBuilder();

        for (LrcLyric lrcLyric : lrcLyrics) {
            stringBuilder.append(lrcLyric.getText());
        }

        return stringBuilder.toString();
    }

}
