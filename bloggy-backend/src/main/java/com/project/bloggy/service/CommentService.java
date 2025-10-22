package com.project.bloggy.service;

import com.project.bloggy.dto.CommentRequest;
import com.project.bloggy.dto.CommentResponse;
import com.project.bloggy.entity.Comment;
import com.project.bloggy.entity.Post;
import com.project.bloggy.entity.User;
import com.project.bloggy.repository.CommentRepository;
import com.project.bloggy.repository.PostRepository;
import com.project.bloggy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    private Authentication authentication;

    public ResponseEntity<String> createComment(CommentRequest comment,Authentication auth) {

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post=postRepository.findById(comment.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));


        Comment com=new Comment();

        com.setContent(comment.getContent());
        com.setPost(post);
        com.setUser(user);

        Comment savedComment=commentRepository.save(com);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Comment created with ID: " + savedComment.getId());

    }

    public List<CommentResponse> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        List<CommentResponse> responseList = new ArrayList<>();

        for (Comment comment : comments) {
            CommentResponse response = new CommentResponse();
            response.setId(comment.getId());
            response.setContent(comment.getContent());
            response.setUserId(comment.getUser().getId());
            response.setUsername(comment.getUser().getUsername());
            response.setCreatedAt(comment.getCreatedAt());

            responseList.add(response);
        }

        return responseList;
    }


    public void deleteComment(Long id, Authentication auth) {

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        String loggedInEmail = auth.getName();


        if (!comment.getUser().getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }


        commentRepository.delete(comment);
    }

    public CommentResponse updateComment(CommentRequest commentRequest, Authentication auth) {
        // Fetch the comment by ID from request body
        Comment comment = commentRepository.findById(commentRequest.getId())
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentRequest.getId()));

        // Check if logged-in user is the author
        String loggedInEmail = auth.getName();
        if (!comment.getUser().getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        // Update content
        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);

        // Map to DTO
        CommentResponse response = new CommentResponse();
        response.setId(updatedComment.getId());
        response.setContent(updatedComment.getContent());
        response.setUserId(updatedComment.getUser().getId());
        response.setUsername(updatedComment.getUser().getUsername());
        response.setCreatedAt(updatedComment.getCreatedAt());

        return response;
    }


}
