// import { useState, useRef, useEffect } from "react";
// import "./StoryView.css";
// import sendIcon from "../../assets/icons/send.png";
// import EmojiPicker from "emoji-picker-react";
// import { Smile } from "lucide-react";
// import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
// import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
// import CreateStory from "./CreateStory";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserProvider";
// import axios from "axios";
// import { ProgressBar } from "react-bootstrap";

// function StoryView({ story, stories, close, onShareStory, onDeleteStory }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const { user } = useUser();
//   const menuRef = useRef(null);

//   //change active story on click of story item from left sidebar
//   const [activeStory, setActiveStory] = useState(story);

//   //   const isStoryOwner = activeStory?.username === user?.username;
//   const isStoryOwner = activeStory.userId === user?.id;


//   console.log("activeStory:", activeStory);
//   console.log("loggedInUser:", user);

//   //play and pause state
//   const [showplay, setShowPlay] = useState(false);

//   //mute and unmute state
//   const [showspeaker, setShowSpeaker] = useState(true);

//   //useRef to control video playback
//   const videoRef = useRef(null);

//   //to show the emoji layer on top of the modal
//   const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

//   //post text state
//   const [postText, setPostText] = useState("");

//   //story progress state
//   const [progress, setProgress] = useState(0);

//   //find active index of the story
//   const activeIndex = stories.findIndex((s) => s.id === activeStory.id);
//   console.log(activeIndex);

//   const [isPaused, setIsPaused] = useState(false);

//   //show the create story
//   const [createStoryShow, setCreateStoryShow] = useState(false);

//   const navigate = useNavigate();

//   // Add delete handler
//   const handleDeleteStory = async () => {
//     if (!window.confirm("Are you sure you want to delete this story?")) {
//       return;
//     }

//     try {
//       await axios.delete(
//         `http://localhost:8082/Org_Management_java/api/stories/${activeStory.id}`
//       );

//       // Call parent callback
//       if (onDeleteStory) {
//         onDeleteStory(activeStory.id);
//       }

//       const updatedStories = stories.filter((s) => s.id !== activeStory.id);

//       if (updatedStories.length === 0) {
//         close();
//       } else {
//         const newActiveIndex =
//           activeIndex >= updatedStories.length
//             ? updatedStories.length - 1
//             : activeIndex;
//         setActiveStory(updatedStories[newActiveIndex]);
//       }
//     } catch (error) {
//       console.error("Error deleting story:", error);
//       alert("Failed to delete story!");
//     }
//   };

//   const handleShareStory = (storyData) => {
//     // Call the parent handler (FbHome)
//     if (onShareStory) {
//       onShareStory(storyData);
//     }

//     // Close the modal
//     close();

//     // Redirect to home page
//     navigate("/HomePage/facebook");
//   };

//   // Format time function
//   const formatUploadTime = (uploadedAt) => {
//     if (!uploadedAt) return "Just now";

//     const now = new Date();
//     const uploadTime = new Date(uploadedAt);
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

//   // Group stories by userId
//   const groupedStories = stories.reduce((acc, story) => {
//     const userId = story.userId !== null ? story.userId : story.username;

//     if (!acc[userId]) {
//       acc[userId] = {
//         userId: userId,
//         username: story.username,
//         profilePic: story.profilePic,
//         stories: [],
//         latestTime: story.uploadedAt
//       };
//     }
//     acc[userId].stories.push(story);
//     // Update latest time if this story is newer
//     if (new Date(story.uploadedAt) > new Date(acc[userId].latestTime)) {
//       acc[userId].latestTime = story.uploadedAt;
//     }
//     return acc;
//   }, {});

//   // Convert to array and sort by latest story time
//   const groupedStoriesArray = Object.values(groupedStories).sort(
//     (a, b) => new Date(b.latestTime) - new Date(a.latestTime)
//   );



//   useEffect(() => {
//     const video = videoRef.current;

//     // Only for video stories
//     if (!video || activeStory.fileType !== "video") return;

//     const updateProgress = () => {
//       if (video && video.duration) {
//         const percent = (video.currentTime / video.duration) * 100;
//         setProgress(percent);
//       }
//     };

//     video.addEventListener("timeupdate", updateProgress);

//     return () => {
//       video.removeEventListener("timeupdate", updateProgress);
//     };
//   }, [activeStory]);

//   //handle play/pause toggle
//   const togglePlay = () => {
//     const video = videoRef.current;

//     if (!video || activeStory.fileType !== "video") return;

//     if (video.paused) {
//       video.play();
//       setShowPlay(false);
//     } else {
//       video.pause();
//       setShowPlay(true);
//     }
//   };

//   //handle mute/unmute toggle
//   const toggleMute = () => {
//     const video = videoRef.current;

//     if (!video || activeStory.fileType !== "video") return;

//     video.muted = !video.muted;
//     setShowSpeaker(!video.muted);
//   };

//   // const nextStory = () => {
//   //   if (activeIndex < stories.length - 1) {
//   //     setActiveStory(stories[activeIndex + 1]);
//   //     setProgress(0);
//   //   } else {
//   //     close();
//   //   }
//   // };

//   // const prevStory = () => {
//   //   if (activeIndex > 0) {
//   //     setActiveStory(stories[activeIndex - 1]);
//   //     setProgress(0);
//   //   }
//   // };

//   const nextStory = () => {
//     // Find current user's stories
//     const currentUserStories = stories.filter(s => s.userId === activeStory.userId);
//     const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

//     // If there are more stories from this user
//     if (currentIndexInUserStories < currentUserStories.length - 1) {
//       setActiveStory(currentUserStories[currentIndexInUserStories + 1]);
//       setProgress(0);
//     } else {
//       // Move to next user's first story
//       const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
//       if (currentUserIndex < groupedStoriesArray.length - 1) {
//         setActiveStory(groupedStoriesArray[currentUserIndex + 1].stories[0]);
//         setProgress(0);
//       } else {
//         close();
//       }
//     }
//   };

//   const prevStory = () => {
//     // Find current user's stories
//     const currentUserStories = stories.filter(s => s.userId === activeStory.userId);
//     const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

//     // If there are previous stories from this user
//     if (currentIndexInUserStories > 0) {
//       setActiveStory(currentUserStories[currentIndexInUserStories - 1]);
//       setProgress(0);
//     } else {
//       // Move to previous user's last story
//       const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
//       if (currentUserIndex > 0) {
//         const prevUserStories = groupedStoriesArray[currentUserIndex - 1].stories;
//         setActiveStory(prevUserStories[prevUserStories.length - 1]);
//         setProgress(0);
//       }
//     }
//   };

//   //dont play video until metadata is loaded
//   useEffect(() => {
//     setProgress(0);
//     const video = videoRef.current;

//     // Only for video stories
//     if (!video || activeStory.fileType !== "video") return;

//     video.currentTime = 0;

//     const handleLoaded = () => {
//       video.play().catch(() => { });
//       setShowPlay(false);
//     };

//     video.addEventListener("loadeddata", handleLoaded);
//     video.addEventListener("ended", nextStory);

//     return () => {
//       video.removeEventListener("loadeddata", handleLoaded);
//       video.removeEventListener("ended", nextStory);
//     };
//   }, [activeStory]);

//   // Auto progress ONLY when not paused AND only for text/image
//   useEffect(() => {
//     if (activeStory.fileType === "text" || activeStory.fileType === "image") {
//       if (isPaused) return; //  Pause when user holds mouse / UI pause

//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             nextStory();
//             return 0;
//           }
//           return prev + 1; // Progress speed (adjust if needed)
//         });
//       }, 100); // 100ms → smooth bar

//       return () => clearInterval(interval);
//     }
//   }, [activeStory, activeIndex, isPaused]);

//   // Pause / Play when user holds the mouse or UI pause state
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;

//     if (isPaused) {
//       video.pause();
//       setShowPlay(true); // show play icon UI
//     } else {
//       video.play().catch(() => { });
//       setShowPlay(false); // hide play icon UI
//     }
//   }, [isPaused, activeStory]);

//   useEffect(() => {
//     setProgress(0);
//   }, [activeStory]);

//   //handle the emoji
//   const handleEmojiClick = (emojiObject) => {
//     const emoji = emojiObject.emoji || emojiObject.native || emojiObject;
//     setPostText((prev) => prev + emoji);
//     setShowEmojiOverlay(false);
//   };

//   //show create story
//   const showCreateStory = () => {
//     setCreateStoryShow(true);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "#000",
//         display: "flex",
//         zIndex: 9999,
//       }}
//     >
//       {/* Left Sidebar */}
//       <div
//         style={{
//           backgroundColor: "#FFFFFF",
//           padding: "10px 16px",
//           width: "360px",
//           height: "100vh",
//           overflowY: "auto",
//         }}
//       >
//         {/* close button */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "20px",
//             gap: "10px",
//           }}
//         >
//           <div className="fb-close-wrapper" onClick={close}>
//             <button className="fb-close-btn"></button>
//           </div>

//           <img
//             src="https://www.facebook.com/images/fb_icon_325x325.png"
//             alt="Facebook Logo"
//             style={{ height: "40px", marginRight: "14px" }}
//           />
//         </div>

//         {/* HR Line */}
//         <hr
//           style={{
//             width: "100%",
//             border: "none",
//             height: "2px",
//             backgroundColor: "#CED0D4",
//           }}
//         />

//         <h4 style={{ fontWeight: "bold" }}>Stories</h4>
//         <p style={{ color: "#0064D1", fontSize: "15px" }}>Archive · Settings</p>

//         <div>
//           <p style={{ fontSize: "17px", fontWeight: "600" }}>Your Story</p>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "start",
//               alignItems: "center",
//               gap: "12px",
//               cursor: "pointer",
//             }}
//             onClick={() => showCreateStory()}
//           >
//             <div
//               style={{
//                 background: "#F0F2F5",
//                 padding: "20px",
//                 borderRadius: "50%",
//                 width: "65px",
//                 height: "65px",
//                 cursor: "pointer",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <span style={{ color: "#0064D1", fontSize: "24px" }}>+</span>
//             </div>

//             <div>
//               <span style={{ fontSize: "15px", fontWeight: "600" }}>
//                 Create a Story
//               </span>
//               <p style={{ fontSize: "13px" }}>
//                 Share a photo or write something
//               </p>
//             </div>
//           </div>
//         </div>



//         <div style={{ marginTop: "20px" }}>
//           <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
//           {groupedStoriesArray.map((userGroup) => (
//             <div
//               className="story-item"
//               onClick={() => setActiveStory(userGroup.stories[0])} // Show first story of this user
//               style={{
//                 borderRadius: userGroup.stories.some(s => s.id === activeStory.id) ? "8px" : "0px",
//                 backgroundColor: userGroup.stories.some(s => s.id === activeStory.id)
//                   ? "#e8e9ebff"
//                   : "transparent",
//                 cursor: "pointer",
//                 position: "relative"
//               }}
//               key={userGroup.userId}
//             >
//               <div
//                 style={{
//                   padding: "3px",
//                   background: "#FFFFFF",
//                   borderRadius: "50%",
//                   border: "2px solid #0064D1",
//                   position: "relative"
//                 }}
//               >
//                 {/* Story count badge */}
//                 {userGroup.stories.length > 1 && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-5px",
//                       right: "-5px",
//                       background: "#0866FF",
//                       borderRadius: "50%",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "12px",
//                       fontWeight: "600",
//                       color: "white",
//                       border: "2px solid white",
//                       zIndex: 1
//                     }}
//                   >
//                     {userGroup.stories.length}
//                   </div>
//                 )}

//                 <div
//                   style={{
//                     width: "58.5px",
//                     height: "58.5px",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     background: "#F0F2F5",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <img
//                     src={userGroup.profilePic}
//                     alt="Story"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <span style={{ fontSize: "15px", fontWeight: "600" }}>
//                   {userGroup.username}
//                 </span>
//                 <p style={{ fontSize: "13px", color: "#65676B" }}>
//                   {formatUploadTime(userGroup.latestTime)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* <div style={{ marginTop: "20px" }}>
//           <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
//           {stories.map((storyItem) => (
//             <div
//               className="story-item"
//               onClick={() => setActiveStory(storyItem)}
//               style={{
//                 borderRadius: activeStory.id === storyItem.id ? "8px" : "0px",
//                 backgroundColor:
//                   activeStory.id === storyItem.id ? "#e8e9ebff" : "transparent",
//                 cursor: "pointer",
//               }}
//               key={storyItem.id}
//             >
//               <div
//                 style={{
//                   padding: "3px",
//                   background: "#FFFFFF",
//                   borderRadius: "50%",
//                   border: "2px solid #0064D1",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "58.5px",
//                     height: "58.5px",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     background: "#F0F2F5",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <img
//                     src={storyItem.profilePic}
//                     alt="Story"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <span style={{ fontSize: "15px", fontWeight: "600" }}>
//                   {storyItem.username}
//                 </span>
//                 <p style={{ fontSize: "13px", color: "#65676B" }}>
//                   {formatUploadTime(storyItem.uploadedAt)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div> */}
//       </div>

//       {/* Story Content */}
//       <div
//         style={{
//           flex: 1,
//           backgroundColor: "#080809",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         <div style={{ width: "500px", height: "90vh", position: "relative" }}>
//           {/* Left Navigation button */}
//           {activeIndex > 0 && (
//             <button
//               onClick={prevStory}
//               style={{
//                 position: "absolute",
//                 left: "-60px",
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
//                   "translateY(-50%) scale(1.05) translateX(-4px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronLeft />
//             </button>
//           )}

//           {/* Right Navigation button */}
//           {activeIndex < stories.length - 1 && (
//             <button
//               onClick={nextStory}
//               style={{
//                 position: "absolute",
//                 right: "-60px",
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
//                   "translateY(-50%) scale(1.05) translateX(4px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronRight />
//             </button>
//           )}

//           {/* Story Header */}
//           <div
//             style={{
//               position: "absolute",
//               top: "15px",
//               left: "15px",
//               right: "15px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: "5px",
//               color: "white",
//               zIndex: 10,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px",
//                 marginTop: "-27px",
//               }}
//             >
//               <img
//                 src={activeStory.profilePic}
//                 alt="profile"
//                 style={{
//                   width: "45px",
//                   height: "45px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />

//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "start",
//                   justifyContent: "start",
//                   marginLeft: "10px",
//                   gap: "5px",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "15px",
//                     fontWeight: "600",
//                     color: "white",
//                   }}
//                 >
//                   {activeStory.username}
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "13px",
//                     opacity: 0.8,
//                     color: "white",
//                     marginTop: "2px",
//                   }}
//                 >
//                   {formatUploadTime(activeStory.uploadedAt)}
//                 </span>
//               </div>

//               <svg
//                 viewBox="0 0 12 13"
//                 width="12"
//                 height="12"
//                 fill="white"
//                 style={{ cursor: "pointer", marginTop: "2px" }}
//               >
//                 <g fillRule="evenodd" transform="translate(-450 -1073)">
//                   <path d="M458.5 1078.5c-.827 0-1.5-.784-1.5-1.75 0-1.079.575-1.75 1.5-1.75s1.5.671 1.5 1.75c0 .966-.673 1.75-1.5 1.75m.838 1h-1.03a.3.3 0 0 0-.23.491 3.97 3.97 0 0 1 .922 2.544v.665a.3.3 0 0 0 .3.3h1.362c.737 0 1.338-.6 1.338-1.338a2.665 2.665 0 0 0-2.662-2.662m-2.616 5h-5.444a1.28 1.28 0 0 1-1.278-1.278v-.687a3.038 3.038 0 0 1 3.035-3.035h1.93a3.039 3.039 0 0 1 3.035 3.035v.687a1.28 1.28 0 0 1-1.278 1.278m-2.722-6c-1.103 0-2-1.01-2-2.25 0-1.388.767-2.25 2-2.25s2 .862 2 2.25c0 1.24-.897 2.25-2 2.25" />
//                 </g>
//               </svg>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 marginTop: "-27px",
//               }}
//             >
//               {/* Only show speaker for videos */}
//               {activeStory.fileType === "video" && (
//                 <div className="fb-icon-btn" onClick={toggleMute}>
//                   {showspeaker ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       width="26"
//                       height="26"
//                       fill="white"
//                     >
//                       <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zm12.7.05a1 1 0 1 0-1.414 1.414 5.008 5.008 0 0 1 0 7.072 1 1 0 1 0 1.414 1.414 7.009 7.009 0 0 0 0-9.9z" />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       width="28"
//                       height="28"
//                       fill="white"
//                     >
//                       <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zM21.707 9.293a1 1 0 0 0-1.414 0L19 10.586l-1.293-1.293a1 1 0 0 0-1.414 1.414L17.586 12l-1.293 1.293a1 1 0 1 0 1.414 1.414L19 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L20.414 12l1.293-1.293a1 1 0 0 0 0-1.414z" />
//                     </svg>
//                   )}
//                 </div>
//               )}

//               {/* Only show play/pause for videos */}
//               {activeStory.fileType === "video" && (
//                 <div className="fb-icon-btn" onClick={togglePlay}>
//                   {showplay ? (
//                     <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                   ) : (
//                     <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                       <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//                     </svg>
//                   )}
//                 </div>
//               )}

//               {/* Three dots */}

//               {/* <div className="fb-icon-btn">
//                 <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                   <circle cx="5" cy="12" r="2"></circle>
//                   <circle cx="12" cy="12" r="2"></circle>
//                   <circle cx="19" cy="12" r="2"></circle>
//                 </svg>
//               </div> */}

//               {isStoryOwner && (
//                 <div
//                   className="fb-icon-btn"
//                   onClick={() => setShowMenu(!showMenu)}
//                 >
//                   <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                     <circle cx="5" cy="12" r="2"></circle>
//                     <circle cx="12" cy="12" r="2"></circle>
//                     <circle cx="19" cy="12" r="2"></circle>
//                   </svg>
//                 </div>
//               )}

//               {showMenu && isStoryOwner && (
//                 <div
//                   ref={menuRef}
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "2px",
//                     background: "#fff",
//                     borderRadius: "8px",
//                     padding: "10px",
//                     boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//                     zIndex: 1000,
//                     width: "150px",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: 0,
//                       padding: "6px 8px",
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                       color: "red",
//                     }}
//                     onClick={handleDeleteStory}
//                   >
//                     Delete Story
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Progress Line */}
//           {/* <div
//             style={{
//               position: "absolute",
//               top: -30,
//               left: 0,
//               height: "4px",
//               width: "100%",
//               background: "rgba(255,255,255,0.3)",
//               borderRadius: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 height: "100%",
//                 width: `${progress}%`,
//                 background: "white",
//                 transition: "width 0.3s linear",
//               }}
//             ></div>
//           </div> */}

//           {/* Multiple story indicators - show only if user has more than 1 story */}
//           {(() => {
//             // Determine the "owner key": either userId or username
//             const ownerKey = activeStory.userId ?? activeStory.username;

//             // Filter stories that belong to this owner
//             const currentUserStories = stories.filter(
//               (s) => (s.userId ?? s.username) === ownerKey
//             );

//             if (currentUserStories.length > 1) {
//               return (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: -35,
//                     left: 0,
//                     width: "100%",
//                     display: "flex",
//                     gap: "4px",
//                     zIndex: 11
//                   }}
//                 >
//                   {currentUserStories.map((story, idx) => (
//                     <div
//                       key={story.id}
//                       style={{
//                         flex: 1,
//                         height: "4px",
//                         background: "rgba(255,255,255,0.3)",
//                         borderRadius: "10px",
//                         overflow: "hidden"
//                       }}
//                     >
//                       <div
//                         style={{
//                           height: "100%",
//                           width:
//                             story.id === activeStory.id
//                               ? `${progress}%`
//                               : currentUserStories.findIndex((s) => s.id === activeStory.id) > idx
//                                 ? "100%"
//                                 : "0%",
//                           background: "white",
//                           transition: "width 0.3s linear"
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               );
//             }

//             return null;
//           })()}

//           {/* Story Content */}
//           <div
//             className="story-content"
//             onMouseDown={() => setIsPaused(true)}
//             onMouseUp={() => setIsPaused(false)}
//             onTouchStart={() => setIsPaused(true)}
//             onTouchEnd={() => setIsPaused(false)}
//             style={{ width: "100%", height: "100%", position: "relative" }}
//           >
//             {isPaused && (
//               <div className="pause-overlay">
//                 <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
//                   <path d="M8 5h3v14H8zm5 0h3v14h-3z" />
//                 </svg>
//               </div>
//             )}

//             {/* Show pause/play overlay ONLY when paused AND it is video */}
//             {activeStory.fileType === "video" && isPaused && (
//               <div
//                 onClick={() => setIsPaused(false)}
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 20,
//                   cursor: "pointer",
//                   background: "rgba(0,0,0,0.4)",
//                   padding: "20px",
//                   borderRadius: "50%",
//                 }}
//               >
//                 <svg height="60" fill="#fff" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             )}

//             {/* ✅ DELETE BUTTON - Only show if story belongs to current user */}
//             {/* {activeStory.username === user?.username && (
//               <div
//                 className="fb-icon-btn"
//                 onClick={handleDeleteStory}
//                 style={{ cursor: "pointer" }}
//               >
//                 <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
//                 </svg>
//               </div>
//             )} */}

//             {/* VIDEO STORY */}
//             {activeStory.fileType === "video" && (
//               <video
//                 ref={videoRef}
//                 src={activeStory.storyMedia}
//                 autoPlay
//                 muted={!showspeaker}
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//             )}

//             {/* IMAGE STORY */}
//             {activeStory.fileType === "image" && (
//               <img
//                 src={activeStory.storyMedia}
//                 alt="Story"
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//             )}

//             {/* TEXT STORY */}
//             {activeStory.fileType === "text" && (
//               <div
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: activeStory.backgroundColor || "#0866FF",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: "10px",
//                   padding: "40px",
//                 }}
//               >
//                 <span
//                   style={{
//                     color: "white",
//                     fontSize: "32px",
//                     fontWeight: "600",
//                     textAlign: "center",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {activeStory.storyText}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Message Input */}
//           <div className="input-container">
//             <input
//               type="text"
//               placeholder="Send message..."
//               onChange={(e) => setPostText(e.target.value)}
//               value={postText}
//               style={{
//                 fontSize: "14px",
//                 width: "500.2px",
//                 height: "36px",
//                 borderRadius: "15px",
//                 border: "1px solid white",
//                 marginBottom: "20px",
//                 marginTop: "10px",
//                 padding: "0 12px",
//                 background: "transparent",
//                 color: "white",
//               }}
//             />
//             <div
//               className="smile_icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowEmojiOverlay(true);
//               }}
//             >
//               <Smile size={20} color="#ffffffff" />
//             </div>
//             <img src={sendIcon} alt="send_icon" className="send_icon" />
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           position: "fixed",
//           top: "10px",
//           right: "10px",
//           zIndex: 10000,
//         }}
//       >
//         <TopRightIcons />
//       </div>

//       {showEmojiOverlay && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.3)",
//             zIndex: 200000,
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "center",
//             paddingBottom: "65px",
//             marginLeft: "320px",
//           }}
//           onClick={() => setShowEmojiOverlay(false)}
//         >
//           <div
//             style={{ zIndex: 200001, marginBottom: "10px" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         </div>
//       )}

//       {/* Create story view show */}
//       {createStoryShow && (
//         <CreateStory
//           close={() => setCreateStoryShow(false)}
//           onCreateStory={handleShareStory}
//         />
//       )}
//     </div>
//   );
// }
// export default StoryView;



// import { useState, useRef, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./StoryView.css";
// import sendIcon from "../../assets/icons/send.png";
// import EmojiPicker from "emoji-picker-react";
// import { Smile } from "lucide-react";
// import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
// import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
// import CreateStory from "./CreateStory";
// import { useUser } from "../../context/UserProvider";
// import axios from "axios";

// function StoryView() {
//   const { storyId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useUser();
//   const menuRef = useRef(null);
//   const videoRef = useRef(null);

//   const API_BASE_URL = "http://localhost:8082/Org_Management_java/api";

//   // State
//   const [storyList, setStoryList] = useState([]);
//   const [activeStory, setActiveStory] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showplay, setShowPlay] = useState(false);
//   const [showspeaker, setShowSpeaker] = useState(true);
//   const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);
//   const [postText, setPostText] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [createStoryShow, setCreateStoryShow] = useState(false);

//   // Fetch stories on mount
//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/stories`);
//         const stories = response.data;
//         setStoryList(stories);

//         const story = stories.find(s => s.id === parseInt(storyId));
//         if (story) {
//           setActiveStory(story);
//         } else {
//           navigate("/HomePage/facebook");
//         }
//       } catch (error) {
//         console.error("Error fetching stories:", error);
//         navigate("/HomePage/facebook");
//       }
//     };

//     fetchStories();
//   }, [storyId, navigate]);

//   // Wait for data to load
//   if (!activeStory || storyList.length === 0) {
//     return (
//       <div style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "#000",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "white",
//         fontSize: "20px"
//       }}>
//         Loading...
//       </div>
//     );
//   }

//   const isStoryOwner = activeStory.userId === user?.id;
//   const activeIndex = storyList.findIndex((s) => s.id === activeStory.id);

//   const formatUploadTime = (uploadedAt) => {
//     if (!uploadedAt) return "Just now";
//     const now = new Date();
//     const uploadTime = new Date(uploadedAt);
//     const diffMs = now - uploadTime;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     else if (diffMins < 60) return `${diffMins}m`;
//     else if (diffHours < 24) return `${diffHours}h`;
//     else return `${diffDays}d`;
//   };

//   // Group stories by userId
//   const groupedStories = storyList.reduce((acc, story) => {
//     const userId = story.userId !== null ? story.userId : story.username;
//     if (!acc[userId]) {
//       acc[userId] = {
//         userId: userId,
//         username: story.username,
//         profilePic: story.profilePic,
//         stories: [],
//         latestTime: story.uploadedAt
//       };
//     }
//     acc[userId].stories.push(story);
//     if (new Date(story.uploadedAt) > new Date(acc[userId].latestTime)) {
//       acc[userId].latestTime = story.uploadedAt;
//     }
//     return acc;
//   }, {});

//   const groupedStoriesArray = Object.values(groupedStories).sort(
//     (a, b) => new Date(b.latestTime) - new Date(a.latestTime)
//   );

//   const close = () => {
//     navigate("/HomePage/facebook");
//   };

//   const handleDeleteStory = async () => {
//     if (!window.confirm("Are you sure you want to delete this story?")) return;

//     try {
//       await axios.delete(`${API_BASE_URL}/stories/${activeStory.id}`);
//       const updatedStories = storyList.filter((s) => s.id !== activeStory.id);
//       setStoryList(updatedStories);

//       if (updatedStories.length === 0) {
//         navigate("/HomePage/facebook");
//       } else {
//         const newActiveIndex = activeIndex >= updatedStories.length
//           ? updatedStories.length - 1
//           : activeIndex;
//         setActiveStory(updatedStories[newActiveIndex]);
//         navigate(`/HomePage/facebook/View_Story/${updatedStories[newActiveIndex].id}`, { replace: true });
//       }
//     } catch (error) {
//       console.error("Error deleting story:", error);
//       alert("Failed to delete story!");
//     }
//   };

//   const handleShareStory = () => {
//     navigate("/HomePage/facebook");
//   };

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;

//     const updateProgress = () => {
//       if (video && video.duration) {
//         const percent = (video.currentTime / video.duration) * 100;
//         setProgress(percent);
//       }
//     };

//     video.addEventListener("timeupdate", updateProgress);
//     return () => video.removeEventListener("timeupdate", updateProgress);
//   }, [activeStory]);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;

//     if (video.paused) {
//       video.play();
//       setShowPlay(false);
//     } else {
//       video.pause();
//       setShowPlay(true);
//     }
//   };

//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;
//     video.muted = !video.muted;
//     setShowSpeaker(!video.muted);
//   };

//   const nextStory = () => {
//     const currentUserStories = storyList.filter(s => s.userId === activeStory.userId);
//     const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

//     if (currentIndexInUserStories < currentUserStories.length - 1) {
//       const nextStoryData = currentUserStories[currentIndexInUserStories + 1];
//       setActiveStory(nextStoryData);
//       setProgress(0);
//       navigate(`/HomePage/facebook/View_Story/${nextStoryData.id}`, { replace: true });
//     } else {
//       const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
//       if (currentUserIndex < groupedStoriesArray.length - 1) {
//         const nextStoryData = groupedStoriesArray[currentUserIndex + 1].stories[0];
//         setActiveStory(nextStoryData);
//         setProgress(0);
//         navigate(`/HomePage/facebook/View_Story/${nextStoryData.id}`, { replace: true });
//       } else {
//         close();
//       }
//     }
//   };

//   const prevStory = () => {
//     const currentUserStories = storyList.filter(s => s.userId === activeStory.userId);
//     const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

//     if (currentIndexInUserStories > 0) {
//       const prevStoryData = currentUserStories[currentIndexInUserStories - 1];
//       setActiveStory(prevStoryData);
//       setProgress(0);
//       navigate(`/HomePage/facebook/View_Story/${prevStoryData.id}`, { replace: true });
//     } else {
//       const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
//       if (currentUserIndex > 0) {
//         const prevUserStories = groupedStoriesArray[currentUserIndex - 1].stories;
//         const prevStoryData = prevUserStories[prevUserStories.length - 1];
//         setActiveStory(prevStoryData);
//         setProgress(0);
//         navigate(`/HomePage/facebook/View_Story/${prevStoryData.id}`, { replace: true });
//       }
//     }
//   };

//   useEffect(() => {
//     setProgress(0);
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;

//     video.currentTime = 0;
//     const handleLoaded = () => {
//       video.play().catch(() => { });
//       setShowPlay(false);
//     };

//     video.addEventListener("loadeddata", handleLoaded);
//     video.addEventListener("ended", nextStory);

//     return () => {
//       video.removeEventListener("loadeddata", handleLoaded);
//       video.removeEventListener("ended", nextStory);
//     };
//   }, [activeStory]);

//   useEffect(() => {
//     if (activeStory.fileType === "text" || activeStory.fileType === "image") {
//       if (isPaused) return;

//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             nextStory();
//             return 0;
//           }
//           return prev + 1;
//         });
//       }, 100);

//       return () => clearInterval(interval);
//     }
//   }, [activeStory, activeIndex, isPaused]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || activeStory.fileType !== "video") return;

//     if (isPaused) {
//       video.pause();
//       setShowPlay(true);
//     } else {
//       video.play().catch(() => { });
//       setShowPlay(false);
//     }
//   }, [isPaused, activeStory]);

//   useEffect(() => {
//     setProgress(0);
//   }, [activeStory]);

//   const handleEmojiClick = (emojiObject) => {
//     const emoji = emojiObject.emoji || emojiObject.native || emojiObject;
//     setPostText((prev) => prev + emoji);
//     setShowEmojiOverlay(false);
//   };

//   const showCreateStory = () => {
//     setCreateStoryShow(true);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100vw",
//       height: "100vh",
//       backgroundColor: "#000",
//       display: "flex",
//       zIndex: 9999,
//     }}>
//       {/* Left Sidebar */}
//       <div style={{
//         backgroundColor: "#FFFFFF",
//         padding: "10px 16px",
//         width: "360px",
//         height: "100vh",
//         overflowY: "auto",
//       }}>
//         <div style={{
//           display: "flex",
//           alignItems: "center",
//           marginBottom: "20px",
//           gap: "10px",
//         }}>
//           <div className="fb-close-wrapper" onClick={close}>
//             <button className="fb-close-btn"></button>
//           </div>
//           <img
//             src="https://www.facebook.com/images/fb_icon_325x325.png"
//             alt="Facebook Logo"
//             style={{ height: "40px", marginRight: "14px" }}
//           />
//         </div>

//         <hr style={{
//           width: "100%",
//           border: "none",
//           height: "2px",
//           backgroundColor: "#CED0D4",
//         }} />

//         <h4 style={{ fontWeight: "bold" }}>Stories</h4>
//         <p style={{ color: "#0064D1", fontSize: "15px" }}>Archive · Settings</p>

//         <div>
//           <p style={{ fontSize: "17px", fontWeight: "600" }}>Your Story</p>
//           <div style={{
//             display: "flex",
//             justifyContent: "start",
//             alignItems: "center",
//             gap: "12px",
//             cursor: "pointer",
//           }} onClick={() => showCreateStory()}>
//             <div style={{
//               background: "#F0F2F5",
//               padding: "20px",
//               borderRadius: "50%",
//               width: "65px",
//               height: "65px",
//               cursor: "pointer",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}>
//               <span style={{ color: "#0064D1", fontSize: "24px" }}>+</span>
//             </div>
//             <div>
//               <span style={{ fontSize: "15px", fontWeight: "600" }}>
//                 Create a Story
//               </span>
//               <p style={{ fontSize: "13px" }}>
//                 Share a photo or write something
//               </p>
//             </div>
//           </div>
//         </div>

//         <div style={{ marginTop: "20px" }}>
//           <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
//           {groupedStoriesArray.map((userGroup) => (
//             <div
//               className="story-item"
//               onClick={() => {
//                 setActiveStory(userGroup.stories[0]);
//                 navigate(`/HomePage/facebook/View_Story/${userGroup.stories[0].id}`, { replace: true });
//               }}
//               style={{
//                 borderRadius: userGroup.stories.some(s => s.id === activeStory.id) ? "8px" : "0px",
//                 backgroundColor: userGroup.stories.some(s => s.id === activeStory.id)
//                   ? "#e8e9ebff"
//                   : "transparent",
//                 cursor: "pointer",
//                 position: "relative"
//               }}
//               key={userGroup.userId}
//             >
//               {/* Continue with rest of sidebar content... */}
//               {/* (Profile pic, story count badge, etc - keeping your existing JSX) */}

//               <div
//                 style={{
//                   padding: "3px",
//                   background: "#FFFFFF",
//                   borderRadius: "50%",
//                   border: "2px solid #0064D1",
//                   position: "relative"
//                 }}
//               >
//                 {/* Story count badge */}
//                 {userGroup.stories.length > 1 && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-5px",
//                       right: "-5px",
//                       background: "#0866FF",
//                       borderRadius: "50%",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "12px",
//                       fontWeight: "600",
//                       color: "white",
//                       border: "2px solid white",
//                       zIndex: 1
//                     }}
//                   >
//                     {userGroup.stories.length}
//                   </div>
//                 )}

//                 <div
//                   style={{
//                     width: "58.5px",
//                     height: "58.5px",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     background: "#F0F2F5",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <img
//                     src={userGroup.profilePic}
//                     alt="Story"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <span style={{ fontSize: "15px", fontWeight: "600" }}>
//                   {userGroup.username}
//                 </span>
//                 <p style={{ fontSize: "13px", color: "#65676B" }}>
//                   {formatUploadTime(userGroup.latestTime)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Story Content Area */}
//       {/* (Keep your existing story display JSX here) */}



//       {/* Story Content */}
//       <div
//         style={{
//           flex: 1,
//           backgroundColor: "#080809",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         <div style={{ width: "500px", height: "90vh", position: "relative" }}>
//           {/* Left Navigation button */}
//           {activeIndex > 0 && (
//             <button
//               onClick={prevStory}
//               style={{
//                 position: "absolute",
//                 left: "-60px",
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
//                   "translateY(-50%) scale(1.05) translateX(-4px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronLeft />
//             </button>
//           )}

//           {/* Right Navigation button */}
//           {activeIndex < stories.length - 1 && (
//             <button
//               onClick={nextStory}
//               style={{
//                 position: "absolute",
//                 right: "-60px",
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
//                   "translateY(-50%) scale(1.05) translateX(4px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "white";
//                 e.currentTarget.style.transform = "translateY(-50%) scale(1)";
//               }}
//             >
//               <ChevronRight />
//             </button>
//           )}

//           {/* Story Header */}
//           <div
//             style={{
//               position: "absolute",
//               top: "15px",
//               left: "15px",
//               right: "15px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: "5px",
//               color: "white",
//               zIndex: 10,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px",
//                 marginTop: "-27px",
//               }}
//             >
//               <img
//                 src={activeStory.profilePic}
//                 alt="profile"
//                 style={{
//                   width: "45px",
//                   height: "45px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />

//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "start",
//                   justifyContent: "start",
//                   marginLeft: "10px",
//                   gap: "5px",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "15px",
//                     fontWeight: "600",
//                     color: "white",
//                   }}
//                 >
//                   {activeStory.username}
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "13px",
//                     opacity: 0.8,
//                     color: "white",
//                     marginTop: "2px",
//                   }}
//                 >
//                   {formatUploadTime(activeStory.uploadedAt)}
//                 </span>
//               </div>

//               <svg
//                 viewBox="0 0 12 13"
//                 width="12"
//                 height="12"
//                 fill="white"
//                 style={{ cursor: "pointer", marginTop: "2px" }}
//               >
//                 <g fillRule="evenodd" transform="translate(-450 -1073)">
//                   <path d="M458.5 1078.5c-.827 0-1.5-.784-1.5-1.75 0-1.079.575-1.75 1.5-1.75s1.5.671 1.5 1.75c0 .966-.673 1.75-1.5 1.75m.838 1h-1.03a.3.3 0 0 0-.23.491 3.97 3.97 0 0 1 .922 2.544v.665a.3.3 0 0 0 .3.3h1.362c.737 0 1.338-.6 1.338-1.338a2.665 2.665 0 0 0-2.662-2.662m-2.616 5h-5.444a1.28 1.28 0 0 1-1.278-1.278v-.687a3.038 3.038 0 0 1 3.035-3.035h1.93a3.039 3.039 0 0 1 3.035 3.035v.687a1.28 1.28 0 0 1-1.278 1.278m-2.722-6c-1.103 0-2-1.01-2-2.25 0-1.388.767-2.25 2-2.25s2 .862 2 2.25c0 1.24-.897 2.25-2 2.25" />
//                 </g>
//               </svg>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 marginTop: "-27px",
//               }}
//             >
//               {/* Only show speaker for videos */}
//               {activeStory.fileType === "video" && (
//                 <div className="fb-icon-btn" onClick={toggleMute}>
//                   {showspeaker ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       width="26"
//                       height="26"
//                       fill="white"
//                     >
//                       <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zm12.7.05a1 1 0 1 0-1.414 1.414 5.008 5.008 0 0 1 0 7.072 1 1 0 1 0 1.414 1.414 7.009 7.009 0 0 0 0-9.9z" />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       width="28"
//                       height="28"
//                       fill="white"
//                     >
//                       <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zM21.707 9.293a1 1 0 0 0-1.414 0L19 10.586l-1.293-1.293a1 1 0 0 0-1.414 1.414L17.586 12l-1.293 1.293a1 1 0 1 0 1.414 1.414L19 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L20.414 12l1.293-1.293a1 1 0 0 0 0-1.414z" />
//                     </svg>
//                   )}
//                 </div>
//               )}

//               {/* Only show play/pause for videos */}
//               {activeStory.fileType === "video" && (
//                 <div className="fb-icon-btn" onClick={togglePlay}>
//                   {showplay ? (
//                     <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                   ) : (
//                     <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                       <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//                     </svg>
//                   )}
//                 </div>
//               )}

//               {/* Three dots */}

//               {/* <div className="fb-icon-btn">
//                 <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                   <circle cx="5" cy="12" r="2"></circle>
//                   <circle cx="12" cy="12" r="2"></circle>
//                   <circle cx="19" cy="12" r="2"></circle>
//                 </svg>
//               </div> */}

//               {isStoryOwner && (
//                 <div
//                   className="fb-icon-btn"
//                   onClick={() => setShowMenu(!showMenu)}
//                 >
//                   <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                     <circle cx="5" cy="12" r="2"></circle>
//                     <circle cx="12" cy="12" r="2"></circle>
//                     <circle cx="19" cy="12" r="2"></circle>
//                   </svg>
//                 </div>
//               )}

//               {showMenu && isStoryOwner && (
//                 <div
//                   ref={menuRef}
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "2px",
//                     background: "#fff",
//                     borderRadius: "8px",
//                     padding: "10px",
//                     boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//                     zIndex: 1000,
//                     width: "150px",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: 0,
//                       padding: "6px 8px",
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                       color: "red",
//                     }}
//                     onClick={handleDeleteStory}
//                   >
//                     Delete Story
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Progress Line */}
//           {/* <div
//             style={{
//               position: "absolute",
//               top: -30,
//               left: 0,
//               height: "4px",
//               width: "100%",
//               background: "rgba(255,255,255,0.3)",
//               borderRadius: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 height: "100%",
//                 width: `${progress}%`,
//                 background: "white",
//                 transition: "width 0.3s linear",
//               }}
//             ></div>
//           </div> */}

//           {/* Multiple story indicators - show only if user has more than 1 story */}
//           {(() => {
//             // Determine the "owner key": either userId or username
//             const ownerKey = activeStory.userId ?? activeStory.username;

//             // Filter stories that belong to this owner
//             const currentUserStories = stories.filter(
//               (s) => (s.userId ?? s.username) === ownerKey
//             );

//             if (currentUserStories.length > 1) {
//               return (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: -35,
//                     left: 0,
//                     width: "100%",
//                     display: "flex",
//                     gap: "4px",
//                     zIndex: 11
//                   }}
//                 >
//                   {currentUserStories.map((story, idx) => (
//                     <div
//                       key={story.id}
//                       style={{
//                         flex: 1,
//                         height: "4px",
//                         background: "rgba(255,255,255,0.3)",
//                         borderRadius: "10px",
//                         overflow: "hidden"
//                       }}
//                     >
//                       <div
//                         style={{
//                           height: "100%",
//                           width:
//                             story.id === activeStory.id
//                               ? `${progress}%`
//                               : currentUserStories.findIndex((s) => s.id === activeStory.id) > idx
//                                 ? "100%"
//                                 : "0%",
//                           background: "white",
//                           transition: "width 0.3s linear"
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               );
//             }

//             return null;
//           })()}

//           {/* Story Content */}
//           <div
//             className="story-content"
//             onMouseDown={() => setIsPaused(true)}
//             onMouseUp={() => setIsPaused(false)}
//             onTouchStart={() => setIsPaused(true)}
//             onTouchEnd={() => setIsPaused(false)}
//             style={{ width: "100%", height: "100%", position: "relative" }}
//           >
//             {isPaused && (
//               <div className="pause-overlay">
//                 <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
//                   <path d="M8 5h3v14H8zm5 0h3v14h-3z" />
//                 </svg>
//               </div>
//             )}

//             {/* Show pause/play overlay ONLY when paused AND it is video */}
//             {activeStory.fileType === "video" && isPaused && (
//               <div
//                 onClick={() => setIsPaused(false)}
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 20,
//                   cursor: "pointer",
//                   background: "rgba(0,0,0,0.4)",
//                   padding: "20px",
//                   borderRadius: "50%",
//                 }}
//               >
//                 <svg height="60" fill="#fff" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             )}

//             {/* ✅ DELETE BUTTON - Only show if story belongs to current user */}
//             {/* {activeStory.username === user?.username && (
//               <div
//                 className="fb-icon-btn"
//                 onClick={handleDeleteStory}
//                 style={{ cursor: "pointer" }}
//               >
//                 <svg height="30" fill="#fff" viewBox="0 0 24 24">
//                   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
//                 </svg>
//               </div>
//             )} */}

//             {/* VIDEO STORY */}
//             {activeStory.fileType === "video" && (
//               <video
//                 ref={videoRef}
//                 src={activeStory.storyMedia}
//                 autoPlay
//                 muted={!showspeaker}
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//             )}

//             {/* IMAGE STORY */}
//             {activeStory.fileType === "image" && (
//               <img
//                 src={activeStory.storyMedia}
//                 alt="Story"
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//             )}

//             {/* TEXT STORY */}
//             {activeStory.fileType === "text" && (
//               <div
//                 style={{
//                   marginTop: "-20px",
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: activeStory.backgroundColor || "#0866FF",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: "10px",
//                   padding: "40px",
//                 }}
//               >
//                 <span
//                   style={{
//                     color: "white",
//                     fontSize: "32px",
//                     fontWeight: "600",
//                     textAlign: "center",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {activeStory.storyText}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Message Input */}
//           <div className="input-container">
//             <input
//               type="text"
//               placeholder="Send message..."
//               onChange={(e) => setPostText(e.target.value)}
//               value={postText}
//               style={{
//                 fontSize: "14px",
//                 width: "500.2px",
//                 height: "36px",
//                 borderRadius: "15px",
//                 border: "1px solid white",
//                 marginBottom: "20px",
//                 marginTop: "10px",
//                 padding: "0 12px",
//                 background: "transparent",
//                 color: "white",
//               }}
//             />
//             <div
//               className="smile_icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowEmojiOverlay(true);
//               }}
//             >
//               <Smile size={20} color="#ffffffff" />
//             </div>
//             <img src={sendIcon} alt="send_icon" className="send_icon" />
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           position: "fixed",
//           top: "10px",
//           right: "10px",
//           zIndex: 10000,
//         }}
//       >
//         <TopRightIcons />
//       </div>

//       {showEmojiOverlay && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.3)",
//             zIndex: 200000,
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "center",
//             paddingBottom: "65px",
//             marginLeft: "320px",
//           }}
//           onClick={() => setShowEmojiOverlay(false)}
//         >
//           <div
//             style={{ zIndex: 200001, marginBottom: "10px" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         </div>
//       )}




//       {createStoryShow && (
//         <CreateStory
//           close={() => setCreateStoryShow(false)}
//           onCreateStory={handleShareStory}
//         />
//       )}
//     </div>
//   );
// }

// export default StoryView;


import { useState, useRef, useEffect } from "react";
import "./StoryView.css";
import sendIcon from "../../assets/icons/send.png";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import CreateStory from "./CreateStory";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";

function StoryView({ story, stories, close, onShareStory, onDeleteStory }) {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useUser();
  const menuRef = useRef(null);

  //change active story on click of story item from left sidebar
  const [activeStory, setActiveStory] = useState(story);

  //   const isStoryOwner = activeStory?.username === user?.username;
  const isStoryOwner = activeStory.userId === user?.id;


  console.log("activeStory:", activeStory);
  console.log("loggedInUser:", user);

  //play and pause state
  const [showplay, setShowPlay] = useState(false);

  //mute and unmute state
  const [showspeaker, setShowSpeaker] = useState(true);

  //useRef to control video playback
  const videoRef = useRef(null);

  //to show the emoji layer on top of the modal
  const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

  //post text state
  const [postText, setPostText] = useState("");

  //story progress state
  const [progress, setProgress] = useState(0);

  //find active index of the story
  const activeIndex = stories.findIndex((s) => s.id === activeStory.id);

  const [isPaused, setIsPaused] = useState(false);

  //show the create story
  const [createStoryShow, setCreateStoryShow] = useState(false);

  const navigate = useNavigate();

  // Add delete handler
  const handleDeleteStory = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8082/Org_Management_java/api/stories/${activeStory.id}`
      );

      // Call parent callback
      if (onDeleteStory) {
        onDeleteStory(activeStory.id);
      }

      const updatedStories = stories.filter((s) => s.id !== activeStory.id);

      if (updatedStories.length === 0) {
        close();
      } else {
        const newActiveIndex =
          activeIndex >= updatedStories.length
            ? updatedStories.length - 1
            : activeIndex;
        setActiveStory(updatedStories[newActiveIndex]);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story!");
    }
  };

  const handleShareStory = (storyData) => {
    // Call the parent handler (FbHome)
    if (onShareStory) {
      onShareStory(storyData);
    }

    // Close the modal
    close();

    // Redirect to home page
    navigate("/HomePage/facebook");
  };

  // Format time function
  const formatUploadTime = (uploadedAt) => {
    if (!uploadedAt) return "Just now";

    const now = new Date();
    const uploadTime = new Date(uploadedAt);
    const diffMs = now - uploadTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };

  // Group stories by userId
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.userId !== null ? story.userId : story.username;

    if (!acc[userId]) {
      acc[userId] = {
        userId: userId,
        username: story.username,
        profilePic: story.profilePic,
        stories: [],
        latestTime: story.uploadedAt
      };
    }
    acc[userId].stories.push(story);
    // Update latest time if this story is newer
    if (new Date(story.uploadedAt) > new Date(acc[userId].latestTime)) {
      acc[userId].latestTime = story.uploadedAt;
    }
    return acc;
  }, {});

  // Convert to array and sort by latest story time
  const groupedStoriesArray = Object.values(groupedStories).sort(
    (a, b) => new Date(b.latestTime) - new Date(a.latestTime)
  );



  useEffect(() => {
    const video = videoRef.current;

    // Only for video stories
    if (!video || activeStory.fileType !== "video") return;

    const updateProgress = () => {
      if (video && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);
      }
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [activeStory]);

  //handle play/pause toggle
  const togglePlay = () => {
    const video = videoRef.current;

    if (!video || activeStory.fileType !== "video") return;

    if (video.paused) {
      video.play();
      setShowPlay(false);
    } else {
      video.pause();
      setShowPlay(true);
    }
  };

  //handle mute/unmute toggle
  const toggleMute = () => {
    const video = videoRef.current;

    if (!video || activeStory.fileType !== "video") return;

    video.muted = !video.muted;
    setShowSpeaker(!video.muted);
  };

  // const nextStory = () => {
  //   if (activeIndex < stories.length - 1) {
  //     setActiveStory(stories[activeIndex + 1]);
  //     setProgress(0);
  //   } else {
  //     close();
  //   }
  // };

  // const prevStory = () => {
  //   if (activeIndex > 0) {
  //     setActiveStory(stories[activeIndex - 1]);
  //     setProgress(0);
  //   }
  // };

  const nextStory = () => {
    // Find current user's stories
    const currentUserStories = stories.filter(s => s.userId === activeStory.userId);
    const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

    // If there are more stories from this user
    if (currentIndexInUserStories < currentUserStories.length - 1) {
      setActiveStory(currentUserStories[currentIndexInUserStories + 1]);
      setProgress(0);
    } else {
      // Move to next user's first story
      const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
      if (currentUserIndex < groupedStoriesArray.length - 1) {
        setActiveStory(groupedStoriesArray[currentUserIndex + 1].stories[0]);
        setProgress(0);
      } else {
        close();
      }
    }
  };

  const prevStory = () => {
    // Find current user's stories
    const currentUserStories = stories.filter(s => s.userId === activeStory.userId);
    const currentIndexInUserStories = currentUserStories.findIndex(s => s.id === activeStory.id);

    // If there are previous stories from this user
    if (currentIndexInUserStories > 0) {
      setActiveStory(currentUserStories[currentIndexInUserStories - 1]);
      setProgress(0);
    } else {
      // Move to previous user's last story
      const currentUserIndex = groupedStoriesArray.findIndex(g => g.userId === activeStory.userId);
      if (currentUserIndex > 0) {
        const prevUserStories = groupedStoriesArray[currentUserIndex - 1].stories;
        setActiveStory(prevUserStories[prevUserStories.length - 1]);
        setProgress(0);
      }
    }
  };

  //dont play video until metadata is loaded
  useEffect(() => {
    setProgress(0);
    const video = videoRef.current;

    // Only for video stories
    if (!video || activeStory.fileType !== "video") return;

    video.currentTime = 0;

    const handleLoaded = () => {
      video.play().catch(() => { });
      setShowPlay(false);
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("ended", nextStory);

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("ended", nextStory);
    };
  }, [activeStory]);

  // Auto progress ONLY when not paused AND only for text/image
  useEffect(() => {
    if (activeStory.fileType === "text" || activeStory.fileType === "image") {
      if (isPaused) return; //  Pause when user holds mouse / UI pause

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 1; // Progress speed (adjust if needed)
        });
      }, 100); // 100ms → smooth bar

      return () => clearInterval(interval);
    }
  }, [activeStory, activeIndex, isPaused]);

  // Pause / Play when user holds the mouse or UI pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || activeStory.fileType !== "video") return;

    if (isPaused) {
      video.pause();
      setShowPlay(true); // show play icon UI
    } else {
      video.play().catch(() => { });
      setShowPlay(false); // hide play icon UI
    }
  }, [isPaused, activeStory]);

  useEffect(() => {
    setProgress(0);
  }, [activeStory]);

  //handle the emoji
  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji || emojiObject.native || emojiObject;
    setPostText((prev) => prev + emoji);
    setShowEmojiOverlay(false);
  };

  //show create story
  const showCreateStory = () => {
    setCreateStoryShow(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        zIndex: 9999,
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          width: "360px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <div className="fb-close-wrapper" onClick={close}>
            <button className="fb-close-btn"></button>
          </div>

          <img
            src="https://www.facebook.com/images/fb_icon_325x325.png"
            alt="Facebook Logo"
            style={{ height: "40px", marginRight: "14px" }}
          />
        </div>

        {/* HR Line */}
        <hr
          style={{
            width: "100%",
            border: "none",
            height: "2px",
            backgroundColor: "#CED0D4",
          }}
        />

        <h4 style={{ fontWeight: "bold" }}>Stories</h4>
        <p style={{ color: "#0064D1", fontSize: "15px" }}>Archive · Settings</p>

        <div>
          <p style={{ fontSize: "17px", fontWeight: "600" }}>Your Story</p>

          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
            onClick={() => showCreateStory()}
          >
            <div
              style={{
                background: "#F0F2F5",
                padding: "20px",
                borderRadius: "50%",
                width: "65px",
                height: "65px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#0064D1", fontSize: "24px" }}>+</span>
            </div>

            <div>
              <span style={{ fontSize: "15px", fontWeight: "600" }}>
                Create a Story
              </span>
              <p style={{ fontSize: "13px" }}>
                Share a photo or write something
              </p>
            </div>
          </div>
        </div>



        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
          {groupedStoriesArray.map((userGroup) => (
            <div
              className="story-item"
              onClick={() => setActiveStory(userGroup.stories[0])} // Show first story of this user
              style={{
                borderRadius: userGroup.stories.some(s => s.id === activeStory.id) ? "8px" : "0px",
                backgroundColor: userGroup.stories.some(s => s.id === activeStory.id)
                  ? "#e8e9ebff"
                  : "transparent",
                cursor: "pointer",
                position: "relative"
              }}
              key={userGroup.userId}
            >
              <div
                style={{
                  padding: "3px",
                  background: "#FFFFFF",
                  borderRadius: "50%",
                  border: "2px solid #0064D1",
                  position: "relative"
                }}
              >
                {/* Story count badge */}
                {userGroup.stories.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "#0866FF",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "white",
                      border: "2px solid white",
                      zIndex: 1
                    }}
                  >
                    {userGroup.stories.length}
                  </div>
                )}

                <div
                  style={{
                    width: "58.5px",
                    height: "58.5px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#F0F2F5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={userGroup.profilePic}
                    alt="Story"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>

              <div>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  {userGroup.username}
                </span>
                <p style={{ fontSize: "13px", color: "#65676B" }}>
                  {formatUploadTime(userGroup.latestTime)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
          {stories.map((storyItem) => (
            <div
              className="story-item"
              onClick={() => setActiveStory(storyItem)}
              style={{
                borderRadius: activeStory.id === storyItem.id ? "8px" : "0px",
                backgroundColor:
                  activeStory.id === storyItem.id ? "#e8e9ebff" : "transparent",
                cursor: "pointer",
              }}
              key={storyItem.id}
            >
              <div
                style={{
                  padding: "3px",
                  background: "#FFFFFF",
                  borderRadius: "50%",
                  border: "2px solid #0064D1",
                }}
              >
                <div
                  style={{
                    width: "58.5px",
                    height: "58.5px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#F0F2F5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={storyItem.profilePic}
                    alt="Story"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>

              <div>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  {storyItem.username}
                </span>
                <p style={{ fontSize: "13px", color: "#65676B" }}>
                  {formatUploadTime(storyItem.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Story Content */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#080809",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{ width: "500px", height: "90vh", position: "relative" }}>
          {/* Left Navigation button */}
          {activeIndex > 0 && (
            <button
              onClick={prevStory}
              style={{
                position: "absolute",
                left: "-60px",
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
                  "translateY(-50%) scale(1.05) translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <ChevronLeft />
            </button>
          )}

          {/* Right Navigation button */}
          {activeIndex < stories.length - 1 && (
            <button
              onClick={nextStory}
              style={{
                position: "absolute",
                right: "-60px",
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
                  "translateY(-50%) scale(1.05) translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <ChevronRight />
            </button>
          )}

          {/* Story Header */}
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              right: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "5px",
              color: "white",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "-27px",
              }}
            >
              <img
                src={activeStory.profilePic}
                alt="profile"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "start",
                  marginLeft: "10px",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {activeStory.username}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    color: "white",
                    marginTop: "2px",
                  }}
                >
                  {formatUploadTime(activeStory.uploadedAt)}
                </span>
              </div>

              <svg
                viewBox="0 0 12 13"
                width="12"
                height="12"
                fill="white"
                style={{ cursor: "pointer", marginTop: "2px" }}
              >
                <g fillRule="evenodd" transform="translate(-450 -1073)">
                  <path d="M458.5 1078.5c-.827 0-1.5-.784-1.5-1.75 0-1.079.575-1.75 1.5-1.75s1.5.671 1.5 1.75c0 .966-.673 1.75-1.5 1.75m.838 1h-1.03a.3.3 0 0 0-.23.491 3.97 3.97 0 0 1 .922 2.544v.665a.3.3 0 0 0 .3.3h1.362c.737 0 1.338-.6 1.338-1.338a2.665 2.665 0 0 0-2.662-2.662m-2.616 5h-5.444a1.28 1.28 0 0 1-1.278-1.278v-.687a3.038 3.038 0 0 1 3.035-3.035h1.93a3.039 3.039 0 0 1 3.035 3.035v.687a1.28 1.28 0 0 1-1.278 1.278m-2.722-6c-1.103 0-2-1.01-2-2.25 0-1.388.767-2.25 2-2.25s2 .862 2 2.25c0 1.24-.897 2.25-2 2.25" />
                </g>
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "-27px",
              }}
            >
              {/* Only show speaker for videos */}
              {activeStory.fileType === "video" && (
                <div className="fb-icon-btn" onClick={toggleMute}>
                  {showspeaker ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="26"
                      height="26"
                      fill="white"
                    >
                      <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zm12.7.05a1 1 0 1 0-1.414 1.414 5.008 5.008 0 0 1 0 7.072 1 1 0 1 0 1.414 1.414 7.009 7.009 0 0 0 0-9.9z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="28"
                      height="28"
                      fill="white"
                    >
                      <path d="M13.16 2.124a1.449 1.449 0 0 0-1.563.26l-4.346 4.1a.8.8 0 0 0-.251.58v9.921a.8.8 0 0 0 .255.585l4.35 4.054a1.438 1.438 0 0 0 .97.375 1.466 1.466 0 0 0 .585-.123A1.382 1.382 0 0 0 14 20.6V3.4a1.382 1.382 0 0 0-.84-1.276zM4.25 7A2.25 2.25 0 0 0 2 9.25v5.5A2.25 2.25 0 0 0 4.25 17h.35a.4.4 0 0 0 .4-.4V7.4a.4.4 0 0 0-.4-.4zM21.707 9.293a1 1 0 0 0-1.414 0L19 10.586l-1.293-1.293a1 1 0 0 0-1.414 1.414L17.586 12l-1.293 1.293a1 1 0 1 0 1.414 1.414L19 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L20.414 12l1.293-1.293a1 1 0 0 0 0-1.414z" />
                    </svg>
                  )}
                </div>
              )}

              {/* Only show play/pause for videos */}
              {activeStory.fileType === "video" && (
                <div className="fb-icon-btn" onClick={togglePlay}>
                  {showplay ? (
                    <svg height="30" fill="#fff" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg height="30" fill="#fff" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </div>
              )}

              {/* Three dots */}

              {/* <div className="fb-icon-btn">
                <svg height="30" fill="#fff" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="19" cy="12" r="2"></circle>
                </svg>
              </div> */}

              {isStoryOwner && (
                <div
                  className="fb-icon-btn"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <svg height="30" fill="#fff" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="19" cy="12" r="2"></circle>
                  </svg>
                </div>
              )}

              {showMenu && isStoryOwner && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "2px",
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                    width: "150px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      padding: "6px 8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "red",
                    }}
                    onClick={handleDeleteStory}
                  >
                    Delete Story
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Line */}
          {/* <div
            style={{
              position: "absolute",
              top: -30,
              left: 0,
              height: "4px",
              width: "100%",
              background: "rgba(255,255,255,0.3)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "white",
                transition: "width 0.3s linear",
              }}
            ></div>
          </div> */}

          {/* Multiple story indicators - show only if user has more than 1 story */}
          {(() => {
            // Determine the "owner key": either userId or username
            const ownerKey = activeStory.userId ?? activeStory.username;

            // Filter stories that belong to this owner
            const currentUserStories = stories.filter(
              (s) => (s.userId ?? s.username) === ownerKey
            );

            if (currentUserStories.length > 1) {
              return (
                <div
                  style={{
                    position: "absolute",
                    top: -35,
                    left: 0,
                    width: "100%",
                    display: "flex",
                    gap: "4px",
                    zIndex: 11
                  }}
                >
                  {currentUserStories.map((story, idx) => (
                    <div
                      key={story.id}
                      style={{
                        flex: 1,
                        height: "4px",
                        background: "rgba(255,255,255,0.3)",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width:
                            story.id === activeStory.id
                              ? `${progress}%`
                              : currentUserStories.findIndex((s) => s.id === activeStory.id) > idx
                                ? "100%"
                                : "0%",
                          background: "white",
                          transition: "width 0.3s linear"
                        }}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })()}

          {/* Story Content */}
          <div
            className="story-content"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            {isPaused && (
              <div className="pause-overlay">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5h3v14H8zm5 0h3v14h-3z" />
                </svg>
              </div>
            )}

            {/* Show pause/play overlay ONLY when paused AND it is video */}
            {activeStory.fileType === "video" && isPaused && (
              <div
                onClick={() => setIsPaused(false)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  cursor: "pointer",
                  background: "rgba(0,0,0,0.4)",
                  padding: "20px",
                  borderRadius: "50%",
                }}
              >
                <svg height="60" fill="#fff" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* ✅ DELETE BUTTON - Only show if story belongs to current user */}
            {/* {activeStory.username === user?.username && (
              <div
                className="fb-icon-btn"
                onClick={handleDeleteStory}
                style={{ cursor: "pointer" }}
              >
                <svg height="30" fill="#fff" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </div>
            )} */}

            {/* VIDEO STORY */}
            {activeStory.fileType === "video" && (
              <video
                ref={videoRef}
                src={activeStory.storyMedia}
                autoPlay
                muted={!showspeaker}
                style={{
                  marginTop: "-20px",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            {/* IMAGE STORY */}
            {activeStory.fileType === "image" && (
              <img
                src={activeStory.storyMedia}
                alt="Story"
                style={{
                  marginTop: "-20px",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            {/* TEXT STORY */}
            {activeStory.fileType === "text" && (
              <div
                style={{
                  marginTop: "-20px",
                  width: "100%",
                  height: "100%",
                  backgroundColor: activeStory.backgroundColor || "#0866FF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  padding: "40px",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "600",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {activeStory.storyText}
                </span>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Send message..."
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
              style={{
                fontSize: "14px",
                width: "500.2px",
                height: "36px",
                borderRadius: "15px",
                border: "1px solid white",
                marginBottom: "20px",
                marginTop: "10px",
                padding: "0 12px",
                background: "transparent",
                color: "white",
              }}
            />
            <div
              className="smile_icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiOverlay(true);
              }}
            >
              <Smile size={20} color="#ffffffff" />
            </div>
            <img src={sendIcon} alt="send_icon" className="send_icon" />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 10000,
        }}
      >
        <TopRightIcons />
      </div>

      {showEmojiOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 200000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "65px",
            marginLeft: "320px",
          }}
          onClick={() => setShowEmojiOverlay(false)}
        >
          <div
            style={{ zIndex: 200001, marginBottom: "10px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}

      {/* Create story view show */}
      {createStoryShow && (
        <CreateStory
          close={() => setCreateStoryShow(false)}
          onCreateStory={handleShareStory}
        />
      )}
    </div>
  );
}
export default StoryView;
