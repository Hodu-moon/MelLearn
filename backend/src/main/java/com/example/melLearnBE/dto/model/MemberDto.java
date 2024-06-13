package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.enums.LearningLevel;
import com.example.melLearnBE.model.Member;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private Long id;
    private String memberId;
    private String name;
    private int levelPoint;
    private LearningLevel level;
    private String langType;

    public MemberDto(Member member) {
        this.id = member.getId();
        this.memberId = member.getMemberId();
        this.name = member.getName();
        this.level = member.getLevel();
        this.langType = member.getLangType().getIso639Value();
        this.levelPoint = member.getLevelPoint();
    }
}
