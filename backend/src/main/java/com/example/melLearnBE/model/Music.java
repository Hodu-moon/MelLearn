package com.example.melLearnBE.model;

import com.example.melLearnBE.enums.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Music {

    @Id @GeneratedValue
    private Long id;
    private String musicId;
    @Enumerated(value = EnumType.ORDINAL)
    private Language language;
    private int liked;
    private int disLike;

    private boolean checkCategoryAvailable;
    private boolean speaking;
    private boolean grammar;
    private boolean listening;
    private boolean reading;
    private boolean vocabulary;
}
