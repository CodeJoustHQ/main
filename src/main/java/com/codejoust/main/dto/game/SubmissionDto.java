package com.codejoust.main.dto.game;

import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.util.InstantDeserializer;
import com.codejoust.main.util.InstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class SubmissionDto {
    private CodeLanguage language;
    private String code;
    private List<SubmissionResultDto> results;
    private Integer numCorrect;
    private Integer numTestCases;
    private Double runtime;
    private String compilationError;

    @JsonSerialize(using = InstantSerializer.class)
    @JsonDeserialize(using = InstantDeserializer.class)
    private Instant startTime;
}
