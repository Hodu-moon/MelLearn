package com.example.melLearnBE.dto.request.openAI;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatQuestion {

    private int level;
    private String lang;
    private int totalProblem;
    private String text;
}
