package com.rocketden.main.dao;

import org.springframework.data.repository.CrudRepository;

import com.rocketden.main.model.problem.Problem;

// This will be AUTO IMPLEMENTED by Spring into a Bean called problemRepository
// CRUD refers Create, Read, Update, Delete
public interface ProblemRepository extends CrudRepository<Problem, Integer> {

    Problem findProblemByProblemId(String problemId);
}
