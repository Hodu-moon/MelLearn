package com.example.melLearnBE.service;

import com.example.melLearnBE.adapter.LocalDateTimeTypeAdapter;
import com.example.melLearnBE.dto.model.ListeningQuizDto;
import com.example.melLearnBE.dto.model.QuizListDto;
import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.request.openAI.ChatQuestion;
import com.example.melLearnBE.dto.request.openAI.ChatRequest;
import com.example.melLearnBE.dto.response.openAI.ChatGPTResponse;
import com.example.melLearnBE.dto.response.openAI.ListeningAnswer;
import com.example.melLearnBE.enums.Language;
import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.enums.QuizType;
import com.example.melLearnBE.error.CustomException;
import com.example.melLearnBE.error.ErrorCode;
import com.example.melLearnBE.model.ListeningQuiz;
import com.example.melLearnBE.model.Member;
import com.example.melLearnBE.model.Quiz;
import com.example.melLearnBE.model.QuizList;
import com.example.melLearnBE.repository.ListeningQuizRepository;
import com.example.melLearnBE.repository.QuizListRepository;
import com.example.melLearnBE.repository.QuizRepository;
import com.example.melLearnBE.util.PromptDetailUtil;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class QuizCreationService {

    private final QuizListRepository quizListRepository;
    private final OpenAIService openAIService;
    private final PromptDetailUtil promptDetailUtil;
    private final QuizRepository quizRepository;
    private final ListeningQuizRepository listeningQuizRepository;
    private final static String QUIZ_JSON_PREFIX = "probList";
    private final static String ANSWERLIST = "answerList";
    private final static String PROMPT_PREFIX = "prompt";
    private final static String TXT_EXTENSION = ".txt";


    @Transactional
    public CompletableFuture<ListeningQuizDto> createListeningQuiz(QuizRequest quizRequest, Member member) {
        QuizType quizType = quizRequest.getQuizType();

        ChatRequest listeningRequest = ChatRequest.builder()
                .system(getPrompt(quizType, member))
                .userInput(addLineNumbers(quizRequest.getLyric()) + "\n" + promptDetailUtil.get(member, quizRequest))
                .build();

        int retries = 0;
        final int maxRetries = 3;
        boolean success = false;
        while (!success && retries < maxRetries) {
            try {
                ChatGPTResponse chatGPTResponse = openAIService.requestGPT(listeningRequest);
                String jsonContent = chatGPTResponse.getChoices().get(0).getMessage().getContent();
                JsonObject jsonObject = JsonParser.parseString(jsonContent).getAsJsonObject();
                JsonArray probListJsonArray = jsonObject.getAsJsonArray(ANSWERLIST);
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter())
                        .setLenient()
                        .create();

                Type listType = new TypeToken<List<ListeningAnswer>>() {
                }.getType();
                List<ListeningAnswer> answerContext = gson.fromJson(probListJsonArray, listType);
                ListeningQuiz listeningQuiz = ListeningQuiz.builder()
                        .level(member.getLevel())
                        .musicId(quizRequest.getMusicId())
                        .build();


                blankToListeningText(quizRequest, member.getLevel(), answerContext, listeningQuiz);
                listeningQuizRepository.save(listeningQuiz);

                success = true;
                return CompletableFuture.completedFuture(new ListeningQuizDto(listeningQuiz));
            } catch (Exception e) {
                retries++;
                e.printStackTrace();
                if (retries >= maxRetries) {
                    throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
                }
            }
        }

        throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    public static String addLineNumbers(String input) {
        String[] lines = input.split("\n");
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < lines.length; i++) {
            result.append(i).append(". ").append(lines[i]).append("\n");
        }

        return result.toString();
    }

    private void blankToListeningText(QuizRequest quizRequest, LearningLevel level, List<ListeningAnswer> answerContext, ListeningQuiz listeningQuiz) {
        String lyric = quizRequest.getLyric();
        List<String> answerList = new ArrayList<>();
        int totalBlankSize;
        if (level.equals(LearningLevel.Beginner)) {
            totalBlankSize = 10;
        } else if (level.equals(LearningLevel.Intermediate)) {
            totalBlankSize = 20;
        } else {
            totalBlankSize = 30;
        }

        Collections.shuffle(answerContext);
        String[] lyricArray = lyric.split("\n");
        StringBuilder modifiedLyrics = new StringBuilder();


        for (int i = 0; i < lyricArray.length; i++) {
            try {
                String line = lyricArray[i];
                String[] tokens = line.split(" ");
                for (ListeningAnswer listeningAnswer : answerContext) {
                    if (listeningAnswer.getLineIndex() == i) {
                        for (int j = 0; j < tokens.length; j++) {
                            if (tokens[j].contains(listeningAnswer.getAnswerWord())) {
                                tokens[j] = "__";
                                answerList.add(listeningAnswer.getAnswerWord());
                                break;
                            }
                        }
                        if (answerList.size() >= totalBlankSize) {
                            break;
                        }
                    }
                }

                modifiedLyrics.append(String.join(" ", tokens));
                modifiedLyrics.append("\n");

                if (answerList.size() >= totalBlankSize) {
                    for (int j = i + 1; j < lyricArray.length; j++) {
                        modifiedLyrics.append(lyricArray[j] + "\n");
                    }
                    break;
                }
            } catch (ArrayIndexOutOfBoundsException e) {

            }
        }

        listeningQuiz.setBlankedText(modifiedLyrics.toString());
        listeningQuiz.setAnswerList(answerList);
    }

    @Transactional
    public CompletableFuture<QuizListDto> createQuizList(QuizRequest quizRequest, Member member) {
        QuizType quizType = quizRequest.getQuizType();
        if (quizType.equals(QuizType.READING) || quizType.equals(QuizType.VOCABULARY) || quizType.equals(QuizType.GRAMMAR)) {
            return CompletableFuture.completedFuture(requestQuiz(quizRequest, member));
        }
        throw new CustomException(ErrorCode.UN_SUPPORTED_QUIZ_TYPE);
    }

    private QuizListDto requestQuiz(QuizRequest quizRequest, Member member) {
        QuizType quizType = quizRequest.getQuizType();
        ChatQuestion question = ChatQuestion.builder()
                .text(quizRequest.getLyric())
                .totalProblem(5)
                .lang(member.getLangType().getIso639Value())
                .level(member.getLevel().getValue())
                .build();

        ChatRequest chatRequest = ChatRequest.builder()
                .system(getPrompt(quizType, member))
                .userInput(question.toString() + "\n" + promptDetailUtil.get(member, quizRequest))
                .build();

        int retries = 0;
        final int maxRetries = 3;
        boolean success = false;
        while (!success && retries < maxRetries) {
            try {
                ChatGPTResponse chatGPTResponse;
                if (quizRequest.getQuizType().equals(QuizType.GRAMMAR)) {
                    chatGPTResponse = openAIService.requestFinetuningModel(chatRequest);
                } else if (member.getLangType().equals(Language.ENGLISH)) {
                    chatGPTResponse = openAIService.requestGPT(chatRequest);
                } else chatGPTResponse = openAIService.requestGPT4(chatRequest);

                String jsonContent = chatGPTResponse.getChoices().get(0).getMessage().getContent();
                JsonObject jsonObject = JsonParser.parseString(jsonContent).getAsJsonObject();
                JsonArray probListJsonArray = jsonObject.getAsJsonArray(QUIZ_JSON_PREFIX);
                Type listType = new TypeToken<List<Quiz>>() {
                }.getType();
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter())
                        .setLenient()
                        .create();

                List<Quiz> quizzes = gson.fromJson(probListJsonArray, listType);

                QuizList quizList = QuizList.builder()
                        .quizzes(quizzes)
                        .createdTime(LocalDateTime.now())
                        .quizType(quizType)
                        .level(member.getLevel())
                        .musicId(quizRequest.getMusicId())
                        .build();

                for (Quiz quiz : quizzes) {
                    quiz.setQuizList(quizList);
                }

                List<Quiz> savedQuizzes = quizRepository.saveAll(quizzes.stream().toList());
                QuizList savedQuizList = quizListRepository.save(quizList);
                savedQuizList.setQuizzes(savedQuizzes);

                success = true;
                return new QuizListDto(savedQuizList);
            } catch (Exception e) {
                retries++;
                e.printStackTrace();
                if (retries >= maxRetries) {
                    throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
                }
            }
        }

        throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    private String getPrompt(QuizType quizType, Member member) {

        String filePath = "." + File.separator + PROMPT_PREFIX + File.separator + quizType;


        if (quizType.equals(QuizType.VOCABULARY)) {
            filePath += File.separator + member.getLevel().toString() + TXT_EXTENSION;
        } else if (quizType.equals(QuizType.READING)) {
            filePath += File.separator + quizType + TXT_EXTENSION;
        } else {
            filePath += File.separator + quizType + TXT_EXTENSION;
        }


        try {
            return new String(Files.readAllBytes(Paths.get(filePath)));
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
