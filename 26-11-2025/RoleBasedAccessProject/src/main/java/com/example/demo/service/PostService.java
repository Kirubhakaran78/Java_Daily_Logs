package com.example.demo.service;

import com.example.demo.repo.comment.CommentDao;
import com.example.demo.repo.post.PostDao;
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
public class PostService {

	@Autowired
	private PostDao postDao;

	@Autowired
	private CommentDao commentDao;

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

			String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/files/")
					.path(fileName).toUriString();

			return fileDownloadUri;

		} catch (IOException ex) {
			throw new RuntimeException("Could not store file " + fileName, ex);
		}
	}

	// Get file path
	public Path getFilePath(String fileName) {
		initFileStorage();
		return fileStorageLocation.resolve(fileName).normalize();
	}

	// Create post
	public Map<String, Object> createPost(String username, MultipartFile profilePicFile, String content,
			MultipartFile file, String fileType, String backgroundStyle) {
		Map<String, Object> post = new HashMap<>();
		post.put("username", username);
		post.put("content", content);
		post.put("fileType", fileType);
		post.put("backgroundStyle", backgroundStyle);
		post.put("shares", 0);
		post.put("liked", false);
		post.put("likeCount", 0);
		post.put("isHidden", false);
		post.put("commentList", new ArrayList<>());

		// Upload profile pic
		if (profilePicFile != null && !profilePicFile.isEmpty()) {
			String profilePicUrl = storeFile(profilePicFile);
			post.put("profilePic", profilePicUrl); // Store URL instead of local PC path
		}

		// Upload post image/video
		if (file != null && !file.isEmpty()) {
			String postImageUrl = storeFile(file);
			post.put("post_image", postImageUrl);
		}

		return postDao.save(post);
	}

	// Get all posts
	public List<Map<String, Object>> getAllPosts() {
		return postDao.findAll();
	}

	// Get post by ID
	public Map<String, Object> getPostById(Long id) {
		return postDao.findById(id).orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
	}

	// Delete post
	public void deletePost(Long id) {
		postDao.deleteById(id);
	}

	// Toggle like
	public void toggleLike(Long id) {
		Map<String, Object> post = getPostById(id);
		Boolean currentLiked = (Boolean) post.get("liked");
		Integer currentLikeCount = (Integer) post.get("likeCount");

		Boolean newLikedStatus = !currentLiked;
		Integer newLikeCount = newLikedStatus ? currentLikeCount + 1 : currentLikeCount - 1;

		postDao.updateLikeStatus(id, newLikedStatus, newLikeCount);
	}

	// Toggle hidden
	public void toggleHidden(Long id, Boolean isHidden) {
		postDao.updateHiddenStatus(id, isHidden);
	}

	// Add comment
	public Map<String, Object> addComment(Long postId, String user, String text) {
		Map<String, Object> comment = new HashMap<>();
		comment.put("postId", postId);
		comment.put("user", user);
		comment.put("text", text);

		return commentDao.save(comment);
	}
}