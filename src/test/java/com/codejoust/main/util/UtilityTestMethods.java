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
        Gson gson = new GsonBuilder().registerTypeAdapter(Instant.class,
                (JsonDeserializer<Instant>) (json1, typeOfT, context) -> Instant.parse(json1.getAsString())).create();
        return gson.fromJson(json, c);
    }

    public static <T> T toObjectType(String json, Type type) {
        Gson gson = new Gson();
        return gson.fromJson(json, type);
    }
}
