package com.project.bloggy.dto;

import com.project.bloggy.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    private String email;
    private String username;
    private String password;
    private UserRole role;

}
