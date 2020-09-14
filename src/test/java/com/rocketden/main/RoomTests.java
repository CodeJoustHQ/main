// package com.rocketden.main;

// import com.rocketden.main.dto.room.CreateRoomResponse;
// import com.rocketden.main.dto.room.JoinRoomRequest;
// import com.rocketden.main.dto.room.JoinRoomResponse;
// import com.rocketden.main.util.Utility;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.annotation.DirtiesContext;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.transaction.annotation.Transactional;

// import static org.junit.Assert.assertEquals;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
// import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
// @AutoConfigureMockMvc
// @DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
// @Transactional
// public class RoomTests {

//     @Autowired
//     private MockMvc mockMvc;

//     private static final String PUT_ROOM = "/api/v1/rooms";
//     private static final String POST_ROOM = "/api/v1/rooms";

//     @Test
//     public void joinNonExistentRoom() throws Exception {
//         // PUT request to join non-existent room should fail
//         JoinRoomRequest request = new JoinRoomRequest();
//         request.setRoomId("012345");
//         request.setPlayerName("Rocket");

//         JoinRoomResponse expected = new JoinRoomResponse();
//         expected.setMessage(JoinRoomResponse.ERROR_NOT_FOUND);

//         MvcResult result = this.mockMvc.perform(put(PUT_ROOM)
//                 .contentType(MediaType.APPLICATION_JSON_VALUE)
//                 .content(Utility.convertObjectToJsonString(request)))
//                 .andDo(print()).andExpect(status().isNotFound())
//                 .andReturn();

//         String jsonResponse = result.getResponse().getContentAsString();
//         JoinRoomResponse actual = Utility.toObject(jsonResponse, JoinRoomResponse.class);

//         assertEquals(expected.getMessage(), actual.getMessage());
//     }

//     @Test
//     public void createValidRoom() throws Exception {
//         // POST request to create valid room should return successful response
//         CreateRoomResponse expected = new CreateRoomResponse();
//         expected.setMessage(CreateRoomResponse.SUCCESS);

//         MvcResult result = this.mockMvc.perform(post(POST_ROOM)
//                 .contentType(MediaType.APPLICATION_JSON_VALUE))
//                 .andDo(print()).andExpect(status().isCreated())
//                 .andReturn();

//         String jsonResponse = result.getResponse().getContentAsString();
//         CreateRoomResponse actual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

//         assertEquals(expected.getMessage(), actual.getMessage());
//     }

//     @Test
//     public void createAndJoinRoom() throws Exception {
//         // POST request to create room and PUT request to join room should succeed
//         // 1. Send POST request and verify room was created
//         CreateRoomResponse createExpected = new CreateRoomResponse();
//         createExpected.setMessage(CreateRoomResponse.SUCCESS);

//         MvcResult result = this.mockMvc.perform(post(POST_ROOM)
//                 .contentType(MediaType.APPLICATION_JSON_VALUE))
//                 .andDo(print()).andExpect(status().isCreated())
//                 .andReturn();

//         String jsonResponse = result.getResponse().getContentAsString();
//         CreateRoomResponse createActual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

//         assertEquals(createExpected.getMessage(), createActual.getMessage());

//         // Get id of created room to join
//         String roomId = createActual.getRoomId();

//         // 2. Send PUT request and verify room was joined
//         JoinRoomRequest request = new JoinRoomRequest();
//         request.setRoomId(roomId);
//         request.setPlayerName("Rocket");

//         JoinRoomResponse expected = new JoinRoomResponse();
//         expected.setMessage(JoinRoomResponse.SUCCESS);
//         expected.setPlayerName("Rocket");
//         expected.setRoomId(roomId);

//         result = this.mockMvc.perform(put(PUT_ROOM)
//                 .contentType(MediaType.APPLICATION_JSON_VALUE)
//                 .content(Utility.convertObjectToJsonString(request)))
//                 .andDo(print()).andExpect(status().isOk())
//                 .andReturn();

//         jsonResponse = result.getResponse().getContentAsString();
//         JoinRoomResponse actual = Utility.toObject(jsonResponse, JoinRoomResponse.class);

//         assertEquals(expected.getMessage(), actual.getMessage());
//         assertEquals(expected.getPlayerName(), actual.getPlayerName());
//         assertEquals(expected.getRoomId(), actual.getRoomId());
//     }
// }
