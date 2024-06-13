package com.example.melLearnBE.service;

import com.example.melLearnBE.dto.model.*;
import com.example.melLearnBE.dto.request.*;
import com.example.melLearnBE.dto.response.ComprehensiveQuizDto;
import com.example.melLearnBE.dto.response.ComprehensiveQuizSubmitDto;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.jwt.JwtTokenProvider;
import com.example.melLearnBE.model.Member;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComprehensiveQuizService {

    private final QuizService quizService;
    private final SpeakingService speakingService;
    private final JwtTokenProvider jwtTokenProvider;


    public ComprehensiveQuizSubmitDto submit(ComprehensiveQuizSubmitRequest quizSubmitRequest, MultipartFile speakingSubmitFile, HttpServletRequest request) throws ExecutionException, InterruptedException {

        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        CompletableFuture<SpeakingSubmitDto> speakingSubmit = speakingService.submit(
                SpeakingSubmitRequest.builder()
                        .file(speakingSubmitFile)
                        .lyricList(quizSubmitRequest.getLrcLyricList())
                        .build(), quizSubmitRequest.getMusicId(), request);

        CompletableFuture<QuizSubmitDto> grammarSubmit = quizService.submit(
                QuizSubmitRequest.builder()
                .quizType(QuizType.GRAMMAR)
                .answers(quizSubmitRequest.getGrammarSubmit())
                .musicId(quizSubmitRequest.getMusicId())
                .build(), request);

        CompletableFuture<QuizSubmitDto> vocaSubmit = quizService.submit(
                QuizSubmitRequest.builder()
                .quizType(QuizType.VOCABULARY)
                .answers(quizSubmitRequest.getVocabularySubmit())
                .musicId(quizSubmitRequest.getMusicId())
                .build(), request);

        CompletableFuture<QuizSubmitDto> readingSubmit = quizService.submit(
                QuizSubmitRequest.builder()
                .quizType(QuizType.READING)
                .answers(quizSubmitRequest.getReadingSubmit())
                .musicId(quizSubmitRequest.getMusicId())
                .build(), request);

        CompletableFuture<ListeningSubmitDto> listeningSubmit = quizService.listeningSubmit(
                ListeningSubmitRequest.builder()
                        .submitWordList(quizSubmitRequest.getListeningSubmit())
                        .musicId(quizSubmitRequest.getMusicId()).build(), request);

        CompletableFuture.allOf(speakingSubmit, grammarSubmit, vocaSubmit, readingSubmit, listeningSubmit).join();

        SpeakingSubmitDto speakingSubmitDto = speakingSubmit.get();
        QuizSubmitDto grammarSubmitDto = grammarSubmit.get();
        QuizSubmitDto vocaSubmitDto = vocaSubmit.get();
        QuizSubmitDto readingSubmitDto = readingSubmit.get();
        ListeningSubmitDto listeningSubmitDto = listeningSubmit.get();

        ComprehensiveQuizSubmitDto comprehensiveQuizSubmitDto = new ComprehensiveQuizSubmitDto(
                quizSubmitRequest.getMusicId(), member.getLevel(),
                ComprehensiveQuizAnswerDto.builder()
                        .speakingSubmit(speakingSubmitDto)
                        .vocabularySubmit(vocaSubmitDto)
                        .readingSubmit(readingSubmitDto)
                        .grammarSubmit(grammarSubmitDto)
                        .listeningSubmit(listeningSubmitDto).build()
        );
        return comprehensiveQuizSubmitDto;
    }

    public ComprehensiveQuizDto get(QuizRequest quizRequest, HttpServletRequest request) throws InterruptedException, ExecutionException {
        CompletableFuture<ListeningQuizDto> listeningQuiz = quizService.getListeningQuiz(QuizRequest.builder()
                .quizType(QuizType.LISTENING)
                .lyric(quizRequest.getLyric())
                .musicId(quizRequest.getMusicId())
                .build(), request);

        CompletableFuture<QuizListDto> readingQuiz = quizService.getQuizList(QuizRequest.builder()
                .quizType(QuizType.READING)
                .lyric(quizRequest.getLyric())
                .musicId(quizRequest.getMusicId())
                .build(), request);

        CompletableFuture<QuizListDto> vocaQuiz = quizService.getQuizList(QuizRequest.builder()
                .quizType(QuizType.VOCABULARY)
                .lyric(quizRequest.getLyric())
                .musicId(quizRequest.getMusicId())
                .build(), request);

        CompletableFuture<QuizListDto> grammarQuiz = quizService.getQuizList(QuizRequest.builder()
                .quizType(QuizType.GRAMMAR)
                .lyric(quizRequest.getLyric())
                .musicId(quizRequest.getMusicId())
                .build(), request);

        CompletableFuture.allOf(listeningQuiz, readingQuiz, vocaQuiz, grammarQuiz).join();

        ListeningQuizDto listeningResult = listeningQuiz.get();
        QuizListDto readingResult = readingQuiz.get();
        QuizListDto vocaResult = vocaQuiz.get();
        QuizListDto grammarResult = grammarQuiz.get();
        ComprehensiveQuizDto comprehensiveQuizDto = new ComprehensiveQuizDto(grammarResult, vocaResult, readingResult, listeningResult);
        return comprehensiveQuizDto;
    }

}
