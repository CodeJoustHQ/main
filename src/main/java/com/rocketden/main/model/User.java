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

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @EqualsAndHashCode.Include
    private String nickname;

    @EqualsAndHashCode.Include
    private boolean connected;

    // This column holds the primary key of the room (not the roomId variable)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_table_id")
    private Room room;
}
