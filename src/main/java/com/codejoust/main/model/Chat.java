package com.codejoust.main.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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
public class Chat {

    // ID used for the database.
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // The user who sent the message.
    @EqualsAndHashCode.Include
    private Room room;
    
    @EqualsAndHashCode.Include
    private List<Message> messages = new ArrayList<>();
}
