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

    /*
     * Create default Game object that does not immediately construct the Timer.
     */
    public Game() {}

    /**
     * Constructor to attach the Room field and start the Game Timer.
     * 
     * @param room The room connected to this game.
     */
    public Game(Room room) {
        this.room = room;
        this.gameTimer = new GameTimer(DURATION_15, room.getRoomId());
    }

    // 15 minute duration for the GameTimer, in seconds.
    private static final Long DURATION_15 = (long) 900;

    private Room room;

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private GameTimer gameTimer;

}
