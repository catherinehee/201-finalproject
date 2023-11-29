package com.csci201.finalproject;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;
@Service
@Configuration
public class FirebaseInitializer {

    @Bean("Firebase")
    public void firebaseService() {
        try {
            ClassLoader classLoader = FinalprojectApplication.class.getClassLoader();

//            File file = new File(Objects.requireNonNull(classLoader.getResource("/serviceAccountKey.json")).getFile());
//            FileInputStream serviceAccount = new FileInputStream(file.getAbsolutePath());
            InputStream serviceAccount = classLoader.getResourceAsStream("serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://project-d0622-default-rtdb.firebaseio.com")
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("Initialized FirebaseApp");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @PostConstruct
    public void initialization() {
        // nothing
    }
}