import React,{useState,useEffect} from 'react'
import storys from './storyData.json';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useRef } from 'react';
import fb_profile from '../../Assets/Images/facebook_clone/fb_profile.jpg';

function StoryContainer() {


    //stroy movable button
    const storyContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);



    //story movable button
    useEffect(() => {
        const container = storyContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // If scrolled more than 0px from start, show left arrow
            setShowLeftArrow(container.scrollLeft > 0);

            // If there's more content to scroll, show right arrow
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10 //clientWidth - visible wide of the container
            );
        };

        container.addEventListener('scroll', handleScroll); // Watch for scrolling
        handleScroll(); // heck immediately on load

        return () => container.removeEventListener('scroll', handleScroll); //cleanup
    }, []);

    const slideStories = (direction) => {
        if (!storyContainerRef.current) return;

        const container = storyContainerRef.current;
        const amount = 250; // move 2–3 cards per click

        if (direction === "left") {
            container.scrollLeft -= amount;
        } else {
            container.scrollLeft += amount;
        }
    };
    return (
        <>
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
                            transform: "translateY(-50%)", //centers it vertically
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
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f2f5";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
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
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none" // IE
                    }}
                >
                    {/* Create Story Card */}
                    <div style={{
                        width: "112.5px",
                        height: "200px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        position: "relative",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        overflow: "visible",
                        flexShrink: 0
                    }}>
                        {/* ... your existing Create Story Card content ... */}
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

                    {/* Story Cards from JSON */}
                    {storys.map((story) => (
                        <div key={story.id} style={{
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
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f2f5";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
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
        </>
    )
}

export default StoryContainer
