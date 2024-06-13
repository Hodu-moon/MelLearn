package com.example.melLearnBE.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum LearningLevel {

    Beginner(1),
    Intermediate(2),
    Advanced(3),

    ;
    private final int value;
}