import React, { useEffect, useRef, useState } from 'react'
import FbTopBar from './FbTopBar'
import { Form, Modal } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { ChevronLeft, ChevronRight, Search } from 'react-bootstrap-icons';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleMinus, Video, CirclePlus } from 'lucide-react';
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import plus_icon3 from "../../assets/icons/plus_icon3.png";
import { Plus } from 'lucide-react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, X, Globe } from 'lucide-react';
import posts from './postData.json';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "./FbHome.css"
import ShareButton from './ShareButton';
import CreatePostModal from "./CreatePostModal"
import CommentModal from "./CommentModal"
import StoryContainer from './StoryContainer';

function FbHome() {
    const [postList, setPostList] = useState(posts);

    //use state to show the modal when clicking comment button
    const [selectedPost, setSelectedPost] = useState(null);

    const [modalShow, setModalShow] = useState(false);

    //handle each comment
    const [commentText, setCommentText] = useState({});
    const [openMenuPostId, setOpenMenuPostId] = useState(null);

    //show the create post modal
    const [createModalShow, setCreateModalShow] = useState(false);

    //handle share button
    const [shareModalShow, setShareModalShow] = useState(false);

    const handleLike = (id) => {
        setPostList(prevPosts => {
            const updated = prevPosts.map(post =>
                post.id === id
                    ? {
                        ...post,
                        liked: !post.liked,
                        likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1
                    }
                    : post
            );

            //Updating modal post (like button)
            if (selectedPost && selectedPost.id === id) {
                const newSelected = updated.find(p => p.id === id);
                setSelectedPost(newSelected);
            }

            return updated;
        });
    };



    const handleComment = (post) => {
        setSelectedPost(post);
        setModalShow(true);
    };

    const handleAddComment = (postId) => {
        if (!commentText[postId] || commentText[postId].trim() === "") return;

        setPostList(prevPosts => {
            const updatedPosts = prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        commentList: [
                            ...post.commentList,
                            {
                                id: Date.now(),
                                user: "You",
                                text: commentText[postId]
                            }
                        ],
                        comments: post.comments + 1
                    }
                    : post
            );

            // Update modal immediately
            if (selectedPost?.id === postId) {
                setSelectedPost(updatedPosts.find(p => p.id === postId));
            }

            return updatedPosts;
        });

        // Clear textbox
        setCommentText(prev => ({ ...prev, [postId]: "" }));
    };

    //handle the share button
    const handleShare = (post) => {
        setSelectedPost(post);
        setShareModalShow(true);
    }


    // delete the particular post 
    const handleDeletePost = (postId) => {
        setPostList(prev => prev.filter(post => post.id !== postId));
    };

    //interested and not interested
    const handleNotInterested = (postId) => {
        setPostList(prev =>
            prev.map(post =>
                post.id === postId ? { ...post, isHidden: true } : post
            )
        );

        // closing the menu
        setOpenMenuPostId(null);
    };

    const handleNotInterestedUndo = (postId) => {
        setPostList(prev =>
            prev.map(post =>
                post.id === postId ? { ...post, isHidden: false } : post
            )
        );

        // closing the menu
        setOpenMenuPostId(null);
    };

    const handleInterested = () => {
        setOpenMenuPostId(null);
    };



   



    // handle create post
    const handleCreatePost = () => {
        setCreateModalShow(true);
    }

    const handleAddNewPost = (newPostData) => {
        // Create new post object matching your JSON structure
        const newPost = {
            id: Date.now().toString(), // Unique ID using timestamp
            profilePic: fb_profile, // Your profile pic
            username: "Peter", // Your username
            content: newPostData.text,
            postImage: newPostData.imageUrl, // The image/video preview URL
            fileType: newPostData.fileType,
            backgroundStyle: newPostData.backgroundStyle,
            shares: 0,
            liked: false,
            likeCount: 0,
            commentList: [],
            isHidden: false
        };

        console.log("New Post Created:", newPost);
        console.log("Background Style:", newPost.backgroundStyle);

        // Add new post to the TOP of the list
        setPostList(prevPosts => [newPost, ...prevPosts]);
    };


    console.log("unique id:" + Date.now().toString());

    return (
        <div>
            <FbTopBar />

            <div
                style={{
                    padding: "20px",
                    // backgroundColor: "#d65858ff",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "0px",
                    gap: "20px",
                }}>

                <div style={{
                    backgroundColor: "#ffffffff",
                    width: "680px",
                    height: "62px",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px"
                }}>

                    <img src={fb_profile} alt="fb_profile" height={40} width={40} style={{ borderRadius: "50%" }} />

                    <input
                        onClick={() => handleCreatePost()}
                        type="text"
                        placeholder='Whats on your mind,Kirubha?'
                        style={{
                            borderRadius: "27px",
                            background: "#F0F2F5",
                            width: "472px",
                            height: "40px",
                            color: "#65686C",
                            fontSize: "17px",
                            padding: "8px 12px",
                            fontFamily: "Segoe UI Historic",
                            border: "none"
                        }}
                    />

                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png" alt="live video icon" />
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png" alt="video image icon" />
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/Y4mYLVOhTwq.png" alt="smile image" />
                </div>

                <StoryContainer/>

                {/* post containers */}
                {postList.map((post) => {
                    return (
                        <div key={post.id} style={{ marginBottom: "15px" }}>


                            {/* Hidden post */}
                            {post.isHidden ? (
                                <div style={{
                                    width: '680px',
                                    backgroundColor: '#ffffffff',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    color: '#080809',
                                    border: "1px solid #ddd"
                                }}>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <strong>Post hidden</strong>
                                        <button style={{ padding: "6px 16px", color: "#080809", backgroundColor: "#E2E5E9", borderRadius: "5px", fontFamily: "Segoe UI Historic", fontWeight: "600" }} onClick={() => handleNotInterestedUndo(post.id)}>Undo</button>
                                    </div>

                                    <p>You won’t see posts like this anymore.</p>
                                </div>
                            ) : (
                                <div style={{
                                    width: '680px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden'
                                }}>
                                    {/* Post Header */}
                                    <div style={{
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {/* Profile Picture */}
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                <img src={post.profilePic} alt="profilePic" style={{ borderRadius: "50%" }} />
                                            </div>

                                            {/* Page Info */}
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <span style={{
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        color: '#050505'
                                                    }}>
                                                        {post.username}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#0866FF',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}>
                                                        · Follow
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '13px',
                                                    color: '#65676b'
                                                }}>
                                                    <span>4d</span>
                                                    <span>·</span>
                                                    <Globe size={12} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                                onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)} //same post click it will be closed
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <MoreHorizontal size={20} color="#65676b" />
                                            </div>

                                            {/* open the three dots */}
                                            {openMenuPostId === post.id && (
                                                <div style={{
                                                    position: "absolute",
                                                    left: "950px",
                                                    right: "0px",
                                                    marginTop: "50px",
                                                    width: "300px",
                                                    background: "white",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                    borderRadius: "8px",
                                                    zIndex: 999,
                                                    padding: "8px"
                                                }}>
                                                    <div style={{ padding: "10px", cursor: "pointer" }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
                                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                        onClick={handleInterested}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <CirclePlus /> <span style={{ fontWeight: "600" }}>  Interested</span> <br />
                                                        </div>
                                                        <span>More of your posts will be like this</span>
                                                    </div>

                                                    <div style={{ padding: "10px", cursor: "pointer" }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
                                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                        onClick={() => handleNotInterested(post.id)}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <CircleMinus />  <span style={{ fontWeight: "600" }}> Not Interested</span>
                                                        </div>

                                                        <span>Fewer of your posts will be like this </span></div>
                                                </div>
                                            )}
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <X size={20} color="#65676b" onClick={() => handleDeletePost(post.id)} />
                                            </div>


                                        </div>

                                    </div>

                                    {/* Post Content */}
                                    {/* <div style={{
                                        padding: '0 16px 8px 16px',
                                        fontSize: '16px',
                                        lineHeight: '1.3333'
                                    }}>
                                        {post.content}
                                    </div> */}

                                    {/* Post Content */}
                                    {(() => {
                                        console.log("Rendering post:", post.id, "Background:", post.backgroundStyle); // ✅ ADD THIS
                                        return post.backgroundStyle ? (
                                            // If there's a background style, show styled content
                                            <div style={{
                                                padding: '0 16px 8px 16px'
                                            }}>
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '300px',
                                                        background: post.backgroundStyle,
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '20px',
                                                        marginTop: '8px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '32px',
                                                            fontWeight: '700',
                                                            textAlign: 'center',
                                                            color: 'white',
                                                            wordBreak: 'break-word'
                                                        }}
                                                    >
                                                        {post.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Normal text without background
                                            <div style={{
                                                padding: '0 16px 8px 16px',
                                                fontSize: '16px',
                                                lineHeight: '1.3333'
                                            }}>
                                                {post.content}
                                            </div>
                                        )
                                   })()}



                                    {/* Post Image */}
                                    {!post.backgroundStyle && post.postImage && (
                                        <div style={{
                                            width: '100%',
                                            backgroundColor: '#000000',
                                            position: 'relative'
                                        }}>
                                            {post.fileType === "video" ? (
                                                <video
                                                    src={post.postImage}
                                                    controls
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: "500px",
                                                        display: 'block'
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={post.postImage}
                                                    alt="Post content"
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: '500px',
                                                        display: 'block'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}


                                    {/* Engagement Stats */}
                                    <div style={{
                                        padding: '12px 16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #e4e6eb'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer'
                                        }}>
                                            {/* Like Icon */}
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0866FF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <ThumbsUp size={11} color="#ffffff" fill="#ffffff" />
                                            </div>
                                            <span style={{
                                                fontSize: '15px',
                                                color: '#65676b'
                                            }}>
                                                {post.likeCount}
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '16px',
                                            fontSize: '15px',
                                            color: '#65676b'
                                        }}>
                                            <span style={{ cursor: 'pointer' }}>{post.commentList.length} comments</span>
                                            <span style={{ cursor: 'pointer' }}>{post.shares} shares</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{
                                        padding: '4px 16px',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        gap: '8px'
                                    }}>
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: post.liked ? '#0866FF' : '#65676b',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <ThumbsUp
                                                size={20}
                                                color={post.liked ? '#0866FF' : '#65676b'}
                                                fill={post.liked ? '#0866FF' : 'none'}
                                            />
                                            <span>Like</span>
                                        </button>


                                        {/* Comment Button */}
                                        <button
                                            onClick={() => handleComment(post)}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: '#65676b',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <MessageCircle size={20} />
                                            <span>Comment</span>

                                        </button>

                                        {/* Share Button */}
                                        <button
                                            onClick={() => handleShare(post)}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: '#65676b',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
            />

            <ShareButton
                show={shareModalShow}
                onHide={() => setShareModalShow(false)}
                post={selectedPost}
            />

        </div>

    )
}

export default FbHome;