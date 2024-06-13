package com.example.melLearnBE;

import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.model.*;
import com.example.melLearnBE.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootTest
class MeLearnBeApplicationTests {

    @Autowired
    private ListeningSubmitRepository listeningSubmitRepository;
    @Autowired
    private ListeningQuizRepository listeningQuizRepository;
    @Autowired
    private SpeakingSubmitRepository speakingSubmitRepository;
    @Autowired
    private QuizListRepository quizListRepository;
    @Autowired
    private QuizSubmitRepository quizSubmitRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    void contextLoads() {
        Member member = memberRepository.findByMemberId("a1").get();

        for (int i = 0; i < 21; i++) {

            ListeningQuiz listeningQuiz = ListeningQuiz.builder()
                    .blankedText("asdfasdfasdf")
                    .musicId(UUID.randomUUID().toString())
                    .level(LearningLevel.Beginner)
                    .answerList(List.of("a", "b", "c"))
                    .build();
            listeningQuiz = listeningQuizRepository.save(listeningQuiz);

            QuizList vocaQuizList = QuizList.builder()
                    .quizType(QuizType.VOCABULARY)
                    .quizzes(new ArrayList<>())
                    .level(LearningLevel.Beginner)
                    .musicId(UUID.randomUUID().toString())
                    .build();
            vocaQuizList = quizListRepository.save(vocaQuizList);

            QuizList readingQuizList = QuizList.builder()
                    .quizType(QuizType.READING)
                    .quizzes(new ArrayList<>())
                    .level(LearningLevel.Beginner)
                    .musicId(UUID.randomUUID().toString())
                    .build();

            readingQuizList = quizListRepository.save(readingQuizList);

            ListeningSubmit listeningSubmit = ListeningSubmit.builder()
                    .score(100)
                    .listeningQuiz(listeningQuiz)
                    .member(member)
                    .level(LearningLevel.Beginner)
                    .submitAnswerList(List.of("a", "b", "c"))
                    .build();
            listeningSubmitRepository.save(listeningSubmit);

            SpeakingSubmit speakingSubmit = SpeakingSubmit.builder()
                    .submit("asdf")
                    .musicId(UUID.randomUUID().toString())
                    .score(100.0)
                    .member(member)
                    .build();

            speakingSubmitRepository.save(speakingSubmit);

            QuizSubmit vocaQuizSubmit = QuizSubmit.builder()
                    .quizList(vocaQuizList)
                    .submitAnswerList(List.of(1, 2, 3, 4, 5))
                    .score(100.0)
                    .member(member)
                    .build();
            quizSubmitRepository.save(vocaQuizSubmit);

            QuizSubmit readingQuizSubmit = QuizSubmit.builder()
                    .quizList(readingQuizList)
                    .submitAnswerList(List.of(1, 2, 3, 4, 5))
                    .score(100.0)
                    .member(member)
                    .build();
            quizSubmitRepository.save(readingQuizSubmit);



        }
    }


}
