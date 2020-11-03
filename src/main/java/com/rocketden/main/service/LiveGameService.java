package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import org.springframework.stereotype.Service;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class LiveGameService extends GameManagementService {

    public LiveGameService(RoomRepository repository, SocketService socketService) {
        super(repository, socketService);
    }

}
