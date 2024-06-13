package com.example.melLearnBE.openFeign.naverCloudClient;

import feign.RequestInterceptor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Indexed;

@Configuration
@Indexed
@Data
@Slf4j
public class NaverCloudConfig {

    @Value("${naver.cloud.api.key-id}")
    private String clientId;

    @Value("${naver.cloud.api.key}")
    private String apiKey;


    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-NCP-APIGW-API-KEY-ID", clientId);
            requestTemplate.header("X-NCP-APIGW-API-KEY", apiKey);
        };
    }
}