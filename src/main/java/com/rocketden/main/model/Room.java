package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private String id;

    private String roomId;

    private LocalDateTime createdDate = LocalDateTime.now();
}
