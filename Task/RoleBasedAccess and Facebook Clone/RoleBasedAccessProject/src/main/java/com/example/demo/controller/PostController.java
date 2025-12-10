package com.example.demo.controller;

import com.example.demo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    
    @GetMapping("/posts")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(
            @RequestParam(value = "userId", required = false) Long userId) {
        List<Map<String, Object>> posts;
        if (userId != null) {
            posts = postService.getAllPostsForUser(userId);
        } else {
            posts = postService.getAllPosts();
        }
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long id) {
        Map<String, Object> post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/posts")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestParam("username") String username,
            @RequestParam(value = "profilePic", required = false) String profilePicUrl,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "backgroundStyle", required = false) String backgroundStyle,
            @RequestParam(value = "fontFamily", required = false) String fontFamily,
            @RequestParam(value = "fontSize", required = false) String fontSize,
            @RequestParam(value = "fontWeight", required = false) String fontWeight,
            @RequestParam(value = "textAlign", required = false) String textAlign,
            @RequestParam(value = "fontStyle", required = false) String fontStyle) {
        
        Map<String, Object> createdPost = postService.createPost(
            username, profilePicUrl, content, 
            file, fileType, backgroundStyle,
            fontFamily, fontSize, fontWeight, textAlign , fontStyle
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        Long userId = request.get("userId") == null ? null : ((Number)request.get("userId")).longValue();
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));
        }

        Map<String, Object> result = postService.toggleLike(id, userId);
        return ResponseEntity.ok(result);
    }


    @PutMapping("/posts/{id}/hidden")
    public ResponseEntity<Map<String, String>> toggleHidden(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {
        Boolean isHidden = request.get("isHidden");
        postService.toggleHidden(id, isHidden);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hidden status updated");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        String user = (String) request.get("user");
        String text = (String) request.get("text");
        Long parentCommentId = request.get("parentCommentId") != null ? ((Number) request.get("parentCommentId")).longValue() : null;

        Map<String, Object> comment;
        if (parentCommentId == null) {
            comment = postService.addComment(id, user, text);
        } else {
            comment = postService.addReply(parentCommentId, user, text);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    // FILE DOWNLOAD ENDPOINT
    
@GetMapping("/files/{fileName:.+}") // filename -> dynamic variable in the url  :.+ REGEX meaning match everything including dots .
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = postService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = "application/octet-stream";
                
                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (fileName.endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (fileName.endsWith(".mp4")) {
                    contentType = "video/mp4";
                } else if (fileName.endsWith(".webm")) {
                    contentType = "video/webm";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                               "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}