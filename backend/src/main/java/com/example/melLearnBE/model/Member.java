package com.example.melLearnBE.model;

import com.example.melLearnBE.enums.Language;
import com.example.melLearnBE.enums.LearningLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Member implements UserDetails {

    @Id @GeneratedValue
    private Long id;
    private String memberId;
    private String name;
    private String password;
    private int levelPoint;
    @Enumerated(value = EnumType.ORDINAL)
    private LearningLevel level;
    @Enumerated(value = EnumType.ORDINAL)
    private Language langType;
    private String spotifyAccountId;
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<WordList> wordLists;
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<SpeakingSubmit> speakingSubmitList;
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<QuizSubmit> quizSubmitList;
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ListeningSubmit> listeningSubmitList;
    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<String> roles = new ArrayList<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> collect = this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return collect;
    }


    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return memberId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;

    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
