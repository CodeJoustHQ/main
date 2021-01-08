package com.rocketden.main.util;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

public class UtilityTestMethods {

    public static String convertObjectToJsonString(Object o) {
        Gson gson = new Gson();
        return gson.toJson(o);
    }

    public static <T> T toObject(String json, Class<T> c) {
        Gson gson = new Gson();
        return gson.fromJson(json, c);
    }

    // Include type adapter to appropriately convert LocalDateTime.
    public static <T> T toObjectLocalDateTime(String json, Class<T> c) {
        Gson gson = new GsonBuilder().registerTypeAdapter(LocalDateTime.class,
            new JsonDeserializer<LocalDateTime>() { 
            @Override 
            public LocalDateTime deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException { 
                return LocalDateTime.parse(json.getAsString(),
                    DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"));
                } 
            }).create();
        return gson.fromJson(json, c);
    }
}
