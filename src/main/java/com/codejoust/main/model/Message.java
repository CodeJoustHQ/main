package com.codejoust.main.model;

import java.time.Instant;

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
public class Message {

    // ID used for the database.
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // The user who sent the message.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_table_id")
    private User user;
    
    @EqualsAndHashCode.Include
    private String message;

    private Instant sentDateTime = Instant.now();
}
