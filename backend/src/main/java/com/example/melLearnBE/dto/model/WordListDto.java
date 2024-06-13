package com.example.melLearnBE.dto.model;

import com.example.melLearnBE.enums.Language;
import com.example.melLearnBE.model.Word;
import com.example.melLearnBE.model.WordList;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordListDto {

    private Long id;
    private List<WordDto> words;
    private Language langType;

    public WordListDto(WordList wordList) {
        this.id = wordList.getId();
        this.words = new ArrayList<>();
        for (Word word : wordList.getWords()) {
            words.add(new WordDto(word));
        }
        this.langType = wordList.getLangType();
    }
}
