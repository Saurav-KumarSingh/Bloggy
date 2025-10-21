package com.project.bloggy.controller;

import com.project.bloggy.dto.PostResponse;
import com.project.bloggy.entity.Post;
import com.project.bloggy.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/upload")
    public ResponseEntity<String> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "image", required = false) MultipartFile file,
            Authentication authentication) {
        try {

            String result = postService.createPost(postJson, file, authentication);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping("/")
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }
}
