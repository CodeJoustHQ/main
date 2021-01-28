package com.rocketden.main.model.problem;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode
public class ProblemInput {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private ProblemIOType type;

    public ProblemInput() {}
    
    public ProblemInput(String name, ProblemIOType type) {
        this.name = name;
        this.type = type;
    }
}
