package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.dao.RoomRepository;
import com.codejoust.main.dto.game.GameMapper;
import com.codejoust.main.dto.problem.SelectableProblemDto;
import com.codejoust.main.dto.room.CreateRoomRequest;
import com.codejoust.main.dto.room.DeleteRoomRequest;
import com.codejoust.main.dto.room.JoinRoomRequest;
import com.codejoust.main.dto.room.RemoveUserRequest;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.room.RoomMapper;
import com.codejoust.main.dto.room.SetSpectatorRequest;
import com.codejoust.main.dto.room.UpdateHostRequest;
import com.codejoust.main.dto.room.UpdateSettingsRequest;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.RoomError;
import com.codejoust.main.exception.TimerError;
import com.codejoust.main.exception.UserError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;
    public static final long MAX_DURATION = 3600; // 1 hour
    public static final int MAX_SIZE = 30;
    public static final int MAX_NUM_PROBLEMS = 10;

    private final RoomRepository repository;
    private final SocketService socketService;
    private final ProblemService problemService;
    private final GameManagementService gameManagementService;
    private final FirebaseService firebaseService;
    private final AccountRepository accountRepository;
    private final Utility utility;

    @Autowired
    public RoomService(RoomRepository repository, SocketService socketService,
                       ProblemService problemService, Utility utility,
                       FirebaseService firebaseService,
                       AccountRepository accountRepository,
                       GameManagementService gameManagementService) {
        this.repository = repository;
        this.socketService = socketService;
        this.problemService = problemService;
        this.gameManagementService = gameManagementService;
        this.firebaseService = firebaseService;
        this.accountRepository = accountRepository;
        this.utility = utility;
    }

    public RoomDto joinRoom(String roomId, JoinRoomRequest request, String token) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        if (room.isFull()) {
            throw new ApiException(RoomError.ALREADY_FULL);
        }

        // Get the user who initialized the request.
        User user = UserMapper.toEntity(request.getUser());

        // Return error if user is invalid or not provided
        if (user == null || !UserService.validNickname(user.getNickname())) {
            throw new ApiException(UserError.INVALID_USER);
        }

        // Return error if a user with the same nickname is in the room.
        if (room.containsUserWithNickname(user.getNickname())) {
            throw new ApiException(RoomError.DUPLICATE_USERNAME);
        }

        // Make user a spectator if the room is already active.
        if (room.getActive()) {
            user.setSpectator(true);
        }

        // Add userId if not already present.
        if (user.getUserId() == null) {
            user.setUserId(utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY));
        }

        // Set the account associated with the host, if any.
        if (token == null) {
            user.setAccount(null);
        } else {
            String uid = firebaseService.verifyToken(token);
            user.setAccount(accountRepository.findAccountByUid(uid));
        }

        // Add the user to the room.
        room.addUser(user);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);

        // If active game, send to game socket; otherwise, send to room socket.
        if (room.getActive()) {
            Game game = gameManagementService.getGameFromRoomId(room.getRoomId());
            game.setRoom(room);
            socketService.sendSocketUpdate(GameMapper.toDto(game));
        } else {
            socketService.sendSocketUpdate(roomDto);
        }
        return roomDto;
    }

    public RoomDto createRoom(CreateRoomRequest request, String token) {
        User host = UserMapper.toEntity(request.getHost());

        // Do not create room if provided host is invalid.
        if (host == null) {
            throw new ApiException(RoomError.NO_HOST);
        }
        if (!UserService.validNickname(host.getNickname())) {
            throw new ApiException(UserError.INVALID_USER);
        }

        // Create user ID for the host if not already present.
        if (host.getUserId() == null) {
            host.setUserId(utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY));
        }

        // Set the account associated with the host, if any.
        if (token == null) {
            host.setAccount(null);
        } else {
            String uid = firebaseService.verifyToken(token);
            host.setAccount(accountRepository.findAccountByUid(uid));
        }

        Room room = new Room();
        room.setRoomId(utility.generateUniqueId(RoomService.ROOM_ID_LENGTH, Utility.ROOM_ID_KEY));
        room.setHost(host);
        room.addUser(host);
        repository.save(room);

        return RoomMapper.toDto(room);
    }

    public RoomDto deleteRoom(String roomId, DeleteRoomRequest request) {
        Room room = repository.findRoomByRoomId(roomId);
        User host = UserMapper.toEntity(request.getHost());

        // Do not create room if provided user is not the host.
        if (!room.getHost().equals(host)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        RoomDto roomDto = RoomMapper.toDto(room);

        // Delete the room and all users within as well.
        repository.delete(room);
        return roomDto;
    }

    public RoomDto getRoom(String roomId) {
        Room room = repository.findRoomByRoomId(roomId);

        // Throw an error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        return RoomMapper.toDto(room);
    }

    public RoomDto removeUser(String roomId, RemoveUserRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        User initiator = UserMapper.toEntity(request.getInitiator());
        User userToDelete = UserMapper.toEntity(request.getUserToDelete());

        // Return error if the initiator is not the host or user themselves
        if (!room.getHost().equals(initiator) && !initiator.equals(userToDelete)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Return error if user to delete does not exist in room
        if (!room.getUsers().contains(userToDelete)) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        // Assign new host if user being kicked is host
        if (room.getHost().equals(userToDelete)) {

            // If the host is the last user, delete the room and return info.
            if (room.getUsers().size() == 1) {
                DeleteRoomRequest deleteRoomRequest = new DeleteRoomRequest();
                deleteRoomRequest.setHost(request.getUserToDelete());
                return deleteRoom(roomId, deleteRoomRequest);
            }

            return conditionallyUpdateRoomHost(room, userToDelete, true);
        }

        room.removeUser(userToDelete);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    public RoomDto updateRoomHost(String roomId, UpdateHostRequest request, boolean deleteOldHost) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Get the initiator and proposed new host from the request
        User initiator = UserMapper.toEntity(request.getInitiator());
        User proposedNewHost = UserMapper.toEntity(request.getNewHost());

        // Return error if the initiator is not the host
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Return error if the proposed new host is not in the room
        if (!room.getUsers().contains(proposedNewHost)) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        User newHost = room.getEquivalentUser(proposedNewHost);

        // Return error if the proposed new host is currently inactive
        if (newHost.getSessionId() == null) {
            throw new ApiException(RoomError.INACTIVE_USER);
        }

        // Change the host to the new user
        room.setHost(newHost);
        
        // Remove the old host and initiator.
        if (deleteOldHost) {
            room.removeUser(initiator);
        }
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    // This function randomly assigns a new host in the room
    public RoomDto conditionallyUpdateRoomHost(Room room, User user, boolean deleteOldHost) {
        // If the disconnected user is the host and another active user is present, reassign the host for the room.
        if (room.getHost().equals(user)) {
            UpdateHostRequest request = new UpdateHostRequest();
            request.setInitiator(UserMapper.toDto(user));

            // Get the first active non-host user, if one exists.
            for (User roomUser : room.getUsers()) {
                if (roomUser.getSessionId() != null && !roomUser.equals(room.getHost())) {
                    request.setNewHost(UserMapper.toDto(roomUser));
                    break;
                }
            }

            // Determine whether an active non-host user was found, and if so, send an update room host request.
            if (request.getNewHost() != null) {
                return updateRoomHost(room.getRoomId(), request, deleteOldHost);
            }
        }
        // If conditions fail to match, just return the room as it is
        return RoomMapper.toDto(room);
    }

    public RoomDto updateRoomSettings(String roomId, UpdateSettingsRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Return error if the initiator is not the host
        User initiator = UserMapper.toEntity(request.getInitiator());
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Set new difficulty value if not null
        if (request.getDifficulty() != null) {
            room.setDifficulty(request.getDifficulty());
        }

        // Set new duration if not null
        Long duration = request.getDuration();
        if (duration != null) {
            if (duration <= 0 || duration > MAX_DURATION) {
                throw new ApiException(TimerError.INVALID_DURATION);
            }
            room.setDuration(request.getDuration());
        }

        // Set new size if not null
        Integer size = request.getSize();
        if (size != null) {
            if (size <= 0 || size > MAX_SIZE + 1 || size < room.getUsers().size()) {
                throw new ApiException(RoomError.BAD_ROOM_SIZE);
            }

            room.setSize(size);
        }
        
        // Set number of problems if not null
        if (request.getNumProblems() != null) {
            if (request.getNumProblems() <= 0 || request.getNumProblems() > MAX_NUM_PROBLEMS
                    || request.getProblems() != null && request.getProblems().size() > MAX_NUM_PROBLEMS) {
                throw new ApiException(ProblemError.INVALID_NUMBER_REQUEST);
            }
            room.setNumProblems(request.getNumProblems());
        }

        updateRoomSettingsSelectedProblems(request.getProblems(), room);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    private void updateRoomSettingsSelectedProblems(List<SelectableProblemDto> selectedProblems, Room room) {
        // Set selected problems if not null
        boolean problemsHaveChanged = false;

        if (selectedProblems != null) {
            if (selectedProblems.size() > MAX_NUM_PROBLEMS) {
                throw new ApiException(ProblemError.INVALID_NUMBER_REQUEST);
            }

            problemsHaveChanged = checkSelectedProblemChanges(selectedProblems, room);
        }

        if (problemsHaveChanged) {
            List<Problem> newProblems = new ArrayList<>();
            for (SelectableProblemDto selected : selectedProblems) {
                Problem problem = problemService.getProblemEntity(selected.getProblemId());

                if (problem == null) {
                    throw new ApiException(ProblemError.NOT_FOUND);
                }

                newProblems.add(problem);
            }
            room.setProblems(newProblems);

            if (newProblems.size() > 0) {
                room.setNumProblems(newProblems.size());
            } else {
                room.setNumProblems(1);
            }
        }
    }

    private boolean checkSelectedProblemChanges(List<SelectableProblemDto> selectedProblems, Room room) {
        // Check if selected problems have changed at all
        if (selectedProblems.size() != room.getProblems().size()) {
            return true;
        } else {
            // Loop through to check if problemIds match
            for (int i = 0; i < selectedProblems.size(); i++) {
                String problemId = room.getProblems().get(i).getProblemId();
                if (!selectedProblems.get(i).getProblemId().equals(problemId)) {
                    return true;
                }
            }
        }

        return false;
    }

    public RoomDto setSpectator(String roomId, SetSpectatorRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Return error if user changes status in active game.
        if (room.getActive()) {
            throw new ApiException(RoomError.ACTIVE_GAME);
        }

        // Return error if the initiator or receiver are null
        if (request.getInitiator() == null || request.getReceiver() == null) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        // Return error if the initiator or receiver are not in the room
        if (room.getUserByUserId(request.getReceiver().getUserId()) == null
            || room.getUserByUserId(request.getInitiator().getUserId()) == null) {
            throw new ApiException(RoomError.USER_NOT_FOUND);
        }
        // Return error if the initiator is not the host or the same as the receiver
        User initiator = UserMapper.toEntity(request.getInitiator());
        User receiver = UserMapper.toEntity(request.getReceiver());
        if (!room.getHost().equals(initiator) && !initiator.equals(receiver)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Return error if the requested spectator is null
        if (request.getSpectator() == null) {
            throw new ApiException(RoomError.BAD_SETTING);
        }

        User modifiedUser = room.getUserByUserId(receiver.getUserId());
        modifiedUser.setSpectator(request.getSpectator());
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return RoomMapper.toDto(room);
    }
}
