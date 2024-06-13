package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.model.ListeningSubmitDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.request.ListeningSubmitRequest;
import com.example.melLearnBE.dto.request.QuizSubmitRequest;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;


@RestController
@RequiredArgsConstructor
@Tag(name = "Quiz Submit")
@RequestMapping("/api/quiz/submit")
public class QuizSubmitController {

    private final QuizService quizService;

    @PostMapping({"/grammar", "/reading", "/vocabulary"})
    @Operation(summary = "퀴즈 답안지 제출", description = "퀴즈 답안지 제출")
    public QuizSubmitDto submit(@RequestBody QuizSubmitRequest quizSubmitRequest, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return quizService.submit(quizSubmitRequest, request).get();
    }

    @PostMapping("/listening")
    @Operation(summary = "퀴즈 답안지 제출", description = "퀴즈 답안지 제출")
    public ListeningSubmitDto listeningSubmit(@RequestBody ListeningSubmitRequest submitRequest, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return quizService.listeningSubmit(submitRequest, request).get();
    }

    @GetMapping
    @Operation(summary = "제출 답안지, 채점 조회", description = "제출 답안지, 채점 조회")
    public ResponseEntity getSubmitList(@RequestParam(required = false, defaultValue = "0", value = "page") int pageNo,
                                        @RequestParam QuizType quizType,
                                        HttpServletRequest request) {

        return new ResponseEntity(quizService.getSubmitList(quizType, pageNo, request), HttpStatus.OK);
    }

}