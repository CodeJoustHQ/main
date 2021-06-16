package com.codejoust.main.model.report;

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
public class SubmissionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    private String code;

    private CodeLanguage language;

    // The time that the submission was received.
    private Instant startTime;

    private Integer numCorrect;

    private Integer numTestCases;

    private Double runtime;

    // This column holds the primary key of the associated submission group
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submission_group_table_id")
    private SubmissionGroupReport submissionGroupReport;
}
