package com.example.melLearnBE.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MelLearn API")
                        .description("음악으로 즐기는 인공지능 기반 학습 서비스 제공")
                        .version("1.0.0"));
    }

}