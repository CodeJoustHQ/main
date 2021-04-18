package com.codejoust.main.util;

import java.lang.reflect.Type;
import java.time.Instant;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

public class UtilityTestMethods {

    public static String convertObjectToJsonString(Object o) {
        if (o instanceof String) {
            return (String) o;
        }
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

    // Include type adapter to appropriately convert Instant.
    public static <T> T toObjectInstant(String json, Class<T> c) {
        Gson gson = new GsonBuilder().registerTypeAdapter(Instant.class,
            new JsonDeserializer<Instant>() { 
            @Override 
            public Instant deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
                    return Instant.parse(json.getAsString());
                } 
            }).create();
        return gson.fromJson(json, c);
    }
}
