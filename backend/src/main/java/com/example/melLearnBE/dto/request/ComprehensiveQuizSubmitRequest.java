package com.example.melLearnBE.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ComprehensiveQuizSubmitRequest {

    private String musicId;
    private List<Integer> readingSubmit;
    private List<Integer> vocabularySubmit;
    private List<Integer> grammarSubmit;
    private List<String> listeningSubmit;
    private List<LrcLyric> lrcLyricList;
}