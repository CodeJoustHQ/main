package com.rocketden.main.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

public class InstantDeserializer extends JsonDeserializer<Instant> {

    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_INSTANT;

    @Override
    public Instant deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        return Instant.from(dateTimeFormatter.parse(jsonParser.getText()));
    }
}
