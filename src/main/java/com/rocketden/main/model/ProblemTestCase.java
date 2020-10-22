package com.rocketden.main.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProblemTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @EqualsAndHashCode.Include
    private String input;

    @EqualsAndHashCode.Include
    private String output;

    @EqualsAndHashCode.Include
    private Boolean hidden = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_table_id")
    private Problem problem;
}
