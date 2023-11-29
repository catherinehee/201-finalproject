package com.csci201.finalproject.User;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.csci201.finalproject.Document.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.DependsOn;


@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@DependsOn("Firebase")
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/users/test")
    public String testUser() throws ExecutionException, InterruptedException {
        return "test";
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/users/{username}")
    public User getUser(@PathVariable String username) throws ExecutionException, InterruptedException {
        return userService.getUserDetailsByUsername(username);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/users/{userid}/documents")
    public List<Map<String, String>> getDocumentsByUser(@PathVariable String userid) throws ExecutionException, InterruptedException {

        return userService.getDocumentsByUser(userid);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PatchMapping("/users/{userid}/documents/{docid}/add")
    public String addDocument(@PathVariable String userid, @PathVariable String docid) throws ExecutionException, InterruptedException {

        return userService.addDocument(userid, docid);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/users/{userid}/documents/{docid}/delete")
    public String deleteDocument(@PathVariable String userid, @PathVariable String docid) throws ExecutionException, InterruptedException {

        return userService.deleteDocument(userid, docid);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userService.getUserDetails();
    }


    @PutMapping("/users")
    public String update(@RequestBody User user) throws ExecutionException, InterruptedException {

        return userService.updateUser(user);
    }


    @DeleteMapping("/users/{username}")
    public String deleteUser(@PathVariable String username) throws ExecutionException, InterruptedException {

        return userService.deleteUser(username);
    }
}