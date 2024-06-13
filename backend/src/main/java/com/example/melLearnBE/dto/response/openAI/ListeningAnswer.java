package com.example.melLearnBE.dto.response.openAI;

import lombok.Data;

@Data
public class ListeningAnswer {

    private String answerWord;
    private int lineIndex;
}
