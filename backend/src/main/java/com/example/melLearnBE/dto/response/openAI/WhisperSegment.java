package com.example.melLearnBE.dto.response.openAI;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class WhisperSegment implements Serializable {
    private int id;
    private int seek;
    private double start;
    private double end;
    private String text;
    private List<Integer> tokens;
    private double temperature;
    private double avg_logprob;
    private double compression_ratio;
    private double no_speech_prob;
}
