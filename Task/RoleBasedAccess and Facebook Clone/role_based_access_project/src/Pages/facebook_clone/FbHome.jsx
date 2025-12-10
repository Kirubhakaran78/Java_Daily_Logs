import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "react-bootstrap-icons";
import { CircleMinus, CirclePlus } from "lucide-react";
import { Plus } from "lucide-react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  X,
  Globe,
} from "lucide-react";
import "./FbHome.css";
import ShareButton from "../../features/buttons/ShareButton";
import CreatePostModal from "../../features/modals/CreatePostModal";
import CommentModal from "../../features/modals/CommentModal";
import StoryView from "../../features/stories/StoryView";
import axios from "axios";
import CreateStory from "../../features/stories/CreateStory";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePostsContext } from "../../context/PostsContext";
import "./FbHome.css";

function FbHome() {
  const navigate = useNavigate();
  const { user, profilePic, setProfilePic } = useUser();

  const defaultPic =
    "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

  const [storyList, setStoryList] = useState([]);
  //API base URL
  const API_BASE_URL = "http://localhost:8082/Org_Management_java/api";

  const storyRef = useRef(null); //ref for each story video to play on hover
  storyRef.current = []; // clear on each render if needed

  // const [postList, setPostList] = useState([]);
  const { postList, setPostList } = usePostsContext([]);

  //use state to show the modal when clicking comment button
  const [selectedPost, setSelectedPost] = useState(null);

  const [modalShow, setModalShow] = useState(false);

  //handle each comment
  const [commentText, setCommentText] = useState({});
  const [openMenuPostId, setOpenMenuPostId] = useState(null);

  //stroy movable button
  const storyContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  //show the create post modal
  const [createModalShow, setCreateModalShow] = useState(false);

  //handle share button
  const [shareModalShow, setShareModalShow] = useState(false);

  //show the story view page
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyViewShow, setStoryViewShow] = useState(false);

  //show the create story
  const [createStoryShow, setCreateStoryShow] = useState(false);

  //to open the file input from home page
  const modalFileInputRef = useRef(null);

  const checkScreenSize = () => {
    if (window.innerWidth < 1080) {
      alert("Please open this on desktop to create a story. Screen width must be at least 1080px.");
      return false;
    }
    return true;
  };

  // Clear data immediately when user changes or logs out
  // useEffect(() => {
  //   if (!user || !user.username) {
  //     // User logged out - clear everything
  //     setPostList([]);
  //     setStoryList([]);
  //     setSelectedPost(null);
  //     setCreateModalShow(false);
  //     setModalShow(false);
  //     setStoryViewShow(false);
  //     return;
  //   }

  //   //Formatted Upload time
  //   const formatUploadTime = (createdAt) => {
  //     if (!createdAt) return "Just now";

  //     const now = new Date();
  //     const uploadTime = new Date(createdAt);
  //     const diffMs = now - uploadTime;
  //     const diffMins = Math.floor(diffMs / 60000);
  //     const diffHours = Math.floor(diffMs / 3600000);
  //     const diffDays = Math.floor(diffMs / 86400000);

  //     if (diffMins < 1) {
  //       return "Just now";
  //     } else if (diffMins < 60) {
  //       return `${diffMins}m`;
  //     } else if (diffHours < 24) {
  //       return `${diffHours}h`;
  //     } else {
  //       return `${diffDays}d`;
  //     }
  //   };

  //   // User logged in - fetch fresh data
  //   const fetchData = async () => {
  //     try {
  //       console.log("Fetching data for user:", user.username);

  //       // Clear old data BEFORE fetching
  //       setPostList([]);
  //       setStoryList([]);

  //       // In the useEffect where you fetch posts
  //       const postsResponse = await axios.get(`${API_BASE_URL}/posts`, {
  //         params: { userId: user?.id },
  //       });

  //       console.log("Loaded posts:", user.fontFamily);


  //       // FIX: Clean up "null" strings
  //       const fixedPosts = postsResponse.data.map((p) => ({
  //         ...p,
  //         backgroundStyle:
  //           p.backgroundStyle === "null" || p.backgroundStyle === ""
  //             ? null
  //             : p.backgroundStyle,
  //         postImage:
  //           p.postImage === "null" || p.postImage === "" ? null : p.postImage,
  //         fileType:
  //           p.fileType === "null" || p.fileType === "" ? null : p.fileType,
  //         fontFamily: p.fontFamily && p.fontFamily !== "null" && p.fontFamily !== ""
  //           ? p.fontFamily
  //           : "Segoe UI, sans-serif",
  //         fontSize: p.fontSize && p.fontSize !== "null" && p.fontSize !== ""
  //           ? p.fontSize
  //           : "18px",
  //         fontWeight: p.fontWeight && p.fontWeight !== "null" && p.fontWeight !== ""
  //           ? p.fontWeight
  //           : "400",
  //         textAlign: p.textAlign && p.textAlign !== "null" && p.textAlign !== ""
  //           ? p.textAlign
  //           : "left",
  //         formattedUploadTime: formatUploadTime(p.createdAt),
  //       }));


  //       console.log("Fixed posts with fonts:", fixedPosts.map(p => ({
  //         id: p.id,
  //         font: p.fontFamily
  //       })));

  //       setPostList(fixedPosts);

  //       // Fetch stories
  //       const storiesResponse = await axios.get(`${API_BASE_URL}/stories`);
  //       setStoryList(storiesResponse.data);

  //       // Fetch profile pic
  //       const empResponse = await axios.get(
  //         `http://localhost:8082/Org_Management_java/api/masters/getAllEmp`
  //       );
  //       const emp = empResponse.data.find((e) => e.emp_name === user.username);
  //       setProfilePic(emp?.profile_pic || defaultPic);

  //       console.log(" Data loaded for:", user.username);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [user?.username]); // Re-run whenever username changes


  useEffect(() => {
    if (!user || !user.username) {
      // User logged out - clear everything
      setPostList([]);
      setStoryList([]);
      setSelectedPost(null);
      setCreateModalShow(false);
      setModalShow(false);
      setStoryViewShow(false);
      return;
    }

    // Only fetch stories and profile pic here - NOT posts!
    const fetchNonPostData = async () => {
      try {
        console.log("Fetching stories and profile for user:", user.username);

        // Fetch stories
        const storiesResponse = await axios.get(`${API_BASE_URL}/stories`);
        setStoryList(storiesResponse.data);

        // Fetch profile pic
        const empResponse = await axios.get(
          `http://localhost:8082/Org_Management_java/api/masters/getAllEmp`
        );
        const emp = empResponse.data.find((e) => e.emp_name === user.username);
        setProfilePic(emp?.profile_pic || defaultPic);

        console.log("Stories and profile loaded for:", user.username);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNonPostData();
  }, [user?.username]);

  const openFileInputFromHome = () => {
    modalFileInputRef.current?.click();
  };

  const showStoryView = (story) => {
    setSelectedStory(story);
    setStoryViewShow(true);
  };

  // show create story
  const showCreateStory = () => {
    setCreateStoryShow(true);
  };

  //show User Profile Page
  // const showUserProfilePage = () => {
  //   setUserProfilePage(true);
  // }

  //handle story creation
  const handleCreateStory = async (storyData) => {
    try {
      console.log("Creating story with user:", user);

      const formData = new FormData();
      formData.append("userId", user?.id);
      formData.append("username", user?.username);
      formData.append("profilePic", storyData.profilePic); // Send file blob

      if (storyData.type === "photo") {
        formData.append("storyFile", storyData.file);
        formData.append("fileType", "image");
      } else if (storyData.type === "text") {
        formData.append("storyText", storyData.text);
        formData.append("backgroundColor", storyData.backgroundColor);
        formData.append("fileType", "text");
      }

      console.log("FormData contents:"); // Debug log
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await axios.post(`${API_BASE_URL}/stories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Story created:", response.data);

      // Refresh stories list
      const updatedStories = await axios.get(`${API_BASE_URL}/stories`);
      setStoryList(updatedStories.data);

      // Close the create story modal
      setCreateStoryShow(false);

      navigate("/HomePage/facebook");
    } catch (error) {
      console.error("Error creating story:", error);
      console.error("Error response:", error.response?.data); // More detailed error
      alert(
        "Failed to create story: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  // Update the createPost function to use FormData correctly


  // In FbHome.jsx
  const createPost = async (postData) => {
    console.log("ProfilePic being sent:", profilePic);
    console.log("User:", user?.username);
    console.log("Font data being sent:", postData.fontFamily);

    const formData = new FormData();
    formData.append("username", user?.username);
    formData.append("profilePic", profilePic || defaultPic);
    formData.append("content", postData.text);

    if (postData.file) {
      formData.append("file", postData.file);
      formData.append("fileType", postData.fileType);
    }

    if (postData.backgroundStyle) {
      formData.append("backgroundStyle", postData.backgroundStyle);
    }

    formData.append("fontFamily", postData.fontFamily || "Segoe UI, sans-serif");
    formData.append("fontSize", postData.fontSize || "18px");
    formData.append("fontWeight", postData.fontWeight || "400");
    formData.append("textAlign", postData.textAlign || "left");
    formData.append("fontStyle", postData.fontStyle || "normal");

    try {
      const res = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Post created successfully:", res.data);
      console.log("Returned fontFamily:", res.data.fontFamily);

      // Add the new post directly to state with formatted time
      const newPost = {
        ...res.data,
        formattedUploadTime: "Just now",
        // Ensure all font properties exist
        fontFamily: res.data.fontFamily || postData.fontFamily || "Segoe UI, sans-serif",
        fontSize: res.data.fontSize || postData.fontSize || "18px",
        fontWeight: res.data.fontWeight || postData.fontWeight || "400",
        textAlign: res.data.textAlign || postData.textAlign || "left",
        fontStyle: res.data.fontStyle || postData.fontStyle || "normal",
      };

      console.log("Adding new post with fontFamily:", newPost.fontFamily);

      // Add to beginning of list
      setPostList(prevPosts => [newPost, ...prevPosts]);

      // DON'T call refreshPosts() - it causes re-render issues
      // await refreshPosts();

    } catch (err) {
      console.error("Error creating post:", err);
    }
  };


  // Update handleAddNewPost
  const handleAddNewPost = async (newPostData) => {
    await createPost(newPostData);
  };

  const handleLike = async (id) => {
    try {
      const userId = Number(user?.id);
      if (!userId) {
        console.warn("No user id found — cannot like without login");
        return;
      }

      const res = await axios.put(`${API_BASE_URL}/posts/${id}/like`, {
        userId,
      });

      // safe extraction and fallback
      const liked = res?.data?.liked ?? false;
      const likeCount = Number(res?.data?.likeCount ?? 0);

      setPostList((prevPosts) => {
        const updated = prevPosts.map((post) =>
          post.id === id ? { ...post, liked, likeCount } : post
        );

        if (selectedPost && selectedPost.id === id) {
          const newSelected = updated.find((p) => p.id === id);
          setSelectedPost(newSelected);
        }

        return updated;
      });

      // Optionally: re-enable button
      // setLikeInFlight(prev => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Error toggling like:", error);
      // Optionally: show user feedback, retry logic, or revert optimistic UI
    }
  };

  // Update handleDeletePost
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      setPostList((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Update handleNotInterested
  const handleNotInterested = async (postId) => {
    try {
      await axios.put(`${API_BASE_URL}/posts/${postId}/hidden`, {
        isHidden: true,
      });

      setPostList((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isHidden: true } : post
        )
      );
      setOpenMenuPostId(null);
    } catch (error) {
      console.error("Error hiding post:", error);
    }
  };

  // Update handleAddComment
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || commentText[postId].trim() === "") return;

    try {
      await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, {
        user: user.username,
        text: commentText[postId],
      });

      // Refresh the post to get updated comments
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);

      setPostList((prevPosts) => {
        const updatedPosts = prevPosts.map((post) =>
          post.id === postId ? response.data : post
        );

        if (selectedPost?.id === postId) {
          setSelectedPost(response.data);
        }

        return updatedPosts;
      });

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setModalShow(true);
  };

  //handle the share button
  const handleShare = (post) => {
    setSelectedPost(post);
    setShareModalShow(true);
  };

  const handleNotInterestedUndo = (postId) => {
    setPostList((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isHidden: false } : post
      )
    );

    // closing the menu
    setOpenMenuPostId(null);
  };

  const handleInterested = () => {
    setOpenMenuPostId(null);
  };

  useEffect(() => {
    const container = storyContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const canScroll = container.scrollWidth > container.clientWidth + 5;

      setShowLeftArrow(canScroll && container.scrollLeft > 5);
      setShowRightArrow(
        canScroll &&
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 5
      );
    };

    container.addEventListener("scroll", handleScroll);

    // Run after mount
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Run again when stories update
  useEffect(() => {
    const container = storyContainerRef.current;
    if (!container) return;

    const canScroll = container.scrollWidth > container.clientWidth + 5;

    setShowLeftArrow(false);
    setShowRightArrow(canScroll);
  }, [storyList]);

  // FIXED: Add smooth scrolling with callback
  const slideStories = (direction) => {
    if (!storyContainerRef.current) return;

    const container = storyContainerRef.current;
    const amount = 250; // move 2–3 cards per click

    if (direction === "left") {
      container.scrollLeft -= amount;
    } else {
      container.scrollLeft += amount;
    }

    // FIX: Force update arrows after scroll animation completes
    setTimeout(() => {
      const canScroll = container.scrollWidth > container.clientWidth + 5;
      setShowLeftArrow(canScroll && container.scrollLeft > 5);
      setShowRightArrow(
        canScroll &&
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 5
      );
    }, 100); // Wait for scroll animation
  };

  // handle create post
  const handleCreatePost = () => {
    setCreateModalShow(true);
  };

  if (!user || !user.username) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ paddingTop: "20px" }} className="fb_home_main_content">
      <div
        style={{
          padding: "20px",
          backgroundColor: "#F2F4F7 ",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "-20px",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffffff",
            width: "680px",
            height: "62px",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <img
            src={profilePic || defaultPic}
            alt="fb_profile"
            height={40}
            width={40}
            style={{ borderRadius: "50%" }}
            onClick={() => navigate("/HomePage/facebook/profile")}
          />

          <input
            onClick={() => handleCreatePost()}
            type="text"
            placeholder={`Whats on your mind,${user?.username}?`}
            style={{
              borderRadius: "27px",
              background: "#F0F2F5",
              width: "472px",
              height: "40px",
              color: "#65686C",
              fontSize: "17px",
              padding: "8px 12px",
              fontFamily: "Segoe UI Historic",
              border: "none",
            }}
          />

          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png"
            alt="live video icon"
          />
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png"
            alt="video image icon"
            onClick={() => {
              setCreateModalShow(true); // open modal
              setTimeout(() => openFileInputFromHome(), 50); // open file picker
            }}
          />
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/Y4mYLVOhTwq.png"
            alt="smile image"
          />
        </div>

        {/* Stories container */}
        <div style={{ position: "relative", width: "680px" }}>
          {/* LEFT BUTTON */}
          {showLeftArrow && (
            <button
              onClick={() => slideStories("left")}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "#515458ff",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f2f5";
                e.currentTarget.style.transform =
                  "translateY(-50%) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <ChevronLeft />
            </button>
          )}

          {/* STORIES SCROLL BOX */}
          <div
            ref={storyContainerRef}
            style={{
              backgroundColor: "#ffffff",
              width: "680px",
              padding: "16px",
              borderRadius: "8px",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Create Story Card */}
            <div
              style={{
                width: "112.5px",
                height: "200px",
                background: "#ffffff",
                borderRadius: "8px",
                position: "relative",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                overflow: "visible",
                flexShrink: 0,
              }}
              onClick={() => navigate("/HomePage/facebook/Create_Story")}
              // onClick={() => {
              //   if (checkScreenSize()) {
              //     navigate("/HomePage/facebook/Create_Story");
              //   }
              // }}
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  position: "relative",
                  overflow: "hidden",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <img
                  src={profilePic || defaultPic}
                  alt="fb_Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "120px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#0866FF",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "4px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <Plus size={24} color="#ffffff" strokeWidth={3} />
              </div>

              <div
                style={{
                  padding: "30px 8px 12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#050505",
                  }}
                >
                  Create Story
                </span>
              </div>
            </div>

            {/* Story Cards from Database */}
            {storyList.map((story, index) => {
              return (
                <div
                  key={story.id}
                  style={{
                    width: "112.5px",
                    height: "200px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => {
                    const video = storyRef.current[index];
                    if (video && story.fileType === "video") {
                      video.currentTime = 0;
                      video.play().catch((e) => console.log(e));
                    }
                  }}
                  onMouseLeave={() => {
                    const video = storyRef.current[index];
                    if (video && story.fileType === "video") {
                      video.pause();
                    }
                  }}
                  // onClick={() => navigate(`/HomePage/facebook/View_Story/${story.id}`)}
                  onClick={() => showStoryView(story)}
                >
                  {/* Render based on file type */}
                  {story.fileType === "text" ? (
                    // Text Story
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: story.backgroundColor || "#0866FF",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          textAlign: "center",
                          wordBreak: "break-word",
                          lineHeight: "1.3",
                        }}
                      >
                        {story.storyText && story.storyText.length > 50
                          ? story.storyText.substring(0, 50) + "..."
                          : story.storyText}
                      </span>
                    </div>
                  ) : story.fileType === "video" ? (
                    // Video Story
                    <video
                      ref={(el) => (storyRef.current[index] = el)}
                      src={story.storyMedia}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      muted
                      loop
                    />
                  ) : (
                    // Image Story
                    <img
                      src={story.storyMedia}
                      alt="Story"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {/* Profile Picture Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "3px solid #0866FF",
                      overflow: "hidden",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <img
                      src={story.profilePic}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Username Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      right: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: "600",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      {story.username}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT BUTTON */}
          {showRightArrow && (
            <button
              onClick={() => slideStories("right")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "#515458ff",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f2f5";
                e.currentTarget.style.transform =
                  "translateY(-50%) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <ChevronRight />
            </button>
          )}
        </div>

        {/* post containers */}
        {postList.map((post, index) => {
          // console.log("Post ID:", post.id, "ProfilePic:", post.profilePic);
          // console.log(`Rendering post ${post.id}:`, {
          //   fontFamily: post?.fontFamily,
          //   fontSize: post?.fontSize,
          //   fontWeight: post?.fontWeight
          // });
          return (
            <div key={post.id || index} style={{ marginBottom: "15px" }}>
              {/* Hidden post */}
              {post.isHidden ? (
                <div
                  style={{
                    width: "680px",
                    backgroundColor: "#ffffffff",
                    padding: "20px",
                    borderRadius: "8px",
                    color: "#080809",
                    border: "1px solid #ddd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>Post hidden</strong>
                    <button
                      style={{
                        padding: "6px 16px",
                        color: "#080809",
                        backgroundColor: "#E2E5E9",
                        borderRadius: "5px",
                        fontFamily: "Segoe UI Historic",
                        fontWeight: "600",
                      }}
                      onClick={() => handleNotInterestedUndo(post.id)}
                    >
                      Undo
                    </button>
                  </div>

                  <p>You won’t see posts like this anymore.</p>
                </div>
              ) : (
                <div
                  style={{
                    width: "680px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Post Header */}
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Profile Picture */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                      >
                        <img
                          src={post.profilePic || defaultPic}
                          alt="profilePic"
                          style={{ borderRadius: "50%" }}
                        />
                      </div>

                      {/* Page Info */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#050505",
                            }}
                          >
                            {post.username}
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
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                            color: "#65676b",
                          }}
                        >
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
                          transition: "background-color 0.2s",
                        }}
                        onClick={() =>
                          setOpenMenuPostId(
                            openMenuPostId === post.id ? null : post.id
                          )
                        } //same post click it will be closed
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f2f5")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                        }
                      >
                        <MoreHorizontal size={20} color="#65676b" />
                      </div>

                      {/* open the three dots */}
                      {openMenuPostId === post.id && (
                        <div
                          style={{
                            position: "absolute",
                            left: "950px",
                            right: "0px",
                            marginTop: "50px",
                            width: "300px",
                            background: "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            zIndex: 999,
                            padding: "8px",
                          }}
                        >
                          <div
                            style={{ padding: "10px", cursor: "pointer" }}
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "#f0f2f5")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                            }
                            onClick={handleInterested}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CirclePlus />{" "}
                              <span style={{ fontWeight: "600" }}>
                                {" "}
                                Interested
                              </span>{" "}
                              <br />
                            </div>
                            <span>More of your posts will be like this</span>
                          </div>

                          <div
                            style={{ padding: "10px", cursor: "pointer" }}
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "#f0f2f5")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                            }
                            onClick={() => handleNotInterested(post.id)}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CircleMinus />{" "}
                              <span style={{ fontWeight: "600" }}>
                                {" "}
                                Not Interested
                              </span>
                            </div>

                            <span>Fewer of your posts will be like this </span>
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
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f2f5")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                        }
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
                  {(() => {
                    console.log("Fetching the post family: " + post?.fontFamily);
                    // debugger
                    return post.backgroundStyle ? (
                      // Background style post with font
                      <div style={{ padding: "0 16px 8px 16px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "300px",
                            background: post.backgroundStyle,
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
                              fontSize: post?.fontSize || "32px",
                              fontWeight: post?.fontWeight || "700",
                              fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
                              textAlign: post?.textAlign || "center",
                              fontStyle: post?.fontStyle || "normal",
                              color: "white",
                              wordBreak: "break-word",
                            }}
                          >
                            {post?.content || ""}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Normal text without background (with font)
                      <div
                        style={{
                          padding: "0 16px 8px 16px",
                          fontSize: post?.fontSize || "16px",
                          fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
                          fontWeight: post?.fontWeight || "400",
                          textAlign: post?.textAlign || "left",
                          fontStyle: post?.fontStyle || "normal",
                          lineHeight: "1.3333",
                          // border: "1px solid red",
                          wordBreak: "break-word",
                        }}
                      >
                        {post?.content || ""}
                      </div>
                    );
                  })()}

                  {/* Post Image */}
                  {!post.backgroundStyle && post.postImage && (
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#000000",
                        position: "relative",
                      }}
                    >
                      {post.fileType === "video" ? (
                        <video
                          src={post.postImage}
                          controls
                          style={{
                            width: "100%",
                            maxHeight: "500px",
                            display: "block",
                          }}
                        />
                      ) : (
                        <img
                          src={post.postImage}
                          alt="Post content"
                          style={{
                            width: "100%",
                            maxHeight: "500px",
                            display: "block",
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #e4e6eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {/* Like Icon */}
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
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#65676b",
                        }}
                      >
                        {post.likeCount}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "15px",
                        color: "#65676b",
                      }}
                    >
                      <span style={{ cursor: "pointer" }}>
                        {post.commentList.length} comments
                      </span>
                      <span style={{ cursor: "pointer" }}>
                        {post.shares} shares
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      padding: "4px 16px",
                      display: "flex",
                      justifyContent: "space-around",
                      gap: "8px",
                    }}
                  >
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
                        color: post.liked ? "#0866FF" : "#65676b",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f2f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <ThumbsUp
                        size={20}
                        color={post.liked ? "#0866FF" : "#65676b"}
                        fill={post.liked ? "#0866FF" : "none"}
                      />
                      <span>Like</span>
                    </button>

                    {/* Comment Button */}
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
                        color: "#65676b",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f2f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <MessageCircle size={20} />
                      <span>Comment</span>
                    </button>

                    {/* Share Button */}
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
                        color: "#65676b",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f2f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Share2 size={20} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <CommentModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        post={selectedPost}
        posts={postList} // Pass posts state to modal
        setPosts={setPostList} // Pass setPosts function to update posts
        handleLike={handleLike}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
        handleShare={handleShare}
      />

      <CreatePostModal
        show={createModalShow}
        onHide={() => setCreateModalShow(false)}
        onCreatePost={handleAddNewPost}
        modalFileInputRef={modalFileInputRef}
        triggerFileUpload={openFileInputFromHome}
      />

      <ShareButton
        show={shareModalShow}
        onHide={() => setShareModalShow(false)}
        post={selectedPost}
      />

      {storyViewShow && (
        <StoryView
          story={selectedStory}
          stories={storyList}
          close={() => setStoryViewShow(false)}
          onShareStory={handleCreateStory}
          onDeleteStory={(deletedId) => {
            setStoryList((prev) => prev.filter((s) => s.id !== deletedId));
          }}
        />
      )}

      {/* Create story view show */}
      {createStoryShow && (
        <CreateStory
          close={() => setCreateStoryShow(false)}
          onCreateStory={handleCreateStory}
        />
      )}

      {/* {userProfilePage && (
        <UserProfilePage
          close={() => setUserProfilePage(false)}
          userPosts={postList.filter(post => post.username === user.username)} // ADD THIS
        />
      )} */}
    </div>
  );
}

export default FbHome;


// import { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight, Search } from "react-bootstrap-icons";
// import { CircleMinus, CirclePlus } from "lucide-react";
// import { Plus } from "lucide-react";
// import {
//   ThumbsUp,
//   MessageCircle,
//   Share2,
//   MoreHorizontal,
//   X,
//   Globe,
// } from "lucide-react";
// import "./FbHome.css";
// import ShareButton from "../../features/buttons/ShareButton";
// import CreatePostModal from "../../features/modals/CreatePostModal";
// import CommentModal from "../../features/modals/CommentModal";
// import StoryView from "../../features/stories/StoryView";
// import axios from "axios";
// import CreateStory from "../../features/stories/CreateStory";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserProvider";
// import { usePostsContext } from "../../context/PostsContext";
// import "./FbHome.css";

// function FbHome() {
//   const navigate = useNavigate();
//   const { user, profilePic, setProfilePic } = useUser();

//   const defaultPic =
//     "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

//   const [storyList, setStoryList] = useState([]);
//   //API base URL
//   const API_BASE_URL = "http://localhost:8082/Org_Management_java/api";

//   const storyRef = useRef(null); //ref for each story video to play on hover
//   storyRef.current = []; // clear on each render if needed

//   // const [postList, setPostList] = useState([]);
//   const { postList, setPostList } = usePostsContext([]);

//   //use state to show the modal when clicking comment button
//   const [selectedPost, setSelectedPost] = useState(null);

//   const [modalShow, setModalShow] = useState(false);

//   //handle each comment
//   const [commentText, setCommentText] = useState({});
//   const [openMenuPostId, setOpenMenuPostId] = useState(null);

//   //stroy movable button
//   const storyContainerRef = useRef(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   //show the create post modal
//   const [createModalShow, setCreateModalShow] = useState(false);

//   //handle share button
//   const [shareModalShow, setShareModalShow] = useState(false);

//   //show the story view page
//   const [selectedStory, setSelectedStory] = useState(null);
//   const [storyViewShow, setStoryViewShow] = useState(false);

//   //show the create story
//   const [createStoryShow, setCreateStoryShow] = useState(false);

//   //to open the file input from home page
//   const modalFileInputRef = useRef(null);

//   // Clear data immediately when user changes or logs out
//   // useEffect(() => {
//   //   if (!user || !user.username) {
//   //     // User logged out - clear everything
//   //     setPostList([]);
//   //     setStoryList([]);
//   //     setSelectedPost(null);
//   //     setCreateModalShow(false);
//   //     setModalShow(false);
//   //     setStoryViewShow(false);
//   //     return;
//   //   }

//   //   //Formatted Upload time
//   //   const formatUploadTime = (createdAt) => {
//   //     if (!createdAt) return "Just now";

//   //     const now = new Date();
//   //     const uploadTime = new Date(createdAt);
//   //     const diffMs = now - uploadTime;
//   //     const diffMins = Math.floor(diffMs / 60000);
//   //     const diffHours = Math.floor(diffMs / 3600000);
//   //     const diffDays = Math.floor(diffMs / 86400000);

//   //     if (diffMins < 1) {
//   //       return "Just now";
//   //     } else if (diffMins < 60) {
//   //       return `${diffMins}m`;
//   //     } else if (diffHours < 24) {
//   //       return `${diffHours}h`;
//   //     } else {
//   //       return `${diffDays}d`;
//   //     }
//   //   };

//   //   // User logged in - fetch fresh data
//   //   const fetchData = async () => {
//   //     try {
//   //       console.log("Fetching data for user:", user.username);

//   //       // Clear old data BEFORE fetching
//   //       setPostList([]);
//   //       setStoryList([]);

//   //       // In the useEffect where you fetch posts
//   //       const postsResponse = await axios.get(`${API_BASE_URL}/posts`, {
//   //         params: { userId: user?.id },
//   //       });

//   //       console.log("Loaded posts:", user.fontFamily);


//   //       // FIX: Clean up "null" strings
//   //       const fixedPosts = postsResponse.data.map((p) => ({
//   //         ...p,
//   //         backgroundStyle:
//   //           p.backgroundStyle === "null" || p.backgroundStyle === ""
//   //             ? null
//   //             : p.backgroundStyle,
//   //         postImage:
//   //           p.postImage === "null" || p.postImage === "" ? null : p.postImage,
//   //         fileType:
//   //           p.fileType === "null" || p.fileType === "" ? null : p.fileType,
//   //         fontFamily: p.fontFamily && p.fontFamily !== "null" && p.fontFamily !== ""
//   //           ? p.fontFamily
//   //           : "Segoe UI, sans-serif",
//   //         fontSize: p.fontSize && p.fontSize !== "null" && p.fontSize !== ""
//   //           ? p.fontSize
//   //           : "18px",
//   //         fontWeight: p.fontWeight && p.fontWeight !== "null" && p.fontWeight !== ""
//   //           ? p.fontWeight
//   //           : "400",
//   //         textAlign: p.textAlign && p.textAlign !== "null" && p.textAlign !== ""
//   //           ? p.textAlign
//   //           : "left",
//   //         formattedUploadTime: formatUploadTime(p.createdAt),
//   //       }));


//   //       console.log("Fixed posts with fonts:", fixedPosts.map(p => ({
//   //         id: p.id,
//   //         font: p.fontFamily
//   //       })));

//   //       setPostList(fixedPosts);

//   //       // Fetch stories
//   //       const storiesResponse = await axios.get(`${API_BASE_URL}/stories`);
//   //       setStoryList(storiesResponse.data);

//   //       // Fetch profile pic
//   //       const empResponse = await axios.get(
//   //         `http://localhost:8082/Org_Management_java/api/masters/getAllEmp`
//   //       );
//   //       const emp = empResponse.data.find((e) => e.emp_name === user.username);
//   //       setProfilePic(emp?.profile_pic || defaultPic);

//   //       console.log(" Data loaded for:", user.username);
//   //     } catch (error) {
//   //       console.error("Error fetching user data:", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [user?.username]); // Re-run whenever username changes


//   // In FbHome.jsx
//   useEffect(() => {
//     if (!user || !user.username) {
//       // User logged out - clear everything
//       setPostList([]);
//       setStoryList([]);
//       setSelectedPost(null);
//       setCreateModalShow(false);
//       setModalShow(false);
//       setStoryViewShow(false);
//       return;
//     }

//     // Only fetch stories and profile pic here - NOT posts!
//     const fetchNonPostData = async () => {
//       try {
//         console.log("Fetching stories and profile for user:", user.username);

//         // Fetch stories
//         const storiesResponse = await axios.get(`${API_BASE_URL}/stories`);
//         setStoryList(storiesResponse.data);

//         // Fetch profile pic
//         const empResponse = await axios.get(
//           `http://localhost:8082/Org_Management_java/api/masters/getAllEmp`
//         );
//         const emp = empResponse.data.find((e) => e.emp_name === user.username);
//         setProfilePic(emp?.profile_pic || defaultPic);

//         console.log("Stories and profile loaded for:", user.username);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchNonPostData();
//   }, [user?.username]);

//   const openFileInputFromHome = () => {
//     modalFileInputRef.current?.click();
//   };

//   const showStoryView = (story) => {
//     setSelectedStory(story);
//     setStoryViewShow(true);
//   };

//   //show create story
//   const showCreateStory = () => {
//     setCreateStoryShow(true);
//   };

//   //show User Profile Page
//   // const showUserProfilePage = () => {
//   //   setUserProfilePage(true);
//   // }

//   //handle story creation
//   const handleCreateStory = async (storyData) => {
//     try {
//       console.log("Creating story with user:", user);

//       const formData = new FormData();
//       formData.append("userId", user?.id);
//       formData.append("username", user?.username);
//       formData.append("profilePic", storyData.profilePic); // Send file blob

//       if (storyData.type === "photo") {
//         formData.append("storyFile", storyData.file);
//         formData.append("fileType", "image");
//       } else if (storyData.type === "text") {
//         formData.append("storyText", storyData.text);
//         formData.append("backgroundColor", storyData.backgroundColor);
//         formData.append("fileType", "text");
//       }

//       console.log("FormData contents:"); // Debug log
//       for (let [key, value] of formData.entries()) {
//         console.log(key, value);
//       }
//       const response = await axios.post(`${API_BASE_URL}/stories`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Story created:", response.data);

//       // Refresh stories list
//       const updatedStories = await axios.get(`${API_BASE_URL}/stories`);
//       setStoryList(updatedStories.data);

//       // Close the create story modal
//       setCreateStoryShow(false);

//       navigate("/HomePage/facebook");
//     } catch (error) {
//       console.error("Error creating story:", error);
//       console.error("Error response:", error.response?.data); // More detailed error
//       alert(
//         "Failed to create story: " +
//         (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   // Update the createPost function to use FormData correctly


//   // In FbHome.jsx
//   const createPost = async (postData) => {
//     console.log("ProfilePic being sent:", profilePic);
//     console.log("User:", user?.username);
//     console.log("Font data being sent:", postData.fontFamily);

//     const formData = new FormData();
//     formData.append("username", user?.username);
//     formData.append("profilePic", profilePic || defaultPic);
//     formData.append("content", postData.text);

//     if (postData.file) {
//       formData.append("file", postData.file);
//       formData.append("fileType", postData.fileType);
//     }

//     if (postData.backgroundStyle) {
//       formData.append("backgroundStyle", postData.backgroundStyle);
//     }

//     formData.append("fontFamily", postData.fontFamily || "Segoe UI, sans-serif");
//     formData.append("fontSize", postData.fontSize || "18px");
//     formData.append("fontWeight", postData.fontWeight || "400");
//     formData.append("textAlign", postData.textAlign || "left");
//     formData.append("fontStyle", postData.fontStyle || "normal");

//     try {
//       const res = await axios.post(`${API_BASE_URL}/posts`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Post created successfully:", res.data);
//       console.log("Returned fontFamily:", res.data.fontFamily);

//       // Add the new post directly to state with formatted time
//       const newPost = {
//         ...res.data,
//         formattedUploadTime: "Just now",
//         // Ensure all font properties exist
//         fontFamily: res.data.fontFamily || postData.fontFamily || "Segoe UI, sans-serif",
//         fontSize: res.data.fontSize || postData.fontSize || "18px",
//         fontWeight: res.data.fontWeight || postData.fontWeight || "400",
//         textAlign: res.data.textAlign || postData.textAlign || "left",
//         fontStyle: res.data.fontStyle || postData.fontStyle || "normal",
//       };

//       console.log("Adding new post with fontFamily:", newPost.fontFamily);

//       // Add to beginning of list
//       setPostList(prevPosts => [newPost, ...prevPosts]);

//       // DON'T call refreshPosts() - it causes re-render issues
//       // await refreshPosts();

//     } catch (err) {
//       console.error("Error creating post:", err);
//     }
//   };


//   // Update handleAddNewPost
//   const handleAddNewPost = async (newPostData) => {
//     await createPost(newPostData);
//   };

//   const handleLike = async (id) => {
//     try {
//       const userId = Number(user?.id);
//       if (!userId) {
//         console.warn("No user id found — cannot like without login");
//         return;
//       }

//       const res = await axios.put(`${API_BASE_URL}/posts/${id}/like`, {
//         userId,
//       });

//       // safe extraction and fallback
//       const liked = res?.data?.liked ?? false;
//       const likeCount = Number(res?.data?.likeCount ?? 0);

//       setPostList((prevPosts) => {
//         const updated = prevPosts.map((post) =>
//           post.id === id ? { ...post, liked, likeCount } : post
//         );

//         if (selectedPost && selectedPost.id === id) {
//           const newSelected = updated.find((p) => p.id === id);
//           setSelectedPost(newSelected);
//         }

//         return updated;
//       });

//       // Optionally: re-enable button
//       // setLikeInFlight(prev => ({ ...prev, [id]: false }));
//     } catch (error) {
//       console.error("Error toggling like:", error);
//       // Optionally: show user feedback, retry logic, or revert optimistic UI
//     }
//   };

//   // Update handleDeletePost
//   const handleDeletePost = async (postId) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/posts/${postId}`);
//       setPostList((prev) => prev.filter((post) => post.id !== postId));
//     } catch (error) {
//       console.error("Error deleting post:", error);
//     }
//   };

//   // Update handleNotInterested
//   const handleNotInterested = async (postId) => {
//     try {
//       await axios.put(`${API_BASE_URL}/posts/${postId}/hidden`, {
//         isHidden: true,
//       });

//       setPostList((prev) =>
//         prev.map((post) =>
//           post.id === postId ? { ...post, isHidden: true } : post
//         )
//       );
//       setOpenMenuPostId(null);
//     } catch (error) {
//       console.error("Error hiding post:", error);
//     }
//   };

//   // Update handleAddComment
//   const handleAddComment = async (postId) => {
//     if (!commentText[postId] || commentText[postId].trim() === "") return;

//     try {
//       await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, {
//         user: user.username,
//         text: commentText[postId],
//       });

//       // Refresh the post to get updated comments
//       const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);

//       setPostList((prevPosts) => {
//         const updatedPosts = prevPosts.map((post) =>
//           post.id === postId ? response.data : post
//         );

//         if (selectedPost?.id === postId) {
//           setSelectedPost(response.data);
//         }

//         return updatedPosts;
//       });

//       setCommentText((prev) => ({ ...prev, [postId]: "" }));
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   const handleComment = (post) => {
//     setSelectedPost(post);
//     setModalShow(true);
//   };

//   //handle the share button
//   const handleShare = (post) => {
//     setSelectedPost(post);
//     setShareModalShow(true);
//   };

//   const handleNotInterestedUndo = (postId) => {
//     setPostList((prev) =>
//       prev.map((post) =>
//         post.id === postId ? { ...post, isHidden: false } : post
//       )
//     );

//     // closing the menu
//     setOpenMenuPostId(null);
//   };

//   const handleInterested = () => {
//     setOpenMenuPostId(null);
//   };

//   useEffect(() => {
//     const container = storyContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const canScroll = container.scrollWidth > container.clientWidth + 5;

//       setShowLeftArrow(canScroll && container.scrollLeft > 5);
//       setShowRightArrow(
//         canScroll &&
//         container.scrollLeft <
//         container.scrollWidth - container.clientWidth - 5
//       );
//     };

//     container.addEventListener("scroll", handleScroll);

//     // Run after mount
//     handleScroll();

//     return () => container.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Run again when stories update
//   useEffect(() => {
//     const container = storyContainerRef.current;
//     if (!container) return;

//     const canScroll = container.scrollWidth > container.clientWidth + 5;

//     setShowLeftArrow(false);
//     setShowRightArrow(canScroll);
//   }, [storyList]);

//   // FIXED: Add smooth scrolling with callback
//   const slideStories = (direction) => {
//     if (!storyContainerRef.current) return;

//     const container = storyContainerRef.current;
//     const amount = 250; // move 2–3 cards per click

//     if (direction === "left") {
//       container.scrollLeft -= amount;
//     } else {
//       container.scrollLeft += amount;
//     }

//     // FIX: Force update arrows after scroll animation completes
//     setTimeout(() => {
//       const canScroll = container.scrollWidth > container.clientWidth + 5;
//       setShowLeftArrow(canScroll && container.scrollLeft > 5);
//       setShowRightArrow(
//         canScroll &&
//         container.scrollLeft <
//         container.scrollWidth - container.clientWidth - 5
//       );
//     }, 100); // Wait for scroll animation
//   };

//   // handle create post
//   const handleCreatePost = () => {
//     setCreateModalShow(true);
//   };

//   if (!user || !user.username) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ paddingTop: "20px" }} className="fb_home_main_content">
//       <div
//         style={{
//           padding: "20px",
//           backgroundColor: "#F2F4F7 ",
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           marginTop: "-20px",
//           gap: "20px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#ffffffff",
//             width: "680px",
//             height: "62px",
//             padding: "10px",
//             borderRadius: "8px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "20px",
//           }}
//         >
//           <img
//             src={profilePic || defaultPic}
//             alt="fb_profile"
//             height={40}
//             width={40}
//             style={{ borderRadius: "50%" }}
//             onClick={() => navigate("/HomePage/facebook/profile")}
//           />

//           <input
//             onClick={() => handleCreatePost()}
//             type="text"
//             placeholder={`Whats on your mind,${user?.username}?`}
//             style={{
//               borderRadius: "27px",
//               background: "#F0F2F5",
//               width: "472px",
//               height: "40px",
//               color: "#65686C",
//               fontSize: "17px",
//               padding: "8px 12px",
//               fontFamily: "Segoe UI Historic",
//               border: "none",
//             }}
//           />

//           <img
//             src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png"
//             alt="live video icon"
//           />
//           <img
//             src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png"
//             alt="video image icon"
//             onClick={() => {
//               setCreateModalShow(true); // open modal
//               setTimeout(() => openFileInputFromHome(), 50); // open file picker
//             }}
//           />
//           <img
//             src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/Y4mYLVOhTwq.png"
//             alt="smile image"
//           />
//         </div>

//         {/* Stories container */}
//         <div style={{ position: "relative", width: "680px" }}>
//           {/* LEFT BUTTON */}
//           {showLeftArrow && (
//             <button
//               onClick={() => slideStories("left")}
//               style={{
//                 position: "absolute",
//                 left: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 10,
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "50%",
//                 border: "none",
//                 backgroundColor: "white",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 color: "#515458ff",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#f0f2f5";
//                 e.currentTarget.style.transform =
//                   "translateY(-50%) scale(1.05)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronLeft />
//             </button>
//           )}

//           {/* STORIES SCROLL BOX */}
//           <div
//             ref={storyContainerRef}
//             style={{
//               backgroundColor: "#ffffff",
//               width: "680px",
//               padding: "16px",
//               borderRadius: "8px",
//               display: "flex",
//               gap: "8px",
//               overflowX: "auto",
//               scrollBehavior: "smooth",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             {/* Create Story Card */}
//             <div
//               style={{
//                 width: "112.5px",
//                 height: "200px",
//                 background: "#ffffff",
//                 borderRadius: "8px",
//                 position: "relative",
//                 cursor: "pointer",
//                 boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
//                 overflow: "visible",
//                 flexShrink: 0,
//               }}
//               onClick={() => showCreateStory()}
//             >
//               <div
//                 style={{
//                   width: "100%",
//                   height: "140px",
//                   position: "relative",
//                   overflow: "hidden",
//                   borderTopLeftRadius: "8px",
//                   borderTopRightRadius: "8px",
//                 }}
//               >
//                 <img
//                   src={profilePic || defaultPic}
//                   alt="fb_Profile"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </div>

//               <div
//                 style={{
//                   position: "absolute",
//                   top: "120px",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   backgroundColor: "#0866FF",
//                   width: "40px",
//                   height: "40px",
//                   borderRadius: "50%",
//                   border: "4px solid white",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   zIndex: 10,
//                 }}
//               >
//                 <Plus size={24} color="#ffffff" strokeWidth={3} />
//               </div>

//               <div
//                 style={{
//                   padding: "30px 8px 12px 8px",
//                   textAlign: "center",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   height: "60px",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "13px",
//                     fontWeight: "600",
//                     color: "#050505",
//                   }}
//                 >
//                   Create Story
//                 </span>
//               </div>
//             </div>

//             {/* Story Cards from Database */}
//             {storyList.map((story, index) => {
//               return (
//                 <div
//                   key={story.id}
//                   style={{
//                     width: "112.5px",
//                     height: "200px",
//                     background: "#ffffff",
//                     borderRadius: "8px",
//                     boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
//                     overflow: "hidden",
//                     position: "relative",
//                     cursor: "pointer",
//                     flexShrink: 0,
//                   }}
//                   onMouseEnter={() => {
//                     const video = storyRef.current[index];
//                     if (video && story.fileType === "video") {
//                       video.currentTime = 0;
//                       video.play().catch((e) => console.log(e));
//                     }
//                   }}
//                   onMouseLeave={() => {
//                     const video = storyRef.current[index];
//                     if (video && story.fileType === "video") {
//                       video.pause();
//                     }
//                   }}
//                   onClick={() => showStoryView(story)}
//                 >
//                   {/* Render based on file type */}
//                   {story.fileType === "text" ? (
//                     // Text Story
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: story.backgroundColor || "#0866FF",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         padding: "10px",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "white",
//                           fontSize: "14px",
//                           fontWeight: "600",
//                           textAlign: "center",
//                           wordBreak: "break-word",
//                           lineHeight: "1.3",
//                         }}
//                       >
//                         {story.storyText && story.storyText.length > 50
//                           ? story.storyText.substring(0, 50) + "..."
//                           : story.storyText}
//                       </span>
//                     </div>
//                   ) : story.fileType === "video" ? (
//                     // Video Story
//                     <video
//                       ref={(el) => (storyRef.current[index] = el)}
//                       src={story.storyMedia}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                       }}
//                       muted
//                       loop
//                     />
//                   ) : (
//                     // Image Story
//                     <img
//                       src={story.storyMedia}
//                       alt="Story"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                       }}
//                     />
//                   )}

//                   {/* Profile Picture Overlay */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "12px",
//                       left: "12px",
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "50%",
//                       border: "3px solid #0866FF",
//                       overflow: "hidden",
//                       backgroundColor: "#ffffff",
//                     }}
//                   >
//                     <img
//                       src={story.profilePic}
//                       alt="Profile"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </div>

//                   {/* Username Overlay */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "8px",
//                       left: "8px",
//                       right: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#ffffff",
//                         fontSize: "13px",
//                         fontWeight: "600",
//                         textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
//                       }}
//                     >
//                       {story.username}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* RIGHT BUTTON */}
//           {showRightArrow && (
//             <button
//               onClick={() => slideStories("right")}
//               style={{
//                 position: "absolute",
//                 right: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 10,
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "50%",
//                 border: "none",
//                 backgroundColor: "white",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 color: "#515458ff",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#f0f2f5";
//                 e.currentTarget.style.transform =
//                   "translateY(-50%) scale(1.05)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronRight />
//             </button>
//           )}
//         </div>

//         {/* post containers */}
//         {postList.map((post, index) => {
//           // console.log("Post ID:", post.id, "ProfilePic:", post.profilePic);
//           // console.log(`Rendering post ${post.id}:`, {
//           //   fontFamily: post?.fontFamily,
//           //   fontSize: post?.fontSize,
//           //   fontWeight: post?.fontWeight
//           // });
//           return (
//             <div key={post.id || index} style={{ marginBottom: "15px" }}>
//               {/* Hidden post */}
//               {post.isHidden ? (
//                 <div
//                   style={{
//                     width: "680px",
//                     backgroundColor: "#ffffffff",
//                     padding: "20px",
//                     borderRadius: "8px",
//                     color: "#080809",
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <strong>Post hidden</strong>
//                     <button
//                       style={{
//                         padding: "6px 16px",
//                         color: "#080809",
//                         backgroundColor: "#E2E5E9",
//                         borderRadius: "5px",
//                         fontFamily: "Segoe UI Historic",
//                         fontWeight: "600",
//                       }}
//                       onClick={() => handleNotInterestedUndo(post.id)}
//                     >
//                       Undo
//                     </button>
//                   </div>

//                   <p>You won’t see posts like this anymore.</p>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     width: "680px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "8px",
//                     boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Post Header */}
//                   <div
//                     style={{
//                       padding: "12px 16px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                       }}
//                     >
//                       {/* Profile Picture */}
//                       <div
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: "24px",
//                         }}
//                       >
//                         <img
//                           src={post.profilePic || defaultPic}
//                           alt="profilePic"
//                           style={{ borderRadius: "50%" }}
//                         />
//                       </div>

//                       {/* Page Info */}
//                       <div>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "6px",
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "15px",
//                               fontWeight: "600",
//                               color: "#050505",
//                             }}
//                           >
//                             {post.username}
//                           </span>
//                           <span
//                             style={{
//                               fontSize: "13px",
//                               color: "#0866FF",
//                               fontWeight: "600",
//                               cursor: "pointer",
//                             }}
//                           >
//                             · Follow
//                           </span>
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                             fontSize: "13px",
//                             color: "#65676b",
//                           }}
//                         >
//                           <span>{post.formattedUploadTime}</span>
//                           <span>·</span>
//                           <Globe size={12} />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div style={{ display: "flex", gap: "8px" }}>
//                       <div
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           cursor: "pointer",
//                           transition: "background-color 0.2s",
//                         }}
//                         onClick={() =>
//                           setOpenMenuPostId(
//                             openMenuPostId === post.id ? null : post.id
//                           )
//                         } //same post click it will be closed
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#f0f2f5")
//                         }
//                         onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor =
//                           "transparent")
//                         }
//                       >
//                         <MoreHorizontal size={20} color="#65676b" />
//                       </div>

//                       {/* open the three dots */}
//                       {openMenuPostId === post.id && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             left: "950px",
//                             right: "0px",
//                             marginTop: "50px",
//                             width: "300px",
//                             background: "white",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                             borderRadius: "8px",
//                             zIndex: 999,
//                             padding: "8px",
//                           }}
//                         >
//                           <div
//                             style={{ padding: "10px", cursor: "pointer" }}
//                             onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor =
//                               "#f0f2f5")
//                             }
//                             onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor =
//                               "transparent")
//                             }
//                             onClick={handleInterested}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                               }}
//                             >
//                               <CirclePlus />{" "}
//                               <span style={{ fontWeight: "600" }}>
//                                 {" "}
//                                 Interested
//                               </span>{" "}
//                               <br />
//                             </div>
//                             <span>More of your posts will be like this</span>
//                           </div>

//                           <div
//                             style={{ padding: "10px", cursor: "pointer" }}
//                             onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor =
//                               "#f0f2f5")
//                             }
//                             onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor =
//                               "transparent")
//                             }
//                             onClick={() => handleNotInterested(post.id)}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                               }}
//                             >
//                               <CircleMinus />{" "}
//                               <span style={{ fontWeight: "600" }}>
//                                 {" "}
//                                 Not Interested
//                               </span>
//                             </div>

//                             <span>Fewer of your posts will be like this </span>
//                           </div>
//                         </div>
//                       )}
//                       <div
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           cursor: "pointer",
//                           transition: "background-color 0.2s",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#f0f2f5")
//                         }
//                         onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor =
//                           "transparent")
//                         }
//                       >
//                         <X
//                           size={20}
//                           color="#65676b"
//                           onClick={() => handleDeletePost(post.id)}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Post Content */}
//                   {(() => {
//                     console.log("Fetching the post family: " + post?.fontFamily);
//                     // debugger
//                     return post.backgroundStyle ? (
//                       // Background style post with font
//                       <div style={{ padding: "0 16px 8px 16px" }}>
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "300px",
//                             background: post.backgroundStyle,
//                             borderRadius: "10px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             padding: "20px",
//                             marginTop: "8px",
//                           }}
//                         >
//                           <div
//                             style={{
//                               fontSize: post?.fontSize || "32px",
//                               fontWeight: post?.fontWeight || "700",
//                               fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
//                               textAlign: post?.textAlign || "center",
//                               fontStyle:post?.fontStyle || "normal",
//                               color: "white",
//                               wordBreak: "break-word",
//                             }}
//                           >
//                             {post?.content || ""}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       // Normal text without background (with font)
//                       <div
//                         style={{
//                           padding: "0 16px 8px 16px",
//                           fontSize: post?.fontSize || "16px",
//                           fontFamily: post?.fontFamily || "Segoe UI, sans-serif",
//                           fontWeight: post?.fontWeight || "400",
//                           textAlign: post?.textAlign || "left",
//                           fontStyle:post?.fontStyle || "normal",
//                           lineHeight: "1.3333",
//                           // border: "1px solid red",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {post?.content || ""}
//                       </div>
//                     );
//                   })()}

//                   {/* Post Image */}
//                   {!post.backgroundStyle && post.postImage && (
//                     <div
//                       style={{
//                         width: "100%",
//                         backgroundColor: "#000000",
//                         position: "relative",
//                       }}
//                     >
//                       {post.fileType === "video" ? (
//                         <video
//                           src={post.postImage}
//                           controls
//                           style={{
//                             width: "100%",
//                             maxHeight: "500px",
//                             display: "block",
//                           }}
//                         />
//                       ) : (
//                         <img
//                           src={post.postImage}
//                           alt="Post content"
//                           style={{
//                             width: "100%",
//                             maxHeight: "500px",
//                             display: "block",
//                           }}
//                         />
//                       )}
//                     </div>
//                   )}

//                   {/* Engagement Stats */}
//                   <div
//                     style={{
//                       padding: "12px 16px",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       borderBottom: "1px solid #e4e6eb",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {/* Like Icon */}
//                       <div
//                         style={{
//                           width: "18px",
//                           height: "18px",
//                           borderRadius: "50%",
//                           backgroundColor: "#0866FF",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <ThumbsUp size={11} color="#ffffff" fill="#ffffff" />
//                       </div>
//                       <span
//                         style={{
//                           fontSize: "15px",
//                           color: "#65676b",
//                         }}
//                       >
//                         {post.likeCount}
//                       </span>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "16px",
//                         fontSize: "15px",
//                         color: "#65676b",
//                       }}
//                     >
//                       <span style={{ cursor: "pointer" }}>
//                         {post.commentList.length} comments
//                       </span>
//                       <span style={{ cursor: "pointer" }}>
//                         {post.shares} shares
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div
//                     style={{
//                       padding: "4px 16px",
//                       display: "flex",
//                       justifyContent: "space-around",
//                       gap: "8px",
//                     }}
//                   >
//                     <button
//                       onClick={() => handleLike(post.id)}
//                       style={{
//                         flex: 1,
//                         padding: "8px",
//                         border: "none",
//                         backgroundColor: "transparent",
//                         borderRadius: "4px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                         cursor: "pointer",
//                         fontSize: "15px",
//                         fontWeight: "600",
//                         color: post.liked ? "#0866FF" : "#65676b",
//                         transition: "background-color 0.2s",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#f0f2f5")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor = "transparent")
//                       }
//                     >
//                       <ThumbsUp
//                         size={20}
//                         color={post.liked ? "#0866FF" : "#65676b"}
//                         fill={post.liked ? "#0866FF" : "none"}
//                       />
//                       <span>Like</span>
//                     </button>

//                     {/* Comment Button */}
//                     <button
//                       onClick={() => handleComment(post)}
//                       style={{
//                         flex: 1,
//                         padding: "8px",
//                         border: "none",
//                         backgroundColor: "transparent",
//                         borderRadius: "4px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                         cursor: "pointer",
//                         fontSize: "15px",
//                         fontWeight: "600",
//                         color: "#65676b",
//                         transition: "background-color 0.2s",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#f0f2f5")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor = "transparent")
//                       }
//                     >
//                       <MessageCircle size={20} />
//                       <span>Comment</span>
//                     </button>

//                     {/* Share Button */}
//                     <button
//                       onClick={() => handleShare(post)}
//                       style={{
//                         flex: 1,
//                         padding: "8px",
//                         border: "none",
//                         backgroundColor: "transparent",
//                         borderRadius: "4px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                         cursor: "pointer",
//                         fontSize: "15px",
//                         fontWeight: "600",
//                         color: "#65676b",
//                         transition: "background-color 0.2s",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#f0f2f5")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor = "transparent")
//                       }
//                     >
//                       <Share2 size={20} />
//                       <span>Share</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <CommentModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//         post={selectedPost}
//         posts={postList} // Pass posts state to modal
//         setPosts={setPostList} // Pass setPosts function to update posts
//         handleLike={handleLike}
//         commentText={commentText}
//         setCommentText={setCommentText}
//         handleAddComment={handleAddComment}
//         handleShare={handleShare}
//       />

//       <CreatePostModal
//         show={createModalShow}
//         onHide={() => setCreateModalShow(false)}
//         onCreatePost={handleAddNewPost}
//         modalFileInputRef={modalFileInputRef}
//         triggerFileUpload={openFileInputFromHome}
//       />

//       <ShareButton
//         show={shareModalShow}
//         onHide={() => setShareModalShow(false)}
//         post={selectedPost}
//       />

//       {storyViewShow && (
//         <StoryView
//           story={selectedStory}
//           stories={storyList}
//           close={() => setStoryViewShow(false)}
//           onShareStory={handleCreateStory}
//           onDeleteStory={(deletedId) => {
//             setStoryList((prev) => prev.filter((s) => s.id !== deletedId));
//           }}
//         />
//       )}

//       {/* Create story view show */}
//       {createStoryShow && (
//         <CreateStory
//           close={() => setCreateStoryShow(false)}
//           onCreateStory={handleCreateStory}
//         />
//       )}

//       {/* {userProfilePage && (
//         <UserProfilePage
//           close={() => setUserProfilePage(false)}
//           userPosts={postList.filter(post => post.username === user.username)} // ADD THIS
//         />
//       )} */}
//     </div>
//   );
// }

// export default FbHome;
