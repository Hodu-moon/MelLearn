package com.example.melLearnBE.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        if(authException instanceof BadCredentialsException)
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "권한이 없습니다");

        else response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "ReIssueToken");
    }
}
