package com.csci201.finalproject.User;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users")
    public String saveUser(@RequestBody User user) throws ExecutionException, InterruptedException {

        return userService.saveUser(user);
    }

    @CrossOrigin(origins = "http://localhost:3000") // TODO: might delete
    @GetMapping("/users/{username}")
    public User getUser(@PathVariable String username) throws ExecutionException, InterruptedException {

        return userService.getUserDetailsByUsername(username);
    }

    @CrossOrigin(origins = "http://localhost:3000") // TODO: might delete
    @GetMapping("/users/{userid}/documents")
    public List<String> getDocumentsByUser(@PathVariable String userid) throws ExecutionException, InterruptedException {

        return userService.getDocumentsByUser(userid);
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