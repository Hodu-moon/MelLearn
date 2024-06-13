package com.example.melLearnBE.dto.response.openAI;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class WhisperTranscriptionResponse implements Serializable {
    private String text;
    private List<WhisperSegment> segments;
}