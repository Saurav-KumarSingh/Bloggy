package com.project.bloggy.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)

    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, updatable = false)
   private LocalDateTime createdAt;

    @Column(nullable = false)

    private LocalDateTime updatedAt;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
   private UserRole role;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;


    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<Comment> comments;



    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
