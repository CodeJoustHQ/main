package com.codejoust.main.dao;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

import com.codejoust.main.model.problem.ProblemTag;

// This will be AUTO IMPLEMENTED by Spring into a Bean called problemRepository
// CRUD refers Create, Read, Update, Delete
public interface ProblemTagRepository extends CrudRepository<ProblemTag, Integer> {

    ProblemTag findProblemTagByName(String name);
    ProblemTag findTagByTagId(String tagId);
    @Override
    List<ProblemTag> findAll();
}
