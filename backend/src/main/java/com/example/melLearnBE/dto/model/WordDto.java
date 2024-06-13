package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.model.Word;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordDto {

    private Long id;
    private String content;

    public WordDto(Word word) {
        this.id = word.getId();
        this.content = word.getContent();
    }

}
