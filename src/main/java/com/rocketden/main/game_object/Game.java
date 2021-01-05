package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.service.SocketService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
public class Game {

    // 15 second duration for the GameTimer.
    private static final Integer DURATION_15 = 15000;

    private Room room;

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private GameTimer gameTimer = new GameTimer(DURATION_15);

}
