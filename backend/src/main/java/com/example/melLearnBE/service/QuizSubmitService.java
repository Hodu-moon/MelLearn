package com.example.melLearnBE.service;

import com.example.melLearnBE.dto.model.ListeningSubmitDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.request.ListeningSubmitRequest;
import com.example.melLearnBE.dto.request.QuizSubmitRequest;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.model.*;
import com.example.melLearnBE.repository.ListeningQuizRepository;
import com.example.melLearnBE.repository.ListeningSubmitRepository;
import com.example.melLearnBE.repository.QuizListRepository;
import com.example.melLearnBE.repository.QuizSubmitRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class QuizSubmitService {

    private final ListeningQuizRepository listeningQuizRepository;
    private final ListeningSubmitRepository listeningSubmitRepository;
    private final QuizListRepository quizListRepository;
    private final QuizSubmitRepository quizSubmitRepository;


    @Transactional
    public CompletableFuture<ListeningSubmitDto> submitListeningQuiz(ListeningSubmitRequest submitRequest, Member member) {
        ListeningQuiz listeningQuiz = listeningQuizRepository.findByMusicIdAndLevel(submitRequest.getMusicId(), member.getLevel())
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        List<String> answerList = listeningQuiz.getAnswerList();
        List<String> submitWordList = submitRequest.getSubmitWordList();
        int correctCount = 0;

        if(answerList.size() != submitWordList.size()) {
            throw new CustomException(ErrorCode.REQUEST_ARRAY_SIZE_NOT_MATCHED);
        }

        for(int i = 0; i < answerList.size(); i++) {
            String answerWord = answerList.get(i);
            String submitWord = submitWordList.get(i);

            if (answerWord.equals(submitWord.trim())) {
                submitWordList.set(i, answerWord);
                correctCount++;
            }
        }

        ListeningSubmit listeningSubmit = ListeningSubmit.builder()
                .listeningQuiz(listeningQuiz)
                .submitAnswerList(submitWordList)
                .level(member.getLevel())
                .createdTime(LocalDateTime.now())
                .member(member)
                .score((correctCount * 100) / answerList.size())
                .build();

        return CompletableFuture.completedFuture(new ListeningSubmitDto(listeningSubmitRepository.save(listeningSubmit)));
    }

    @Transactional
    public CompletableFuture<QuizSubmitDto> submitQuiz(QuizSubmitRequest submitRequest, Member member) {
        QuizList quizList = quizListRepository.findByMusicIdAndQuizTypeAndLevel(submitRequest.getMusicId(), submitRequest.getQuizType(), member.getLevel())
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        double score = calCorrectRate(submitRequest, quizList);

        QuizSubmit quizSubmit = QuizSubmit.builder()
                .quizList(quizList)
                .submitAnswerList(submitRequest.getAnswers())
                .member(member)
                .score(score)
                .build();

        return CompletableFuture.completedFuture(new QuizSubmitDto(quizSubmitRepository.save(quizSubmit)));
    }

    private double calCorrectRate(QuizSubmitRequest submitRequest, QuizList quizList) {
        List<Integer> submitAnswers = submitRequest.getAnswers();
        List<Quiz> quizzes = quizList.getQuizzes();
        int totalCorrectCount = 0;
        for(int i = 0; i < 4; i++) {
            Quiz quiz = quizzes.get(i);
            quiz.setSubmitCount(quiz.getSubmitCount() + 1);
            if(quiz.getAnswer() == submitAnswers.get(i)) {
                quiz.setCorrectCount(quiz.getCorrectCount() + 1);
                totalCorrectCount++;
            }
        }

        return totalCorrectCount * 100 / quizList.getQuizzes().size();
    }
}
