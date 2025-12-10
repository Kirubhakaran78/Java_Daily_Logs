import React, { useState, useEffect } from "react";
import { Form, Modal, InputGroup } from "react-bootstrap";
import { ThumbsUp } from "lucide-react";
import { useUser } from "../../context/UserProvider";
import axios from "axios";

const defaultPic =
  "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

// Recursive Comment Item Component
function CommentItem({
  comment,
  allComments,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  handleAddReply,
  user,
  profilePic,
  depth = 0,
  userProfilePics, //  NEW: Pass profile pics mapping
}) {
  const [showReplies, setShowReplies] = useState(false);
  const replies = allComments.filter((c) => c.parentCommentId === comment.id);
  const replyCount = replies.length;

  // Get the profile pic for this comment's author
  const commentAuthorPic = userProfilePics[comment.user] || defaultPic;

  return (
    <div
      style={{
        marginLeft: depth > 0 ? "40px" : "0",
        marginTop: depth > 0 ? "8px" : "12px",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <img
          src={commentAuthorPic} // Use comment author's pic
          style={{
            width: depth > 0 ? 28 : 32,
            height: depth > 0 ? 28 : 32,
            borderRadius: "50%",
          }}
          alt="profile"
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: depth > 0 ? "#e4e6eb" : "#f0f2f5",
              padding: depth > 0 ? "8px 12px" : "10px 14px",
              borderRadius: "18px",
              fontSize: depth > 0 ? "14px" : "15px",
            }}
          >
            <strong>
              {comment.user === user.username ? "You" : comment.user}
            </strong>
            <div>{comment.text}</div>
          </div>

          <div
            style={{
              marginTop: "4px",
              marginLeft: "12px",
              display: "flex",
              gap: "12px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <span
              style={{ cursor: "pointer", color: "#65676b" }}
              onClick={() => setReplyTo(comment.id)}
            >
              Reply
            </span>

            {replyCount > 0 && (
              <span
                style={{ cursor: "pointer", color: "#0866FF" }}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide" : "View"} {replyCount}{" "}
                {replyCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>

          {replyTo === comment.id && (
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <img
                src={profilePic || defaultPic} // Current user's pic for reply input
                style={{ width: 28, height: 28, borderRadius: "50%" }}
                alt="profile"
              />
              <InputGroup style={{ flex: 1 }}>
                <Form.Control
                  type="text"
                  placeholder={`Reply to ${comment.user === user.username ? "yourself" : comment.user
                    }...`}
                  value={replyText[comment.id] || ""}
                  onChange={(e) => {
                    setReplyText({
                      ...replyText,
                      [comment.id]: e.target.value,
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyText[comment.id]?.trim()) {
                      handleAddReply(comment, replyText[comment.id]);
                      setShowReplies(true);
                    }
                  }}
                  style={{
                    borderRadius: "18px",
                    backgroundColor: "#f0f2f5",
                    border: "1px solid #ccd0d5",
                    fontSize: "14px",
                  }}
                />
              </InputGroup>
            </div>
          )}

          {showReplies &&
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleAddReply={handleAddReply}
                user={user}
                profilePic={profilePic}
                userProfilePics={userProfilePics} // Pass down
                depth={depth + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// Main Comment Modal
function CommentModal({
  post,
  posts,
  setPosts,
  commentText,
  setCommentText,
  ...props
}) {
  const { user, profilePic } = useUser();
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [localPost, setLocalPost] = useState(post);
  const [userProfilePics, setUserProfilePics] = useState({}); // NEW: Store profile pics

  // Sync local post with prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  // NEW: Fetch all user profile pics when modal opens
  useEffect(() => {
    const fetchUserProfilePics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/Org_Management_java/api/masters/getAllEmp"
        );

        // Create a mapping of username -> profile_pic
        const profilePicsMap = {};
        response.data.forEach((emp) => {
          profilePicsMap[emp.emp_name] = emp.profile_pic
            ? emp.profile_pic + "?t=" + new Date().getTime()
            : defaultPic;
        });

        setUserProfilePics(profilePicsMap);
      } catch (error) {
        console.error("Error fetching user profile pics:", error);
      }
    };

    if (props.show) {
      fetchUserProfilePics();
    }
  }, [props.show]);

  if (!localPost) return null;

  const refreshPost = () => {
    axios
      .get(`http://localhost:8082/Org_Management_java/api/posts/${localPost.id}`)
      .then((res) => {
        console.log("Post refreshed with", res.data.commentList?.length, "comments");
        setLocalPost(res.data);

        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === localPost.id ? res.data : p))
        );
      })
      .catch((err) => {
        console.error("Error refreshing post:", err);
      });
  };

  const handleAddReply = (comment, text) => {
    if (!text?.trim()) return;

    axios
      .post(
        `http://localhost:8082/Org_Management_java/api/posts/${localPost.id}/comments`,
        {
          user: user.username,
          text: text.trim(),
          parentCommentId: comment.id,
        }
      )
      .then((res) => {
        console.log("Reply saved:", res.data);

        setLocalPost((prev) => ({
          ...prev,
          commentList: [...(prev.commentList || []), res.data],
        }));

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === localPost.id
              ? { ...p, commentList: [...(p.commentList || []), res.data] }
              : p
          )
        );

        setReplyText({ ...replyText, [comment.id]: "" });
        setReplyTo(null);
      })
      .catch((err) => {
        console.error("Error adding reply:", err);
        alert("Failed to add reply: " + (err.response?.data?.message || err.message));
      });
  };

  const handleAddTopComment = () => {
    const text = commentText[localPost.id];
    if (!text?.trim()) return;

    axios
      .post(
        `http://localhost:8082/Org_Management_java/api/posts/${localPost.id}/comments`,
        {
          user: user.username,
          text: text.trim(),
        }
      )
      .then((res) => {
        console.log("Comment saved:", res.data);

        setLocalPost((prev) => ({
          ...prev,
          commentList: [...(prev.commentList || []), res.data],
        }));

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === localPost.id
              ? { ...p, commentList: [...(p.commentList || []), res.data] }
              : p
          )
        );

        setCommentText({ ...commentText, [localPost.id]: "" });
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
        alert("Failed to add comment: " + (err.response?.data?.message || err.message));
      });
  };

  const topLevelComments =
    localPost.commentList?.filter((c) => !c.parentCommentId) || [];

  return (
    <Modal {...props} size="lg" style={{ overflow: "hidden" }} centered>
      <Modal.Header closeButton>
        <Modal.Title>{localPost.username}'s Post</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ height: "700px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={localPost.profilePic || defaultPic}
            alt="profile pic"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
          <div>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              {localPost.username}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#0866FF",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              · Follow
            </span>
            <p style={{ margin: 0, color: "gray" }}>4d · Public</p>
          </div>
        </div>

        {localPost.backgroundStyle ? (
          <div
            style={{
              width: "100%",
              height: "300px",
              background: localPost.backgroundStyle,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: localPost?.fontSize || "32px",
                fontWeight: localPost?.fontWeight || "700",
                textAlign: localPost?.textAlign || "center",
                fontStyle: localPost?.fontStyle || "normal",
                color: "#080809",
                wordBreak: "break-word",
                fontFamily: localPost?.fontFamily || "Segoe UI, sans-serif",
              }}
            >
              {localPost.content}
            </div>
          </div>
        ) : localPost.fileType === "video" && localPost.postImage ? (

          <div>
            <div style={{
              padding: "10px 16px 8px 16px",
              fontSize: localPost?.fontSize || "32px",
              fontWeight: localPost?.fontWeight || "700",
              textAlign: localPost?.textAlign || "center",
              color: "#080809",
              wordBreak: "break-word",
              fontFamily: localPost?.fontFamily || "Segoe UI, sans-serif",
              fontStyle: localPost?.fontStyle || "normal",
            }}>
              {localPost.content}
            </div>
            <video
              src={localPost.postImage}
              style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "637px" }}
              controls
            />
          </div>
        ) : localPost.fileType === "image" && localPost.postImage ? (
          <div>
            <div style={{
              padding: "10px 16px 8px 16px",
              fontSize: localPost?.fontSize || "32px",
              fontWeight: localPost?.fontWeight || "700",
              textAlign: localPost?.textAlign || "center",
              color: "#080809",
              wordBreak: "break-word",
              fontFamily: localPost?.fontFamily || "Segoe UI, sans-serif",
              fontStyle: localPost?.fontStyle || "normal",
            }}>
              {localPost.content}
            </div>
            <img
              src={localPost.postImage}
              style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "637px" }}
              alt="post"
            />
          </div>
        ) : (
          <div style={{
            padding: "10px 16px 8px 16px",
            fontSize: localPost?.fontSize || "32px",
            fontWeight: localPost?.fontWeight || "700",
            textAlign: localPost?.textAlign || "center",
            color: "#080809",
            wordBreak: "break-word",
            fontFamily: localPost?.fontFamily || "Segoe UI, sans-serif",
            fontStyle: localPost?.fontStyle || "normal",
          }}>
            {localPost.content}
          </div>
        )}

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e4e6eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#0866FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThumbsUp size={11} color="#ffffff" fill="#ffffff" />
            </div>
            <span style={{ fontSize: "15px", color: "#65676b" }}>
              {localPost.likeCount}
            </span>
          </div>
          <div style={{ display: "flex", gap: "16px", fontSize: "15px" }}>
            <span>{localPost.commentList?.length || 0} comments</span>
            <span>{localPost.shares} shares</span>
          </div>
        </div>

        <div style={{ padding: "0 16px 16px 16px" }}>
          {topLevelComments.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#65676b", padding: "20px" }}
            >
              No comments yet. Be the first to comment!
            </div>
          ) : (
            topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                allComments={localPost.commentList}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleAddReply={handleAddReply}
                user={user}
                profilePic={profilePic}
                userProfilePics={userProfilePics} // Pass profile pics mapping
                depth={0}
              />
            ))
          )}
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={profilePic || defaultPic}
            alt="profilePic"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <InputGroup style={{ flex: 1 }}>
          <Form.Control
            type="text"
            placeholder="Write a comment…"
            value={commentText[localPost.id] || ""}
            onChange={(e) =>
              setCommentText({ ...commentText, [localPost.id]: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTopComment();
            }}
            style={{
              padding: "10px 15px",
              borderRadius: "20px",
              backgroundColor: "#f0f2f5",
              border: "1px solid #ccd0d5",
            }}
          />
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );
}

export default CommentModal;