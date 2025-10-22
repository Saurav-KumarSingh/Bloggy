package com.project.bloggy.controller;


import com.project.bloggy.dto.CommentRequest;
import com.project.bloggy.dto.CommentResponse;
import com.project.bloggy.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;


    @PostMapping
    public ResponseEntity<String> createComment(@RequestBody CommentRequest comment, Authentication auth){
        return commentService.createComment(comment,auth);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id, Authentication auth) {
        try {
            commentService.deleteComment(id, auth);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage()); // 403 Forbidden for unauthorized
        }
    }

    @PutMapping
    public ResponseEntity<?> updateComment(
            @RequestBody CommentRequest commentRequest,
            Authentication auth) {
        try {
            CommentResponse updatedComment = commentService.updateComment(commentRequest, auth);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }


}
