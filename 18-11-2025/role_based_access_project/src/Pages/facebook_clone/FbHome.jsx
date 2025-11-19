import React, { useState } from 'react'
import FbTopBar from './FbTopBar'
import { Form, Modal } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { Search } from 'react-bootstrap-icons';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Video } from 'lucide-react';
import fb_profile from "../../assets/icons/fb_profile.jpg";
import plus_icon3 from "../../assets/icons/plus_icon3.png";
import { Plus } from 'lucide-react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, X, Globe } from 'lucide-react';
import posts from './postData.json';
import storys from './storyData.json';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';



function MyVerticallyCenteredModal({
    post,
    handleLike,
    commentText,
    setCommentText,
    handleAddComment,
    ...props
}) {

    if (!post) return null;

    return (
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {post.username}'s Post
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{
                height: "700px",
                overflowY: "auto"
            }}>
                {/* Post Content */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={post.profilePic} alt="profile pic"
                        style={{ width: 50, height: 50, borderRadius: "50%" }} />
                    <div>
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
                        <p style={{ margin: 0, color: "gray" }}>4d · Public</p>

                    </div>
                </div>

                <p style={{ marginTop: "15px" }}>{post.content}</p>

                {post.postImage && (
                    <img src={post.postImage} style={{ width: "100%", borderRadius: "8px" }} />
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
                        <span style={{ cursor: 'pointer' }}>{post.comments}K comments</span>
                        <span style={{ cursor: 'pointer' }}>{post.shares}K shares</span>
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
                        // onClick={() => handleComment(post)}
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

                {/* Comments List */}
                <div style={{ padding: "0 16px 16px 16px" }}>
                    {post.commentList.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                marginTop: "12px"
                            }}
                        >
                            <img
                                src={fb_profile}
                                style={{ width: 32, height: 32, borderRadius: "50%" }}
                            />

                            <div
                                style={{
                                    background: "#f0f2f5",
                                    padding: "10px 14px",
                                    borderRadius: "18px",
                                    fontSize: "15px"
                                }}
                            >
                                <strong>{comment.user}</strong>
                                <div>{comment.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </Modal.Body>

            <Modal.Footer style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                {/* Profile Picture */}
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0
                    }}
                >
                    <img
                        src={fb_profile}
                        alt="profilePic"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                {/* Comment Input */}
                <InputGroup style={{ flex: 1,height:"70px" }}>
                    <Form.Control
                        type="text"
                        placeholder="Write a comment…"
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                            setCommentText({ ...commentText, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
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




function FbHome() {
    const [postList, setPostList] = useState(posts);

    //use state to show the modal when clicking comment button
    const [selectedPost, setSelectedPost] = useState(null);

    const [modalShow, setModalShow] = useState(false);

    //handle each comment
    const [commentText, setCommentText] = useState({});


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
                    {/* <AccountCircleIcon
                        style={{
                            fontSize: "45px",
                            color: "#353535ff",
                        }}
                    /> */}

                    <img src={fb_profile} alt="fb_profile" height={40} width={40} style={{borderRadius:"50%"}} />

                    <input
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

                {/* Stories container */}
                <div style={{
                    backgroundColor: "#ffffff",
                    width: "680px",
                    padding: "16px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "row", //horizontal layout
                    gap: "8px",
                    overflowX: "auto", // Enable horizontal scrolling
                    alignItems: "center",
                }}>

                    {/* Create Story Card */}
                    <div style={{
                        width: "112.5px", // Use minWidth instead of width for scrolling
                        height: "200px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        position: "relative",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        overflow: "visible",
                        flexShrink: 0 // Prevent shrinking
                    }}>
                        {/* Profile Image Container */}
                        <div style={{
                            width: "100%",
                            height: "140px",
                            position: "relative",
                            overflow: "hidden",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px"
                        }}>
                            <img
                                src={fb_profile}
                                alt="fb_Profile"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </div>

                        {/* Plus Button */}
                        <div style={{
                            position: 'absolute',
                            top: '120px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#0866FF',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '4px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            <Plus size={24} color="#ffffff" strokeWidth={3} />
                        </div>

                        {/* Text Label */}
                        <div style={{
                            padding: "30px 8px 12px 8px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "60px"
                        }}>
                            <span style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#050505"
                            }}>
                                Create Story
                            </span>
                        </div>
                    </div>

                    {/* Story Card from the json */}
                    {storys.map((story) => (
                        <div style={{
                            width: "112.5px",
                            height: "200px",
                            background: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                            flexShrink: 0
                        }}>


                            <video
                                src={story.storyVid}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                                autoPlay
                                muted
                                loop
                            />

                            {/* Profile Picture Ring */}
                            <div style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: "3px solid #0866FF",
                                overflow: "hidden",
                                backgroundColor: "#ffffff"
                            }}>
                                <img
                                    src={story.profilePic}
                                    alt="Story"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            </div>
                            {/* Name */}
                            <div style={{
                                position: "absolute",
                                bottom: "8px",
                                left: "8px",
                                right: "8px"
                            }}>
                                <span style={{
                                    color: "#ffffff",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)"
                                }}>
                                    {story.username}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>





                {/* post containers */}
                {postList.map((post) => (
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
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <MoreHorizontal size={20} color="#65676b" />
                                </div>
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
                                    <X size={20} color="#65676b" />
                                </div>
                            </div>

                        </div>

                        {/* Post Content */}
                        <div style={{
                            padding: '0 16px 8px 16px',
                            fontSize: '16px',
                            lineHeight: '1.3333'
                        }}>
                            {post.content}
                        </div>

                        {/* Post Image */}
                        <div style={{
                            width: '100%',
                            backgroundColor: '#000000',
                            position: 'relative'
                        }}>
                            <img
                                src={post.postImage}
                                alt="Post content"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                            {/* You can add text overlay here if needed */}
                        </div>

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
                                <span style={{ cursor: 'pointer' }}>{post.comments}K comments</span>
                                <span style={{ cursor: 'pointer' }}>{post.shares}K shares</span>
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
                ))}

            </div>




            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                post={selectedPost}
                handleLike={handleLike}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
            />


        </div>

    )
}

export default FbHome;