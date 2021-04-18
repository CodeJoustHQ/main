package com.codejoust.main.util;

public class TestUrls {

    private static final String GET_ROOM = "/api/v1/rooms/%s";
    private static final String PUT_ROOM_JOIN = "/api/v1/rooms/%s/users";
    private static final String POST_ROOM_CREATE = "/api/v1/rooms";
    private static final String PUT_ROOM_HOST = "/api/v1/rooms/%s/host";
    private static final String PUT_ROOM_SETTINGS = "/api/v1/rooms/%s/settings";
    private static final String REMOVE_USER = "/api/v1/rooms/%s/users";
    private static final String DELETE_ROOM = "/api/v1/rooms/%s";

    private static final String START_GAME = "/api/v1/rooms/%s/start";
    private static final String GET_GAME = "/api/v1/games/%s";
    private static final String POST_RUN_CODE = "/api/v1/games/%s/run-code";
    private static final String POST_SUBMISSION = "/api/v1/games/%s/submission";
    private static final String POST_NOTIFICATION = "/api/v1/games/%s/notification";

    private static final String GET_PROBLEM = "/api/v1/problems/%s";
    private static final String GET_DEFAULT_CODE = "/api/v1/problems/%s/default-code";
    private static final String GET_PROBLEM_RANDOM = "/api/v1/problems/random";
    private static final String GET_PROBLEM_ALL = "/api/v1/problems";
    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";
    private static final String POST_TEST_CASE_CREATE = "/api/v1/problems/%s/test-case";
    private static final String PUT_PROBLEM_EDIT = "/api/v1/problems/%s";
    private static final String DELETE_PROBLEM = "/api/v1/problems/%s";

    private static final String USER = "/api/v1/user";

    public static String getRoom(String roomId) {
        return String.format(GET_ROOM, roomId);
    }

    public static String joinRoom(String roomId) {
        return String.format(PUT_ROOM_JOIN, roomId);
    }

    public static String createRoom() {
        return POST_ROOM_CREATE;
    }

    public static String updateHost(String roomId) {
        return String.format(PUT_ROOM_HOST, roomId);
    }

    public static String updateSettings(String roomId) {
        return String.format(PUT_ROOM_SETTINGS, roomId);
    }

    public static String removeUser(String roomId) {
        return String.format(REMOVE_USER, roomId);
    }

    public static String deleteRoom(String roomId) {
        return String.format(DELETE_ROOM, roomId);
    }

    public static String startGame(String roomId) {
        return String.format(START_GAME, roomId);
    }

    public static String getGame(String roomId) {
        return String.format(GET_GAME, roomId);
    }

    public static String runCode(String roomId) {
        return String.format(POST_RUN_CODE, roomId);
    }

    public static String submitCode(String roomId) {
        return String.format(POST_SUBMISSION, roomId);
    }

    public static String sendNotification(String roomId) {
        return String.format(POST_NOTIFICATION, roomId);
    }

    public static String getProblem(String problemId) {
        return String.format(GET_PROBLEM, problemId);
    }

    public static String getDefaultCode(String problemId) {
        return String.format(GET_DEFAULT_CODE, problemId);
    }

    public static String getRandomProblem() {
        return GET_PROBLEM_RANDOM;
    }

    public static String getAllProblems() {
        return GET_PROBLEM_ALL;
    }

    public static String createProblem() {
        return POST_PROBLEM_CREATE;
    }

    public static String createTestcase(String problemId) {
        return String.format(POST_TEST_CASE_CREATE, problemId);
    }

    public static String editProblem(String problemId) {
        return String.format(PUT_PROBLEM_EDIT, problemId);
    }

    public static String deleteProblem(String problemId) {
        return String.format(DELETE_PROBLEM, problemId);
    }

    public static String user() {
        return USER;
    }
}
