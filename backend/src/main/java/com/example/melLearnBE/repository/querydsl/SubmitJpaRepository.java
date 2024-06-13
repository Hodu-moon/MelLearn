package com.example.melLearnBE.repository.querydsl;

import com.example.melLearnBE.dto.model.*;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.model.*;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.ListPath;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.melLearnBE.model.QListeningQuiz.listeningQuiz;
import static com.example.melLearnBE.model.QListeningSubmit.listeningSubmit;
import static com.example.melLearnBE.model.QQuizSubmit.quizSubmit;
import static com.example.melLearnBE.model.QSpeakingSubmit.speakingSubmit;

@Repository
public class SubmitJpaRepository {

    private final JPAQueryFactory queryFactory;

    public SubmitJpaRepository(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    /**
     * @ElementCollection 타입을 Join하는 쿼리는 Querydsl에서 지원하지 않음.
     * 그래서 한방 쿼리를 날리려면 Entity계층을 수정해야 함.
     * @ElementCollection 타입을 Entity로 등록하고 연관관계를 설정해주어야, fetchJoin을 사용할 수 있음.
     *
     * 일단 지금은 트랜잭션을 사용해 Lazy-Fetch로 값을 불러오고, 나중에 수정하기.
     */
    @Transactional
    public Page<QuizSubmitDto> findSubmitWithPaging(long memberId, QuizType quizType, int pageNumber, int pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        List<QuizSubmit> results = queryFactory
                .selectFrom(quizSubmit)
                .where(quizSubmit.member.id.eq(memberId))
                .where(quizSubmit.quizList.quizType.eq(quizType))
                .orderBy(quizSubmit.createdTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


        long total = queryFactory
                .selectFrom(quizSubmit)
                .where(quizSubmit.member.id.eq(memberId))
                .where(quizSubmit.quizList.quizType.eq(quizType))
                .fetchCount();

        List<QuizSubmitDto> result = results.stream()
                .map(submit -> new QuizSubmitDto(
                        submit.getId(),
                        new QuizListDto(submit.getQuizList()),
                        submit.getSubmitAnswerList(),
                        submit.getScore(),
                        submit.getCreatedTime()))
                .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, total);

    }

    @Transactional
    public Page<ListeningSubmitDto> findListeningSubmitWithPaging(long memberId, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        List<ListeningSubmit> results = queryFactory
                .selectFrom(listeningSubmit)
                .join(listeningSubmit.listeningQuiz, listeningQuiz).fetchJoin()
                .where(listeningSubmit.member.id.eq(memberId))
                .orderBy(listeningSubmit.createdTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(listeningSubmit)
                .from(listeningSubmit)
                .join(listeningSubmit.listeningQuiz)
                .where(listeningSubmit.member.id.eq(memberId))
                .fetchCount();


        List<ListeningSubmitDto> result = results.stream()
                .map(submit -> new ListeningSubmitDto(
                        submit.getId(),
                        new ListeningQuizDto(submit.getListeningQuiz()),
                        submit.getLevel(),
                        submit.getSubmitAnswerList(),
                        submit.getScore(),
                        submit.getCreatedTime()))
                .collect(Collectors.toList());
        return new PageImpl<>(result, pageable, total);
    }

    @Transactional
    public Page<SpeakingSubmitDto> findSpeakingSubmitWithPaging(long memberId, int pageNumber, int pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        List<SpeakingSubmit> results = queryFactory
                .selectFrom(speakingSubmit)
                .where(speakingSubmit.member.id.eq(memberId))
                .orderBy(speakingSubmit.createdTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(speakingSubmit)
                .where(speakingSubmit.member.id.eq(memberId))
                .fetchCount();

        List<SpeakingSubmitDto> result = results.stream()
                .map(submit -> new SpeakingSubmitDto(
                        submit.getId(),
                        submit.getMusicId(),
                        submit.getSubmit(),
                        submit.getMarkedText(),
                        submit.getScore(),
                        submit.getCreatedTime()))
                .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, total);
    }


}
