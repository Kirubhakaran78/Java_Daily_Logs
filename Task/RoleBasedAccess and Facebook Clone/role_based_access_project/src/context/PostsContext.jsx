import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserProvider';
import { config } from "../services/api";

const PostsContext = createContext();

export const usePostsContext = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
    const { user } = useUser();
    const [postList, setPostList] = useState([]);
    const API_BASE_URL = `http://localhost:${config.BASE_URL}/Org_Management_java/api`;

    const formatUploadTime = (createdAt) => {
        if (!createdAt) return "Just now";

        const now = new Date();
        const uploadTime = new Date(createdAt);
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

    // EXTRACT fetchPosts as a separate function so we can call it
    // const fetchPosts = async () => {
    //     if (!user?.id) return;

    //     try {
    //         const postsResponse = await axios.get(`${API_BASE_URL}/posts`, {
    //             params: { userId: user?.id },
    //         });

    //         const fixedPosts = postsResponse.data.map(p => ({
    //             ...p,
    //             // FIX: Clean up "null" strings - ADD THESE 3 LINES
    //             backgroundStyle: (p.backgroundStyle === "null" || p.backgroundStyle === "") ? null : p.backgroundStyle,
    //             postImage: (p.postImage === "null" || p.postImage === "") ? null : p.postImage,
    //             fileType: (p.fileType === "null" || p.fileType === "") ? null : p.fileType,
    //             fontFamily: p.fontFamily && p.fontFamily !== "null" ? p.fontFamily : "Segoe UI, sans-serif",
    //             fontSize: p.fontSize && p.fontSize !== "null" ? p.fontSize : "18px",
    //             fontWeight: p.fontWeight && p.fontWeight !== "null" ? p.fontWeight : "400",
    //             textAlign: p.textAlign && p.textAlign !== "null" ? p.textAlign : "left",
    //             formattedUploadTime: formatUploadTime(p.createdAt),
    //         }));

    //         setPostList(fixedPosts);
    //     } catch (error) {
    //         console.error("Error fetching posts:", error);
    //     }
    // };

    // In PostsContext.jsx
    // const fetchPosts = async () => {
    //     if (!user?.id) return;

    //     try {
    //         console.log("PostsContext: Fetching posts for user:", user.id);

    //         const postsResponse = await axios.get(`${API_BASE_URL}/posts`, {
    //             params: { userId: user?.id },
    //         });

    //         console.log("Raw posts from backend:", postsResponse.data.slice(0, 2));

    //         const fixedPosts = postsResponse.data.map((p, index) => {
    //             // Log the first post's font data
    //             if (index === 0) {
    //                 console.log("First post raw fontFamily:", p.fontFamily);
    //             }

    //             return {
    //                 ...p,
    //                 backgroundStyle: (p.backgroundStyle === "null" || p.backgroundStyle === "" || !p.backgroundStyle) ? null : p.backgroundStyle,
    //                 postImage: (p.postImage === "null" || p.postImage === "" || !p.postImage) ? null : p.postImage,
    //                 fileType: (p.fileType === "null" || p.fileType === "" || !p.fileType) ? null : p.fileType,
    //                 // Keep font data if it exists and is not "null" string
    //                 fontFamily: (p.fontFamily && p.fontFamily !== "null" && p.fontFamily !== "")
    //                     ? p.fontFamily
    //                     : "Segoe UI, sans-serif",
    //                 fontSize: (p.fontSize && p.fontSize !== "null" && p.fontSize !== "")
    //                     ? p.fontSize
    //                     : "18px",
    //                 fontWeight: (p.fontWeight && p.fontWeight !== "null" && p.fontWeight !== "")
    //                     ? p.fontWeight
    //                     : "400",
    //                 textAlign: (p.textAlign && p.textAlign !== "null" && p.textAlign !== "")
    //                     ? p.textAlign
    //                     : "left",
    //                 formattedUploadTime: formatUploadTime(p.createdAt),
    //             };
    //         });

    //         console.log("Fixed posts with fonts:", fixedPosts.map(p => ({
    //             id: p.id,
    //             font: p.fontFamily
    //         })));

    //         setPostList(fixedPosts);
    //     } catch (error) {
    //         console.error("Error fetching posts:", error);
    //     }
    // };

    // In PostsContext.jsx
    const fetchPosts = async () => {
        if (!user?.id) return;

        try {
            console.log("PostsContext: Fetching posts for user:", user.id);

            const postsResponse = await axios.get(`${API_BASE_URL}/posts`, {
                params: { userId: user?.id },
            });

            console.log("Raw response - first post:", postsResponse.data[0]);
            console.log("First post fontFamily type:", typeof postsResponse.data[0]?.fontFamily);
            console.log("First post fontFamily value:", JSON.stringify(postsResponse.data[0]?.fontFamily));

            const fixedPosts = postsResponse.data.map((p, index) => {
                // Detailed logging for first post
                if (index === 0) {
                    console.log(" BEFORE CLEANING:");
                    console.log("  - fontFamily:", p.fontFamily);
                    console.log("  - typeof:", typeof p.fontFamily);
                    console.log("  - is truthy?", !!p.fontFamily);
                    console.log("  - !== 'null'?", p.fontFamily !== "null");
                    console.log("  - !== ''?", p.fontFamily !== "");
                    console.log("  - full condition:", (p.fontFamily && p.fontFamily !== "null" && p.fontFamily !== ""));
                }

                const fixed = {
                    ...p,
                    backgroundStyle: (p.backgroundStyle === "null" || p.backgroundStyle === "" || !p.backgroundStyle) ? null : p.backgroundStyle,
                    postImage: (p.postImage === "null" || p.postImage === "" || !p.postImage) ? null : p.postImage,
                    fileType: (p.fileType === "null" || p.fileType === "" || !p.fileType) ? null : p.fileType,

                    // Font cleaning
                    fontFamily: (p.fontFamily && p.fontFamily !== "null" && p.fontFamily !== "")
                        ? p.fontFamily
                        : "Segoe UI, sans-serif",
                    fontSize: (p.fontSize && p.fontSize !== "null" && p.fontSize !== "")
                        ? p.fontSize
                        : "18px",
                    fontWeight: (p.fontWeight && p.fontWeight !== "null" && p.fontWeight !== "")
                        ? p.fontWeight
                        : "400",
                    textAlign: (p.textAlign && p.textAlign !== "null" && p.textAlign !== "")
                        ? p.textAlign
                        : "left",
                    fontStyle: (p.fontStyle && p.fontStyle !== "null" && p.fontStyle !== "")
                        ? p.fontStyle
                        : "normal",
                    formattedUploadTime: formatUploadTime(p.createdAt),
                };

                if (index === 0) {
                    console.log("🔍 AFTER CLEANING:");
                    console.log("  - fontFamily:", fixed.fontFamily);
                }

                return fixed;
            });

            console.log("All posts with fonts:", fixedPosts.map(p => ({
                id: p.id,
                content: p.content?.substring(0, 20),
                font: p.fontFamily
            })));

            setPostList(fixedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Fetch posts on mount
    useEffect(() => {
        fetchPosts();
    }, [user?.id]);

    const handleLike = async (id) => {
        try {
            const userId = Number(user?.id);
            if (!userId) return;

            const res = await axios.put(`${API_BASE_URL}/posts/${id}/like`, { userId });
            const liked = res?.data?.liked ?? false;
            const likeCount = Number(res?.data?.likeCount ?? 0);

            setPostList(prevPosts =>
                prevPosts.map(post =>
                    post.id === id ? { ...post, liked, likeCount } : post
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${API_BASE_URL}/posts/${postId}`);
            setPostList(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleNotInterested = async (postId) => {
        try {
            await axios.put(`${API_BASE_URL}/posts/${postId}/hidden`, {
                isHidden: true,
            });

            setPostList(prev =>
                prev.map(post =>
                    post.id === postId ? { ...post, isHidden: true } : post
                )
            );
        } catch (error) {
            console.error("Error hiding post:", error);
        }
    };

    const handleNotInterestedUndo = async (postId) => {
        try {
            await axios.put(`${API_BASE_URL}/posts/${postId}/hidden`, {
                isHidden: false,
            });

            setPostList(prev =>
                prev.map(post =>
                    post.id === postId ? { ...post, isHidden: false } : post
                )
            );
        } catch (error) {
            console.error("Error un-hiding post:", error);
        }
    };

    const value = {
        postList,
        setPostList,
        handleLike,
        handleDeletePost,
        handleNotInterested,
        handleNotInterestedUndo,
        refreshPosts: fetchPosts
    };

    return (
        <PostsContext.Provider value={value}>
            {children}
        </PostsContext.Provider>
    );
};