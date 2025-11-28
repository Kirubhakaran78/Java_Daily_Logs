package com.example.demo.service;


import com.example.demo.repo.story.StoryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@Transactional
public class StoryService {

    @Autowired
    private StoryDao storyDao;

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    private Path fileStorageLocation;

    // Initialize file storage location
    private void initFileStorage() {
        if (fileStorageLocation == null) {
            fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            try {
                Files.createDirectories(fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create upload directory", ex);
            }
        }
    }

    // Store file and return URL
    private String storeFile(MultipartFile file) {
        initFileStorage();

        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid filename: " + fileName);
            }

            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/")
                    .path(fileName)
                    .toUriString();

            return fileDownloadUri;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    // Create story (Photo or Text)
    public Map<String, Object> createStory(String username, MultipartFile profilePicFile, 
                                          MultipartFile storyFile, String storyText, 
                                          String backgroundColor, String fileType) {
        Map<String, Object> story = new HashMap<>();
        story.put("username", username);
        story.put("storyText", storyText);
        story.put("backgroundColor", backgroundColor);
        story.put("fileType", fileType);

        // Upload profile pic
        if (profilePicFile != null && !profilePicFile.isEmpty()) {
            String profilePicUrl = storeFile(profilePicFile);
            story.put("profilePic", profilePicUrl);
        }

        // Upload story media (image/video)
        if (storyFile != null && !storyFile.isEmpty()) {
            String storyMediaUrl = storeFile(storyFile);
            story.put("storyMedia", storyMediaUrl);
        }

        return storyDao.save(story);
    }

    // Get all stories
    public List<Map<String, Object>> getAllStories() {
        return storyDao.findAll();
    }

    // Get story by ID
    public Map<String, Object> getStoryById(Long id) {
        return storyDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found with id: " + id));
    }

    // Delete story
    public void deleteStory(Long id) {
        storyDao.deleteById(id);
    }

    // Get file path
    public Path getFilePath(String fileName) {
        initFileStorage();
        return fileStorageLocation.resolve(fileName).normalize();
    }
}