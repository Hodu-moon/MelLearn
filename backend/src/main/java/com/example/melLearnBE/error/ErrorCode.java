package com.example.melLearnBE.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    /* 400 BAD_REQUEST : 잘못된 요청 */
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다"),
    UN_SUPPORTED_QUIZ_LANG(HttpStatus.BAD_REQUEST, "지원하지 않는 언어의 가사입니다"),
    UN_SUPPORTED_AUDIO_EXTENSION(HttpStatus.BAD_REQUEST, "지원하지 않는 오디오 확장자입니다"),
    UN_SUPPORTED_QUIZ_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 퀴즈 타입입니다"),
    REQUEST_ARRAY_SIZE_NOT_MATCHED(HttpStatus.BAD_REQUEST, "배열 사이즈가 맞지 않습니다"),

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "일치하는 계정이 없습니다"),
    MISMATCHED_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다"),

    /* 403 FORBIDDEN : 권한이 없는 사용자 */


    /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */
    QUIZ_NOT_FOUND(HttpStatus.NOT_FOUND, "퀴즈를 찾을 수 없습니다"),

    /* 409 CONFLICT : Resource 의 현재 상태와 충돌. 보통 중복된 데이터 존재 */
    ALREADY_EXIST_USERID(HttpStatus.CONFLICT, "이미 존재하는 userId 입니다"),
    ALREADY_EXIST_QUIZ(HttpStatus.CONFLICT, "이미 존재하는 quiz입니다"),
    CREATING_OTHER_REQUEST(HttpStatus.CONFLICT, "다른 사용자가 퀴즈를 생성하고 있습니다."),

    /* 500 INTERNAL_SERVER_ERROR : 서버오류 */
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류"),
    AUDIO_PRE_PROCESSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "오디오 전처리 에러"),
    ;

    private final HttpStatus httpStatus;
    private final String detail;
}
