package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.model.MemberDto;
import com.example.melLearnBE.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Member")
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/info")
    @Operation(summary = "멤버 정보 조회", description = "멤버 정보 조회")
    public MemberDto getMemberInfo(HttpServletRequest request) {
        return memberService.getMemberProfile(request);
    }

    @PostMapping("/spotifyAccount")
    @Operation(summary = "스포티파이 계정 id 등록", description = "스포티파이 계정 id 등록")
    public ResponseEntity updateSpotifyId(@RequestParam String accountId, HttpServletRequest request) {
        memberService.updateSpotifyAccount(accountId, request);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PutMapping("/info")
    @Operation(summary = "멤버 정보 변경", description = "비밀번호, userId를 제외한 정보를 변경")
    public MemberDto updateMemberInfo(@RequestBody MemberDto memberDto, HttpServletRequest request) {
        System.out.println(memberDto);
        return memberService.updateMemberProfile(memberDto, request);
    }
}
