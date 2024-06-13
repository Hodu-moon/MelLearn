package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.request.AuthRequest;
import com.example.melLearnBE.dto.model.TokenInfo;
import com.example.melLearnBE.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/join")
    @Operation(summary = "회원가입", description = "회원가입")
    public ResponseEntity join(@RequestBody AuthRequest authRequest) {
        authService.join(authRequest);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "비밀번호 불일치, memberId가 존재하지 않을 시 오류반환. 성공 시 jwt 반환.")
    public TokenInfo login(@RequestBody AuthRequest authRequest, HttpServletResponse response) {
        return authService.login(authRequest, response);
    }

    @GetMapping("/reIssueJwt")
    @Operation(summary = "jwt 재발급", description = "jwt - access, refresh 토큰 재발급")
    public TokenInfo reIssueJwt(HttpServletRequest request, HttpServletResponse response) {
        return authService.reIssueToken(request, response);
    }

}
