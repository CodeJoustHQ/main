package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
// This class is mapped directly to the tester service's RunDto class.
public class TesterResponse {
    private List<TesterResultResponse> results;
    private Integer numCorrect;
    private Integer numTestCases;
    private Long runtime;

    @Getter
    @Setter
    public static class TesterResultResponse {
        private String console;
        private String userOutput;
        private String error;
        private String correctOutput;
        private boolean correct;
    }
}
