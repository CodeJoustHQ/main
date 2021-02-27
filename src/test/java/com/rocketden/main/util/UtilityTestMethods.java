package com.rocketden.main.util;

import java.lang.reflect.Type;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

public class UtilityTestMethods {

    private final static String DATE_TIME_FORMAT_PATTERN = "yyyy-MM-dd'T'HH:mm:ss";

    public static String convertObjectToJsonString(Object o) {
        Gson gson = new Gson();
        return gson.toJson(o);
    }

    public static <T> T toObject(String json, Class<T> c) {
        Gson gson = new Gson();
        return gson.fromJson(json, c);
    }

    public static <T> T toObjectType(String json, Type type) {
        Gson gson = new Gson();
        return gson.fromJson(json, type);
    }

    // Include type adapter to appropriately convert LocalDateTime.
    public static <T> T toObjectLocalDateTime(String json, Class<T> c) {
        Gson gson = new GsonBuilder().registerTypeAdapter(Instant.class,
            new JsonDeserializer<Instant>() { 
            @Override 
            public Instant deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
                    DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                        .appendPattern(DATE_TIME_FORMAT_PATTERN)
                        // optional decimal point followed by 1 to 6 digits
                        .optionalStart()
                        .appendFraction(ChronoField.MICRO_OF_SECOND, 1, 6, true)
                        .optionalEnd()
                        .toFormatter(); 
                    return Instant.parse(json.getAsString());
                } 
            }).create();
        return gson.fromJson(json, c);
    }
}
