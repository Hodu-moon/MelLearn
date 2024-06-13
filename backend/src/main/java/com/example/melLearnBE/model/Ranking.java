package com.example.melLearnBE.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Ranking {

    @Id @GeneratedValue
    private Long id;
    private String musicId;
    @ElementCollection
    @CollectionTable(
            name = "score_list",
            joinColumns = @JoinColumn(name = "musicId")
    )
    @MapKeyColumn(name = "memberId")
    @Column(name = "score")
    @Builder.Default
    private Map<String, Double> score_list = new HashMap<>();
}
