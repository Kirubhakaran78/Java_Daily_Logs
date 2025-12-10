import React, { useState } from 'react'
import { useUser } from "../../../context/UserProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { usePostsContext } from "../../../context/PostsContext";
import CommentModal from "../../../features/modals/CommentModal";
import ShareButton from "../../../features/buttons/ShareButton";
import axios from 'axios';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  X,
  Globe,
  CirclePlus,
  CircleMinus
} from "lucide-react";
import "./UserProfilePage.css"

function UserProfilePage() {
  const navigate = useNavigate();
  const { user, profilePic } = useUser();
  const {
    postList,
    setPostList,
    handleLike,
    handleDeletePost,
    handleNotInterested,
    handleNotInterestedUndo
  } = usePostsContext();

  // States
  const [activeTab, setActiveTab] = useState('posts');
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);  // ADD THIS
  const [commentModalShow, setCommentModalShow] = useState(false);  // ADD THIS
  const [shareModalShow, setShareModalShow] = useState(false);  // ADD THIS
  const [commentText, setCommentText] = useState({});  // ADD THIS

  const defaultPic = "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

  if (!user || !user.username) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#65676B"
      }}>
        Loading user profile...
      </div>
    );
  }

  const userPosts = postList.filter(post => post.username === user.username);

  const handleInterested = () => {
    setOpenMenuPostId(null);
  };

  // Update these handlers to use local modals
  const handleComment = (post) => {
    setSelectedPost(post);
    setCommentModalShow(true);
  };

  const handleShare = (post) => {
    setSelectedPost(post);
    setShareModalShow(true);
  };

  // ADD THIS - Handle adding comment
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || commentText[postId].trim() === "") return;

    try {
      const API_BASE_URL = "http://localhost:8082/Org_Management_java/api";
      await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, {
        user: user.username,
        text: commentText[postId],
      });

      // Refresh the specific post
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);

      // FIXED: Use setPostList that was already destructured at the top
      setPostList(prevPosts => {
        const updatedPosts = prevPosts.map(post =>
          post.id === postId ? response.data : post
        );

        if (selectedPost?.id === postId) {
          setSelectedPost(response.data);
        }

        return updatedPosts;
      });

      setCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div style={{ padding: "20px"}}>
            {userPosts && userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post.id} style={{ marginBottom: "15px" }}>
                  {/* Hidden post */}
                  {post.isHidden ? (
                    <div style={{
                      backgroundColor: "#ffffff",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <strong>Post hidden</strong>
                        <button
                          style={{
                            padding: "6px 16px",
                            backgroundColor: "#E2E5E9",
                            borderRadius: "5px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer"
                          }}
                          onClick={() => handleNotInterestedUndo(post.id)}
                        >
                          Undo
                        </button>
                      </div>
                      <p>You won't see posts like this anymore.</p>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden"
                    }}>
                      {/* Post Header */}
                      <div style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={post.profilePic || defaultPic}
                            alt="profile"
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "15px", fontWeight: "600", color: "#050505" }}>
                                {post.username}
                              </span>
                            </div>
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "13px",
                              color: "#65676b"
                            }}>
                              <span>{post.formattedUploadTime}</span>
                              <span>·</span>
                              <Globe size={12} />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "background-color 0.2s"
                            }}
                            onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <MoreHorizontal size={20} color="#65676b" />
                          </div>

                          {/* Three dots menu */}
                          {openMenuPostId === post.id && (
                            <div style={{
                              position: "absolute",
                              right: "32px",
                              marginTop: "50px",
                              width: "300px",
                              background: "white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              zIndex: 999,
                              padding: "8px"
                            }}>
                              <div
                                style={{ padding: "10px", cursor: "pointer" }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                onClick={handleInterested}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <CirclePlus />
                                  <span style={{ fontWeight: "600" }}>Interested</span>
                                </div>
                                <span>More of your posts will be like this</span>
                              </div>

                              <div
                                style={{ padding: "10px", cursor: "pointer" }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                onClick={() => handleNotInterested(post.id)}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <CircleMinus />
                                  <span style={{ fontWeight: "600" }}>Not Interested</span>
                                </div>
                                <span>Fewer of your posts will be like this</span>
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <X
                              size={20}
                              color="#65676b"
                              onClick={() => handleDeletePost(post.id)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      {post.backgroundStyle ? (
                        <div style={{ padding: "0 16px 8px 16px" }}>
                          <div style={{
                            width: "100%",
                            height: "300px",
                            background: post.backgroundStyle,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px"
                          }}>
                            <div style={{
                              color: "white",
                              wordBreak: "break-word",
                              fontSize: post?.fontSize || "32px",
                              textAlign: post?.textAlign || "center",
                              fontWeight: post?.fontWeight || "700",
                              fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
                              fontStyle: post?.fontStyle ||  "normal",
                            }}>
                              {post.content}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          padding: "0 16px 8px 16px",
                          fontSize: post?.fontSize || "16px",
                          textAlign: post?.textAlign || "left",
                          fontWeight: post?.fontWeight || "400",
                          fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
                          fontStyle: post?.fontStyle ||  "normal",
                          lineHeight: "1.3333",

                        }}>
                          {post.content}
                        </div>
                      )}

                      {/* Post Media */}
                      {!post.backgroundStyle && post.postImage && (
                        <div style={{ width: "100%", backgroundColor: "#000000" }}>
                          {post.fileType === "video" ? (
                            <video src={post.postImage} controls style={{ width: "100%", maxHeight: "500px", display: "block" }} />
                          ) : (
                            <img src={post.postImage} alt="Post content" style={{ width: "100%", maxHeight: "500px", display: "block" }} />
                          )}
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e4e6eb"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                          <div style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: "#0866FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <ThumbsUp size={11} color="#ffffff" fill="#ffffff" />
                          </div>
                          <span style={{ fontSize: "15px", color: "#65676b" }}>
                            {post.likeCount}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "16px", fontSize: "15px", color: "#65676b" }}>
                          <span style={{ cursor: "pointer" }}>
                            {post.commentList?.length || 0} comments
                          </span>
                          <span style={{ cursor: "pointer" }}>
                            {post.shares} shares
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        padding: "4px 16px",
                        display: "flex",
                        justifyContent: "space-around",
                        gap: "8px"
                      }}>
                        <button
                          onClick={() => handleLike(post.id)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            border: "none",
                            backgroundColor: "transparent",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: post.liked ? "#0866FF" : "#65676b"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <ThumbsUp
                            size={20}
                            color={post.liked ? "#0866FF" : "#65676b"}
                            fill={post.liked ? "#0866FF" : "none"}
                          />
                          <span>Like</span>
                        </button>

                        <button
                          onClick={() => handleComment(post)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            border: "none",
                            backgroundColor: "transparent",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#65676b"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <MessageCircle size={20} />
                          <span>Comment</span>
                        </button>

                        <button
                          onClick={() => handleShare(post)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            border: "none",
                            backgroundColor: "transparent",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#65676b"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <Share2 size={20} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#65676B" }}>
                <h3>No posts yet</h3>
                <p>When you create posts, they'll appear here.</p>
              </div>
            )}
          </div>
        );
      case 'about':
        return (
          <div style={{ padding: "20px" }}>
            <h2>About Content</h2>
            <p>This is the about section.</p>
          </div>
        );
      // ... rest of your cases
      default:
        return null;
    }
  };


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffffff",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Cover Picture */}
      <div
        className='cover_picture_div'
      >
        {/* Bottom Black Bar */}
        <div
          style={{
            height: "80px",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            background: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.15) 40%,
        rgba(0, 0, 0, 0.35) 75%,
        rgba(0, 0, 0, 0.5) 100%
      )
    `,
          }}
        >
          {/* Button inside the bar */}
          <button
            style={{
              width: "162.44px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "white",
              position: "absolute",
              bottom: "14px",
              right: "14px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              aria-hidden="true"
              style={{
                backgroundImage:
                  'url("https://static.xx.fbcdn.net/rsrc.php/v4/yK/r/2xAaOjX60hc.png")',
                backgroundPosition: "0px -185px",
                backgroundSize: "25px 471px",
                width: "16px",
                height: "16px",
                backgroundRepeat: "no-repeat",
                display: "inline-block",
              }}
            ></i>
            <span style={{ fontSize: "15px", color: "#080809", fontWeight: "600", marginLeft: "5px" }}>  Add Cover Photo</span>
          </button>
        </div>
      </div>

      {/* Profile Picture and Username Container */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // width: "1250px",
        maxWidth:"1250px",
        width:"100%",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}>
        {/* LEFT SIDE: Profile Picture + Username wrapper */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          {/* Profile Picture */}
          <div
            style={{
              width: "168px",
              height: "168px",
              borderRadius: "50%",
              border: "4px solid white",
              position: "relative",
              flexShrink: 0
            }}
          >
            <div style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "50%"
            }}>
              <img
                src={profilePic || defaultPic}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              position: 'absolute',
              backgroundColor: "#E2E5E9",
              bottom: "8px",
              right: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}>
              <i
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'url("https://static.xx.fbcdn.net/rsrc.php/v4/yK/r/2xAaOjX60hc.png")',
                  backgroundPosition: "0px -185px",
                  backgroundSize: "25px 471px",
                  width: "16px",
                  height: "16px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                }}
              ></i>
            </div>
          </div>

          {/* Username and Friends */}
          <div style={{
            display: "flex",
            flexDirection: "column"
          }}>
            <span style={{ fontSize: "32px", fontWeight: "700", color: "#050505" }}>
              {user.username}
            </span>
            <span style={{ fontSize: "15px", fontWeight: "400", color: "#65676B" }}>
              1.3K Friends
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Buttons Container */}
        <div style={{
          display: "flex",
          flexWrap:"wrap",
          gap: "8px",
          marginLeft:"50px",
        }}>
          {/* Add to Story Button */}
          <button style={{
            height: "36px",
            width:"140px",
            padding: "0 16px",
            borderRadius: "6px",
            backgroundColor: "#0866FF",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            color: "white"
          }}>
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v4/yz/r/AqoGWewwdNN.png"
              alt=""
              height="16"
              width="16"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span>Add to story</span>
          </button>

          {/* Edit Profile Button */}
          <button style={{
            height: "36px",
            width:"140px",
            padding: "0 16px",
            borderRadius: "6px",
            backgroundColor: "#E4E6EB",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            color: "#050505"
          }}>
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v4/yW/r/OR6SzrfoMFg.png"
              alt=""
              height="16"
              width="16"
            />
            <span>Edit profile</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        // width: "1250px",
        maxWidth:"1250px",
        width:"100%",
        borderBottom: "1px solid #CED0D4",
        marginTop: "16px"
      }}>
        <div style={{
          display: "flex",
          gap: "8px",
          paddingLeft: "32px",
          paddingRight: "32px"
        }}>
          {/* Posts Tab */}
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              height: "60px",
              padding: "0 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === 'posts' ? "3px solid #0866FF" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              color: activeTab === 'posts' ? "#0866FF" : "#65676B"
            }}>
            Posts
          </button>

          {/* About Tab */}
          <button
            onClick={() => setActiveTab('about')}
            style={{
              height: "60px",
              padding: "0 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === 'about' ? "3px solid #0866FF" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              color: activeTab === 'about' ? "#0866FF" : "#65676B"
            }}>
            About
          </button>

          {/* Friends Tab */}
          <button
            onClick={() => setActiveTab('friends')}
            style={{
              height: "60px",
              padding: "0 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === 'friends' ? "3px solid #0866FF" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              color: activeTab === 'friends' ? "#0866FF" : "#65676B"
            }}>
            Friends
          </button>

          {/* Photos Tab */}
          <button
            onClick={() => setActiveTab('photos')}
            style={{
              height: "60px",
              padding: "0 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === 'photos' ? "3px solid #0866FF" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              color: activeTab === 'photos' ? "#0866FF" : "#65676B"
            }}>
            Photos
          </button>

          {/* Videos Tab */}
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              height: "60px",
              padding: "0 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === 'videos' ? "3px solid #0866FF" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              color: activeTab === 'videos' ? "#0866FF" : "#65676B"
            }}>
            Videos
          </button>

          {/* More Dropdown */}
          <button style={{
            height: "60px",
            padding: "0 16px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "3px solid transparent",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            color: "#65676B",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            More
            <svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 10.5L4 6.5h8z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area - Changes based on active tab */}
      <div style={{
        maxWidth: "1250px",
        width:"100%",
        backgroundColor: "#F0F2F5",
        paddingBottom: "40px",
        paddingTop: "20px",
      }}>
        {renderContent()}
      </div>



      <CommentModal
        show={commentModalShow}
        onHide={() => setCommentModalShow(false)}
        post={selectedPost}
        posts={postList}
        setPosts={setPostList}
        handleLike={handleLike}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
        handleShare={handleShare}
      />

      <ShareButton
        show={shareModalShow}
        onHide={() => setShareModalShow(false)}
        post={selectedPost}
      />

    </div >
  )
}

export default UserProfilePage