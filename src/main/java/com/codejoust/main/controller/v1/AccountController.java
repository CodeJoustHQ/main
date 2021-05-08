package com.codejoust.main.controller.v1;

import com.codejoust.main.dto.account.AccountDto;
import com.codejoust.main.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController extends BaseRestController {

    private final AccountService service;

    @Autowired
    public AccountController(AccountService service) {
        this.service = service;
    }

    @GetMapping("/accounts/{uid}")
    public ResponseEntity<AccountDto> getAccount(@PathVariable String uid, @RequestParam(required = false) String token) {
        return new ResponseEntity<>(service.getAccount(uid, token), HttpStatus.OK);
    }

}
