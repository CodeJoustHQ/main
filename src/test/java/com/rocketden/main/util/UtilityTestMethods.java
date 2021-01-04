package com.rocketden.main.util;

import java.lang.reflect.Type;

import com.google.gson.Gson;

public class UtilityTestMethods {

    public static String convertObjectToJsonString(Object o) {
        Gson gson = new Gson();
        return gson.toJson(o);
    }

    public static <T> T toObject(String json, Class<T> c) {
        Gson gson = new Gson();
        return gson.fromJson(json, c);
    }

    public static <T> T toObjectList(String json, Type type) {
        Gson gson = new Gson();
        return gson.fromJson(json, type);
    }
}
