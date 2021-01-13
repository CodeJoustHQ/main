package com.rocketden.main.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.dto.game.GameTimerDto;
import com.rocketden.main.dto.game.GameTimerMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GameTimerMapperTests {

    private static final Long DURATION = (long) 15;

    @Test
    public void toDto() {
        GameTimer gameTimer = new GameTimer(DURATION);
        GameTimerDto gameTimerDto = GameTimerMapper.toDto(gameTimer);

        assertEquals(gameTimer.getDuration(), gameTimerDto.getDuration());
        assertEquals(gameTimer.getStartTime(), gameTimerDto.getStartTime());
        assertEquals(gameTimer.getEndTime(), gameTimerDto.getEndTime());
        assertEquals(gameTimer.isTimeUp(), gameTimerDto.isTimeUp());
    }
}
