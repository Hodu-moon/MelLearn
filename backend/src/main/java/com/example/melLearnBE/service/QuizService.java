package com.example.melLearnBE.service;

import com.example.melLearnBE.dto.model.ListeningQuizDto;
import com.example.melLearnBE.dto.model.ListeningSubmitDto;
import com.example.melLearnBE.dto.model.QuizListDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.request.ListeningSubmitRequest;
import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.request.QuizSubmitRequest;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.jwt.JwtTokenProvider;
import com.example.melLearnBE.model.*;
import com.example.melLearnBE.repository.ListeningQuizRepository;
import com.example.melLearnBE.repository.QuizListRepository;
import com.example.melLearnBE.repository.QuizRepository;
import com.example.melLearnBE.repository.querydsl.SubmitJpaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizSubmitService quizSubmitService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final SubmitJpaRepository submitJpaRepository;
    private final QuizCreationService quizCreationService;
    private final QuizListRepository quizListRepository;
    private final ListeningQuizRepository listeningQuizRepository;
    private static String delimiter = ":";


    /**
     * 동시성 고려해서 코드 업데이트 해야함.
     * 아직 안했음.
     */

    public Page getSubmitList(QuizType quizType, int pageNo, HttpServletRequest request) {
        Member member = jwtTokenProvider.getMember(request)
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        if (quizType.equals(QuizType.LISTENING)) {
            return submitJpaRepository.findListeningSubmitWithPaging(member.getId(), pageNo, 10);
        } else if (quizType.equals(QuizType.READING) || quizType.equals(QuizType.VOCABULARY) || quizType.equals(QuizType.GRAMMAR)) {
            return submitJpaRepository.findSubmitWithPaging(member.getId(), quizType, pageNo, 10);
        } else if (quizType.equals(QuizType.SPEAKING)) {
            return submitJpaRepository.findSpeakingSubmitWithPaging(member.getId(), pageNo, 10);
        }

        throw new CustomException(ErrorCode.BAD_REQUEST);
    }


    @Async
    @Transactional
    public CompletableFuture<QuizListDto> getQuizList(QuizRequest quizRequest, HttpServletRequest request) {
        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Optional optionalQuiz = fetchQuiz(quizRequest, member);
        String redisKey = getRedisKey(quizRequest, member);

        if (optionalQuiz.isEmpty()) {
            if (redisTemplate.hasKey(redisKey)) {
                throw new CustomException(ErrorCode.CREATING_OTHER_REQUEST);
            } else {
                redisTemplate.opsForValue().set(redisKey, "true", 1, TimeUnit.MINUTES);
                CompletableFuture<QuizListDto> quizListFuture = quizCreationService.createQuizList(quizRequest, member);
                quizListFuture.whenComplete((result, exception) -> {
                    redisTemplate.delete(redisKey);
                });
                return quizListFuture;
            }
        } else return CompletableFuture.completedFuture(new QuizListDto((QuizList) optionalQuiz.get()));
    }

    @Async
    @Transactional
    public CompletableFuture<ListeningQuizDto> getListeningQuiz(QuizRequest quizRequest, HttpServletRequest request) {
        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Optional optionalQuiz = fetchQuiz(quizRequest, member);
        String redisKey = getRedisKey(quizRequest, member);
        if (optionalQuiz.isEmpty()) {
            if (redisTemplate.hasKey(redisKey)) {
                System.out.println(redisTemplate.opsForValue().get(redisKey));
                throw new CustomException(ErrorCode.CREATING_OTHER_REQUEST);
            } else {
                redisTemplate.opsForValue().set(redisKey, "true", 1, TimeUnit.MINUTES);
                CompletableFuture<ListeningQuizDto> listeningQuiz = quizCreationService.createListeningQuiz(quizRequest, member);
                listeningQuiz.whenComplete((result, exception) -> {
                    redisTemplate.delete(redisKey);
                });
                return listeningQuiz;
            }
        } else return CompletableFuture.completedFuture(new ListeningQuizDto((ListeningQuiz) optionalQuiz.get()));
    }

    @Async
    public CompletableFuture<QuizSubmitDto> submit(QuizSubmitRequest submitRequest, HttpServletRequest request) {
        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        return quizSubmitService.submitQuiz(submitRequest, member);
    }

    @Async
    public CompletableFuture<ListeningSubmitDto> listeningSubmit(ListeningSubmitRequest submitRequest, HttpServletRequest request) {

        Member member = jwtTokenProvider.getMember(request).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        return quizSubmitService.submitListeningQuiz(submitRequest, member);
    }

    public Optional fetchQuiz(QuizRequest quizRequest, Member member) {
        if (quizRequest.getQuizType().equals(QuizType.LISTENING)) {
            return listeningQuizRepository.findByMusicIdAndLevel(quizRequest.getMusicId(), member.getLevel());
        } else {
            return quizListRepository.findByMusicIdAndQuizTypeAndLevel(quizRequest.getMusicId(), quizRequest.getQuizType(), member.getLevel());
        }
    }

    private String getRedisKey(QuizRequest quizRequest, Member member) {
        return quizRequest.getMusicId() + delimiter + quizRequest.getQuizType() + delimiter + member.getLevel();
    }

    private double calCorrectRate(QuizSubmitRequest submitRequest, QuizList quizList) {
        List<Integer> submitAnswers = submitRequest.getAnswers();
        List<Quiz> quizzes = quizList.getQuizzes();
        int totalCorrectCount = 0;
        for (int i = 0; i < 4; i++) {
            Quiz quiz = quizzes.get(i);
            quiz.setSubmitCount(quiz.getSubmitCount() + 1);
            if (quiz.getAnswer() == submitAnswers.get(i)) {
                quiz.setCorrectCount(quiz.getCorrectCount() + 1);
                totalCorrectCount++;
            }
        }

        return totalCorrectCount * 100 / quizList.getQuizzes().size();
    }

}