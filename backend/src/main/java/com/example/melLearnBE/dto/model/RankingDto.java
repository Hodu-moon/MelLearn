package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.model.Ranking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingDto {

    private Long id;
    private String musicId;
    private Map<String, Double> score_list;

    public RankingDto(Ranking ranking) {
        this.id = ranking.getId();
        this.musicId = ranking.getMusicId();
        this.score_list = Map.copyOf(ranking.getScore_list());
    }
}