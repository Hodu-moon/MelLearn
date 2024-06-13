package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.request.ComprehensiveQuizSubmitRequest;
import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.response.ComprehensiveQuizDto;
import com.example.melLearnBE.dto.response.ComprehensiveQuizSubmitDto;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.service.ComprehensiveQuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@Tag(name = "ComprehensiveQuiz")
@RequestMapping("/api/comprehensive-quiz")
public class ComprehensiveQuizController {

    private final ComprehensiveQuizService comprehensiveQuizService;

    @PostMapping
    @Operation(summary = "모의고사 문제 조회", description = "모의고사 문제 조회")
    public ComprehensiveQuizDto getComprehensiveQuiz(@RequestBody QuizRequest quizRequest, HttpServletRequest request) throws ExecutionException, InterruptedException {
        try {
            return comprehensiveQuizService.get(quizRequest, request);
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.ALREADY_EXIST_QUIZ);
        } catch (ExecutionException e) {
            throw new CustomException(ErrorCode.CREATING_OTHER_REQUEST);
        }

    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "모의고사 답안지 제출", description = "모의고사 답안지 제출")
    public ComprehensiveQuizSubmitDto submit(@RequestPart("submitRequest") ComprehensiveQuizSubmitRequest submitRequest,
                                             @RequestPart("speakingSubmitFile") MultipartFile speakingSubmitFile,
                                             HttpServletRequest request) throws ExecutionException, InterruptedException {
        return comprehensiveQuizService.submit(submitRequest, speakingSubmitFile, request);
    }
}
