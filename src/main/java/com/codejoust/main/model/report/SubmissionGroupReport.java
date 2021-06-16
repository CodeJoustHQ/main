package com.codejoust.main.model.report;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.codejoust.main.model.User;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Getter
@Setter
public class SubmissionGroupReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String gameReportId;

    @OneToMany(mappedBy = "submissionGroupReport", fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    private List<SubmissionReport> submissionReports = new ArrayList<>();

    // This column holds the primary key of the user who made these submissions
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_table_id")
    private User user;
}
