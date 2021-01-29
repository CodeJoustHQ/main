package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// This class is mapped directly to the tester service's RunDto class.
public class TesterResponse {
    private Boolean status;
    private String output;
}
