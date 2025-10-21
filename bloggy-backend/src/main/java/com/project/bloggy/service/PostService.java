package com.project.bloggy.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.bloggy.dto.PostRequest;
import com.project.bloggy.dto.PostResponse;
import com.project.bloggy.entity.Post;
import com.project.bloggy.entity.User;
import com.project.bloggy.repository.PostRepository;
import com.project.bloggy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createPost(String postJson, MultipartFile file, Authentication authentication) throws Exception {
        // Log received JSON
        System.out.println("Received post JSON: " + postJson);

        // Parse JSON
        PostRequest postRequest = objectMapper.readValue(postJson, PostRequest.class);

        // Fetch logged-in user from JWT
        String email = authentication.getName();
        System.out.println("Authenticated user's email from JWT: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Fetched user from DB: " + user.getUsername() + ", ID: " + user.getId());

        // Handle image upload
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = imageUploadService.uploadImage(file);
            System.out.println("Uploaded image URL: " + imageUrl);
        } else {
            System.out.println("No image uploaded");
        }

        // Create post
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setImageUrl(imageUrl);
        post.setUser(user); // assign logged-in user

        postRepository.save(post);
        System.out.println("Post saved successfully with ID: " + post.getId());

        // ✅ Return a simple success message
        return "Post uploaded successfully!";
    }


    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        List<PostResponse> responseList = new ArrayList<>();

        for (Post post : posts) {
            PostResponse response = new PostResponse();
            response.setId(post.getId());
            response.setTitle(post.getTitle());
            response.setContent(post.getContent());
            response.setImageUrl(post.getImageUrl());
            response.setCreatedAt(post.getCreatedAt());
            response.setUpdatedAt(post.getUpdatedAt());
            response.setUserId(post.getUser().getId());

            responseList.add(response);
        }

        return responseList;
    }

}
