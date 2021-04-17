package com.rocketden.main.util;

public class TestUrls {

    private static final String GET_ROOM = "/api/v1/rooms/%s";
    private static final String PUT_ROOM_JOIN = "/api/v1/rooms/%s/users";
    private static final String POST_ROOM_CREATE = "/api/v1/rooms";
    private static final String PUT_ROOM_HOST = "/api/v1/rooms/%s/host";
    private static final String PUT_ROOM_SETTINGS = "/api/v1/rooms/%s/settings";
    private static final String REMOVE_USER = "/api/v1/rooms/%s/users";
    private static final String DELETE_ROOM = "/api/v1/rooms/%s";

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
}
