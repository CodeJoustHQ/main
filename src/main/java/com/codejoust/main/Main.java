package com.codejoust.main;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
@EnableEncryptableProperties
@Log4j2
public class Main {

	private static final String FIREBASE_KEYFILE = "FIREBASE_KEYFILE";

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);

		// Initialize Firebase library for user authentication actions
		String keyfile = System.getenv(FIREBASE_KEYFILE);
		if (keyfile == null) {
			log.error("Could not find the firebase keyfile in an environment variable.");
			log.error("Please set this value before launching the program.");
			System.exit(1);
		}

		InputStream stream = new ByteArrayInputStream(keyfile.getBytes(StandardCharsets.UTF_8));
		try {
			FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(stream))
				.build();

			FirebaseApp.initializeApp(options);
		} catch (IOException e) {
			log.error("Failed to parse and read the given firebase keyfile.");
			System.exit(1);
		}
	}

}
