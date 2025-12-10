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
			// converting the string path into a path
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

			// ServletUriComponentsBuilder - spring boot helper class to create the url
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
	public Map<String, Object> createPost(String username, String profilePicUrl, String content,
	                                     MultipartFile file, String fileType, String backgroundStyle,
	                                     String fontFamily, String fontSize, String fontWeight, String textAlign,String fontStyle) {
	    
	    Map<String, Object> post = new HashMap<>();
	    post.put("username", username);
	    post.put("profilePic", profilePicUrl != null ? profilePicUrl : "default_pic_url");
	    post.put("content", content);
	    post.put("shares", 0);
	    post.put("liked", false);
	    post.put("likeCount", 0);
	    post.put("isHidden", false);
	    
	    // Font fields
	    System.out.println(fontFamily);
	    post.put("fontFamily", fontFamily != null ? fontFamily : "Segoe UI, sans-serif");
	    post.put("fontSize", fontSize != null ? fontSize : "18px");
	    post.put("fontWeight", fontWeight != null ? fontWeight : "400");
	    post.put("textAlign", textAlign != null ? textAlign : "left");
	    post.put("fontStyle", fontStyle != null ? fontStyle : "normal");
	    
	    // Handle file upload - CHANGE saveFile to storeFile
	    if (file != null && !file.isEmpty()) {
	        String fileUrl = storeFile(file);  
	        post.put("post_image", fileUrl);
	        post.put("fileType", fileType);
	    } else {
	        post.put("post_image", null);
	        post.put("fileType", null);
	    }
	    
	    post.put("backgroundStyle", backgroundStyle);
	    
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

	// toggles like and returns a map { liked, likeCount }
	@Transactional
	public Map<String, Object> toggleLike(Long postId, Long userId) {
		boolean exists = postDao.isLikeExists(postId, userId);
		if (exists) {
			postDao.removeLike(postId, userId);
		} else {
			postDao.addLike(postId, userId);
		}
		// You can either compute likeCount by counting rows in post_likes
		int likeCount = postDao.getLikeCount(postId);
		boolean liked = !exists;
		// Optionally update posts.like_count column for fast lookups (not strictly
		// necessary)
		postDao.updateLikeCountColumn(postId, likeCount);

		return Map.of("liked", liked, "likeCount", likeCount);
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
		comment.put("parentCommentId", null);

		return commentDao.save(comment);
	}

	// Add reply
	public Map<String, Object> addReply(Long parentCommentId, String user, String text) {
		Map<String, Object> reply = new HashMap<>();
		reply.put("postId", commentDao.findParentPostId(parentCommentId)); // link to same post
		reply.put("user", user);
		reply.put("text", text);
		reply.put("parentCommentId", parentCommentId);

		return commentDao.save(reply);
	}

	public List<Map<String, Object>> getAllPostsForUser(Long userId) {
		return postDao.findAllForUser(userId);
	}

}