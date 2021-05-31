package com.codejoust.main.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemTag;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Getter
@Setter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // Firebase unique identifier (UID) - links this account with the Firebase info
    @EqualsAndHashCode.Include
    private String uid;

    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    private List<Problem> problems = new ArrayList<>();

    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    private List<ProblemTag> problemTags = new ArrayList<>();
}
