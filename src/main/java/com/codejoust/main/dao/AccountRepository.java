package com.codejoust.main.dao;

import com.codejoust.main.model.Account;

import org.springframework.data.repository.CrudRepository;

public interface AccountRepository extends CrudRepository<Account, Integer> {

    Account findAccountByUid(String uid);
}
