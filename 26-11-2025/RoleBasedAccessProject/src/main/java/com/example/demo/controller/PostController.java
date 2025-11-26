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
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    //  POST ENDPOINTS 
    
    @GetMapping("/posts")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts() {
        List<Map<String, Object>> posts = postService.getAllPosts();
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
            @RequestParam(required = false) MultipartFile profilePic,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "backgroundStyle", required = false) String backgroundStyle) {
        
        Map<String, Object> createdPost = postService.createPost(username, profilePic, content, 
                                                  file, fileType, backgroundStyle);
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
    public ResponseEntity<Map<String, String>> toggleLike(@PathVariable Long id) {
        postService.toggleLike(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Like toggled successfully");
        return ResponseEntity.ok(response);
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

    //COMMENT ENDPOINTS
    
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String user = request.get("user");
        String text = request.get("text");
        
        Map<String, Object> comment = postService.addComment(id, user, text);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    // FILE DOWNLOAD ENDPOINT
    
    @GetMapping("/files/{fileName:.+}")
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