package com.rocketden.main;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEncryptableProperties
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}

}
