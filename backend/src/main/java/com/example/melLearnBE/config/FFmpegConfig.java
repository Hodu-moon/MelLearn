package com.example.melLearnBE.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFprobe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Slf4j
@Configuration
public class FFmpegConfig {
    private final String ffmpegLocation;
    private final String ffprobeLocation;

    public FFmpegConfig(@Value("${ffmpeg.mpeg}") String ffmpegLocation,
                        @Value("${ffmpeg.probe}") String ffprobeLocation) {
        this.ffmpegLocation = ffmpegLocation;
        this.ffprobeLocation = ffprobeLocation;
    }

    @Bean(name = "ffMpeg")
    public FFmpeg ffMpeg() throws IOException {
        FFmpeg ffMPeg = null;

        String osName = System.getProperty("os.name");

        // 운영체제가 Window인 경우 jar에 내장되어있는 ffmpeg 를 이용
        if (osName.toLowerCase().contains("win")) {
            ClassPathResource classPathResource = new ClassPathResource(ffmpegLocation);
            ffMPeg = new FFmpeg(classPathResource.getURL().getPath());
        } else if(osName.toLowerCase().contains("unix") || osName.toLowerCase().contains("linux")) {
            ffMPeg = new FFmpeg(ffmpegLocation);
        }

        return ffMPeg;
    }

    @Bean(name = "ffProbe")
    public FFprobe ffProbe() throws IOException {
        FFprobe ffprobe = null;

        String osName = System.getProperty("os.name");

        // 운영체제가 Window인 경우 jar에 내장되어있는 ffmpeg 를 이용
        if (osName.toLowerCase().contains("win")) {
            ClassPathResource classPathResource = new ClassPathResource(ffprobeLocation);
            ffprobe = new FFprobe(classPathResource.getURL().getPath());
        } else if(osName.toLowerCase().contains("unix") || osName.toLowerCase().contains("linux")) {
            ffprobe = new FFprobe(ffprobeLocation);
        }

        return ffprobe;
    }
}
