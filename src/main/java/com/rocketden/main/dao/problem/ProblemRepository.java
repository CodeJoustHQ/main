package com.rocketden.main.dao.problem;

import org.springframework.data.repository.CrudRepository;

import com.rocketden.main.dto.problem.Problem;

// This will be AUTO IMPLEMENTED by Spring into a Bean called problemRepository
// CRUD refers Create, Read, Update, Delete
public interface ProblemRepository extends CrudRepository<Problem, Integer> {

}
