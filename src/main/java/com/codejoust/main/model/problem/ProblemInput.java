package com.codejoust.main.model.problem;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_table_id")
    private Problem problem;

    public ProblemInput() {}
    
    public ProblemInput(String name, ProblemIOType type) {
        this.name = name;
        this.type = type;
    }
}
