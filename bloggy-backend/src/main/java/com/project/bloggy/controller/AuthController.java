package com.project.bloggy.controller;

import com.project.bloggy.dto.LoginRequest;
import com.project.bloggy.dto.SignupRequest;
import com.project.bloggy.dto.UserResponse;
import com.project.bloggy.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Get token from header
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            // Optionally store the token in a blacklist for invalidation
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}
