package com.project.bloggy.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        // No file? No problem!
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Check file size (10MB limit)
        if (file.getSize() > 10485760) { // 10MB in bytes
            throw new IllegalArgumentException("File is too large. Maximum size is 10MB.");
        }

        try {
            // Upload to Cloudinary
            Map result = cloudinary.uploader().upload(file.getBytes(), Map.of());
            return (String) result.get("secure_url");

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed. Please try again.");
        }
    }
}