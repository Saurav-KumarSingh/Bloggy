package com.project.bloggy.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.bloggy.dto.CommentResponse;
import com.project.bloggy.dto.PostRequest;
import com.project.bloggy.dto.PostResponse;
import com.project.bloggy.entity.Comment;
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


        // Parse JSON
        PostRequest postRequest = objectMapper.readValue(postJson, PostRequest.class);

        // Fetch logged-in user from JWT
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // Handle image upload
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = imageUploadService.uploadImage(file);
        }

        // Create post
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setImageUrl(imageUrl);
        post.setUser(user); // assign logged-in user

        postRepository.save(post);

        // ✅ Return a simple success message
        return "Post uploaded successfully!";
    }


//    public List<PostResponse> getAllPosts() {
//        List<Post> posts = postRepository.findAll();
//        List<PostResponse> responseList = new ArrayList<>();
//
//        for (Post post : posts) {
//            PostResponse response = new PostResponse();
//            response.setId(post.getId());
//            response.setTitle(post.getTitle());
//            response.setContent(post.getContent());
//            response.setImageUrl(post.getImageUrl());
//            response.setCreatedAt(post.getCreatedAt());
//            response.setUpdatedAt(post.getUpdatedAt());
//            response.setUserId(post.getUser().getId());
//
//            responseList.add(response);
//        }
//
//        return responseList;
//    }


    public List<PostResponse> getAllPostsWithComments() {
        List<Post> posts = postRepository.findAll(); // simple findAll
        List<PostResponse> responseList = new ArrayList<>();

        for (Post post : posts) {
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getId());
            postResponse.setTitle(post.getTitle());
            postResponse.setContent(post.getContent());
            postResponse.setImageUrl(post.getImageUrl());
            postResponse.setUserId(post.getUser().getId());
            postResponse.setUsername(post.getUser().getUsername());
            postResponse.setCreatedAt(post.getCreatedAt());
            postResponse.setUpdatedAt(post.getUpdatedAt());

            // Add all comments for this post
            List<CommentResponse> commentResponses = new ArrayList<>();
            for (Comment comment : post.getComments()) {
                CommentResponse cr = new CommentResponse();
                cr.setId(comment.getId());
                cr.setContent(comment.getContent());
                cr.setUserId(comment.getUser().getId());
                cr.setUsername(comment.getUser().getUsername());
                cr.setCreatedAt(comment.getCreatedAt());
                commentResponses.add(cr);
            }
            postResponse.setComments(commentResponses);

            responseList.add(postResponse);
        }

        return responseList;
    }

    public PostResponse getPostById(Long id) {
        // Fetch the post by ID or throw exception if not found
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        // Convert Post entity to PostResponse
        PostResponse postResponse = new PostResponse();
        postResponse.setId(post.getId());
        postResponse.setTitle(post.getTitle());
        postResponse.setContent(post.getContent());
        postResponse.setImageUrl(post.getImageUrl());
        postResponse.setCreatedAt(post.getCreatedAt());
        postResponse.setUpdatedAt(post.getUpdatedAt());

        // Safely set the user info if present
        if (post.getUser() != null) {
            postResponse.setUserId(post.getUser().getId());
            postResponse.setUsername(post.getUser().getUsername());
        }

        // Add all comments for this post
        List<CommentResponse> commentResponses = new ArrayList<>();
        if (post.getComments() != null) {
            for (Comment comment : post.getComments()) {
                CommentResponse cr = new CommentResponse();
                cr.setId(comment.getId());
                cr.setContent(comment.getContent());
                cr.setUserId(comment.getUser().getId());
                cr.setUsername(comment.getUser().getUsername());
                cr.setCreatedAt(comment.getCreatedAt());
                commentResponses.add(cr);
            }
        }
        postResponse.setComments(commentResponses);

        return postResponse;
    }



    public PostResponse updatePost(Long id, PostRequest postRequest, Authentication authentication) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        String loggedInEmail = authentication.getName();

        // Check if the logged-in user is the owner of the post
        if (!post.getUser().getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not authorized to update this post");
        }

        // Update fields
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());

        // Save updated post
        Post updatedPost = postRepository.save(post);

        // Convert to PostResponse
        PostResponse postResponse = new PostResponse();
        postResponse.setId(updatedPost.getId());
        postResponse.setTitle(updatedPost.getTitle());
        postResponse.setContent(updatedPost.getContent());
        postResponse.setImageUrl(updatedPost.getImageUrl());
        postResponse.setCreatedAt(updatedPost.getCreatedAt());
        postResponse.setUpdatedAt(updatedPost.getUpdatedAt());
        postResponse.setUserId(updatedPost.getUser().getId());

        return postResponse;
    }


    public void deletePost(Long id, Authentication authentication) {
        // Fetch the post or throw exception if not found
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        String loggedInEmail = authentication.getName();

        if (!post.getUser().getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        // Delete the post
        postRepository.delete(post);
    }

}
