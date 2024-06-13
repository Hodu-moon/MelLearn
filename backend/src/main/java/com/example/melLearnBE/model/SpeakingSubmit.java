package com.example.melLearnBE.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class SpeakingSubmit {

    @Id @GeneratedValue
    private Long id;
    private String musicId;
    @ManyToOne
    private Member member;
    @Column(columnDefinition="LONGTEXT")
    private String submit;
    @Column(columnDefinition="LONGTEXT")
    private String markedText;
    private double score;
    @CreationTimestamp
    private LocalDateTime createdTime;

}
