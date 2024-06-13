package com.example.melLearnBE.service;

import com.example.melLearnBE.dto.model.RankingDto;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.jwt.JwtTokenProvider;
import com.example.melLearnBE.model.SpeakingSubmit;
import com.example.melLearnBE.model.Member;
import com.example.melLearnBE.model.Ranking;
import com.example.melLearnBE.repository.SpeakingSubmitRepository;
import com.example.melLearnBE.repository.RankingRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final RankingRepository rankingRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SpeakingSubmitRepository speakingSubmitRepository;
    @Transactional
    public RankingDto updateRanking(String musicId, HttpServletRequest request) {
        Optional<Ranking> optionalRanking = rankingRepository.findByMusicId(musicId);
        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        SpeakingSubmit speakingSubmit = speakingSubmitRepository.findTopByMusicIdAndMemberOrderByScoreDesc(musicId, member).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Ranking ranking;
        if(optionalRanking.isPresent()) {
            ranking = optionalRanking.get();
        } else {
            ranking = Ranking.builder()
                    .score_list(new HashMap<>())
                    .musicId(musicId)
                    .build();
        }

        Map<String, Double> scoreList = ranking.getScore_list();
        scoreList.put(member.getMemberId(), speakingSubmit.getScore());

        return new RankingDto(rankingRepository.save(ranking));
    }

    @Transactional(readOnly = true)
    public RankingDto getRanking(String musicId) {

        Optional<Ranking> optionalRanking = rankingRepository.findByMusicId(musicId);
        if(optionalRanking.isEmpty()) {
            return new RankingDto();
        }

        Ranking ranking = optionalRanking.get();
        return new RankingDto(ranking);
    }
}
