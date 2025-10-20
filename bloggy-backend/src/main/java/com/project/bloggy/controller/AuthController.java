package com.project.bloggy.controller;

import com.project.bloggy.dto.LoginRequest;
import com.project.bloggy.dto.SignupRequest;
import com.project.bloggy.dto.UserResponse;
import com.project.bloggy.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/signup")
    public UserResponse signup(@RequestBody SignupRequest signupRequest) {


        return authService.signup(signupRequest);
    }
}
