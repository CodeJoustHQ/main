package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@Setter
public class ProblemTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String input;
    private String output;
    private Boolean hidden = false;
}
