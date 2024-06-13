package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.model.ListeningQuizDto;
import com.example.melLearnBE.dto.model.QuizListDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.request.QuizSubmitRequest;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.model.ListeningQuiz;
import com.example.melLearnBE.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.C;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Quiz")
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    @PostMapping({"/reading", "/vocabulary", "/grammar"})
    @Operation(summary = "퀴즈 조회", description = "퀴즈 조회")
    public QuizListDto getQuizList(@RequestBody QuizRequest quizRequest, HttpServletRequest request) throws InterruptedException {
        try {
            return quizService.getQuizList(quizRequest, request).get();
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.ALREADY_EXIST_QUIZ);
        } catch (ExecutionException e) {
            throw new CustomException(ErrorCode.CREATING_OTHER_REQUEST);
        }
    }

    @PostMapping("/listening")
    @Operation(summary = "퀴즈 조회", description = "퀴즈 조회")
    public ListeningQuizDto getListeningQuiz(@RequestBody QuizRequest quizRequest, HttpServletRequest request) throws InterruptedException {
        try {
            return quizService.getListeningQuiz(quizRequest, request).get();
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.ALREADY_EXIST_QUIZ);
        } catch (ExecutionException e) {
            throw new CustomException(ErrorCode.CREATING_OTHER_REQUEST);
        }
    }

}
