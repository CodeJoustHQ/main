package com.rocketden.main.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity // This tells Hibernate to make a table out of this class
@Getter
@Setter
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private String description;
    private List<ProblemTestCase> testCases = new ArrayList<>();
}
