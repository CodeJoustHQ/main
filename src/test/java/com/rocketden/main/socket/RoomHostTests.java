package com.rocketden.main.socket;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.util.SocketTestMethods;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class RoomHostTests {

    @LocalServerPort
    private Integer port;

    @Autowired
    private TestRestTemplate template;

    private static final String CONNECT_ENDPOINT = "ws://localhost:{port}" + BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint";

    private String baseRestEndpoint;
    private String changeHostsEndpoint;
    private RoomDto room;

    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "098765";

    @BeforeEach
    public void setup() throws Exception {
        // Set up a room with two users
        baseRestEndpoint = "http://localhost:" + port + "/api/v1/rooms";

        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // Create room first
        HttpEntity<CreateRoomRequest> createEntity = new HttpEntity<>(createRequest);
        RoomDto response = template.postForObject(baseRestEndpoint, createEntity, RoomDto.class);

        assertNotNull(response);
        room = response;

        changeHostsEndpoint = String.format("%s/%s/host", baseRestEndpoint, room.getRoomId());

        // Connect host to the socket endpoint
        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID, this.port);

        // Second user joins room but has not connected to the socket yet
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);

        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        response = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        assertNotNull(response);
        room = response;
    }

    @Test
    public void changeRoomHostSuccess() throws Exception {
        // Connect second user to the socket
        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID_2, this.port);
        UserDto user = room.getUsers().get(1);

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(room.getHost());
        request.setNewHost(user);

        HttpEntity<UpdateHostRequest> entity = new HttpEntity<>(request);
        ResponseEntity<RoomDto> response = template.exchange(changeHostsEndpoint, HttpMethod.PUT, entity, RoomDto.class);
        RoomDto actual = response.getBody();

        assertNotNull(actual);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, actual.getHost());

        String getEndpoint = String.format("%s/%s", baseRestEndpoint, room.getRoomId());
        actual = template.getForObject(getEndpoint, RoomDto.class);

        assertNotNull(actual);
        assertEquals(user, actual.getHost());
    }

    @Test
    public void changeRoomHostInvalidPermissions() throws Exception {
        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID_2, this.port);
        UserDto user = room.getUsers().get(1);

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(user);
        request.setNewHost(room.getHost());

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        HttpEntity<UpdateHostRequest> entity = new HttpEntity<>(request);
        ResponseEntity<ApiErrorResponse> response =
                template.exchange(changeHostsEndpoint, HttpMethod.PUT, entity, ApiErrorResponse.class);
        ApiErrorResponse actual = response.getBody();

        assertEquals(ERROR.getStatus(), response.getStatusCode());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void changeRoomHostNonExistentRoom() throws Exception {
        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID_2, this.port);
        UserDto user = room.getUsers().get(1);

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(room.getHost());
        request.setNewHost(user);

        ApiError ERROR = RoomError.NOT_FOUND;

        HttpEntity<UpdateHostRequest> entity = new HttpEntity<>(request);
        String badEndpoint = String.format("%s/%s/host", baseRestEndpoint, "999999");
        ResponseEntity<ApiErrorResponse> response =
                template.exchange(badEndpoint, HttpMethod.PUT, entity, ApiErrorResponse.class);
        ApiErrorResponse actual = response.getBody();

        assertEquals(ERROR.getStatus(), response.getStatusCode());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void changeRoomHostNewHostNotFound() {
        UserDto user = new UserDto();
        user.setNickname("unknown");
        user.setUserId("101010");

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(room.getHost());
        request.setNewHost(user);

        ApiError ERROR = UserError.NOT_FOUND;

        HttpEntity<UpdateHostRequest> entity = new HttpEntity<>(request);
        ResponseEntity<ApiErrorResponse> response =
                template.exchange(changeHostsEndpoint, HttpMethod.PUT, entity, ApiErrorResponse.class);
        ApiErrorResponse actual = response.getBody();

        assertEquals(ERROR.getStatus(), response.getStatusCode());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void changeRoomHostInactiveUser() throws Exception {
        // User has not yet connected to the socket and is thus inactive
        UserDto user = room.getUsers().get(1);

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(room.getHost());
        request.setNewHost(user);

        ApiError ERROR = RoomError.INACTIVE_USER;

        HttpEntity<UpdateHostRequest> entity = new HttpEntity<>(request);
        ResponseEntity<ApiErrorResponse> response =
                template.exchange(changeHostsEndpoint, HttpMethod.PUT, entity, ApiErrorResponse.class);
        ApiErrorResponse actual = response.getBody();

        assertEquals(ERROR.getStatus(), response.getStatusCode());
        assertEquals(ERROR.getResponse(), actual);
    }
}
