package com.example.melLearnBE.dto.response.openAI;

import com.example.melLearnBE.model.Quiz;
import com.example.melLearnBE.model.QuizList;
import lombok.Data;

import java.util.List;

@Data
public class Content {
    private List<Quiz> probList;
}
