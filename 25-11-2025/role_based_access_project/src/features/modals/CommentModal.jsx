import React, { useEffect, useRef, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, X, Globe } from 'lucide-react';
import "../../Pages/facebook_clone/FbHome.css"

// modal for comment
function CommentModal({
    post,
    handleLike,
    commentText,
    setCommentText,
    handleAddComment,
    handleShare,
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
                <InputGroup style={{ flex: 1, height: "70px" }}>
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

export default CommentModal
