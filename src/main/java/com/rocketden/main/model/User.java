package com.rocketden.main.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Getter
@Setter
public class User {

    // ID used for the database.
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // User ID for user identification and accessible from frontend.
    @EqualsAndHashCode.Include
    private String userId;
    
    @EqualsAndHashCode.Include
    private String nickname;

    // The session ID of the user connection, auto-generated by sockets.
    private String sessionId;

    // This column holds the primary key of the room (not the roomId variable)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_table_id")
    private Room room;
}
