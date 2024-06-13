package com.example.melLearnBE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MelLearnBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MelLearnBeApplication.class, args);
	}
}
