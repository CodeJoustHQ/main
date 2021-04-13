package com.rocketden.main.dao;

import com.rocketden.main.model.problem.ProblemDifficulty;
import org.springframework.data.repository.CrudRepository;

import com.rocketden.main.model.problem.Problem;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called problemRepository
// CRUD refers Create, Read, Update, Delete
public interface ProblemRepository extends CrudRepository<Problem, Integer> {

    Problem findProblemByProblemId(String problemId);
    List<Problem> findAllByDifficultyAndApproval(ProblemDifficulty difficulty, Boolean approval);
    List<Problem> findAllByApproval(Boolean approval);
    @Override
    List<Problem> findAll();
}
