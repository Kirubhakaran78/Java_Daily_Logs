package com.example.demo.controller;

import com.example.demo.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
//@CrossOrigin(origins = "*")
public class StoryController {

    @Autowired
    private StoryService storyService;

    // Create story
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createStory(
    		@RequestParam("userId") Long userId,
            @RequestParam("username") String username,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic,
            @RequestParam(value = "storyFile", required = false) MultipartFile storyFile,
            @RequestParam(value = "storyText", required = false) String storyText,
            @RequestParam(value = "backgroundColor", required = false) String backgroundColor,
            @RequestParam(value = "fileType", required = false) String fileType) {

//        Map<String, Object> story = storyService.createStory(userId,
//                username, profilePic, storyFile, storyText, backgroundColor, fileType);
//
//        return ResponseEntity.ok(story);
    	
    	// Add logging
        System.out.println("=== Story Creation Request ===");
        System.out.println("userId: " + userId);
        System.out.println("username: " + username);
        System.out.println("fileType: " + fileType);
        System.out.println("profilePic: " + (profilePic != null ? profilePic.getOriginalFilename() : "null"));
        System.out.println("storyFile: " + (storyFile != null ? storyFile.getOriginalFilename() : "null"));
        
        try {
            Map<String, Object> story = storyService.createStory(userId,
                    username, profilePic, storyFile, storyText, backgroundColor, fileType);
            return ResponseEntity.ok(story);
        } catch (Exception e) {
            System.err.println("Error creating story: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all stories
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllStories() {
        return ResponseEntity.ok(storyService.getAllStories());
    }

    // Get story by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    // Delete story
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }
}
