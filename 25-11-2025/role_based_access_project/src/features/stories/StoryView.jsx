import { useState, useRef, useEffect } from "react";
import './StoryView.css';
import sendIcon from '../../assets/icons/send.png';
import EmojiPicker from 'emoji-picker-react';
import { Smile } from "lucide-react";
import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

function StoryView({ story, stories, close }) {

    //change active story on click of story item from left sidebar
    const [activeStory, setActiveStory] = useState(story);

    //paly and pause state
    const [showplay, setShowPlay] = useState(false);

    //mute and unmute state
    const [showspeaker, setShowSpeaker] = useState(true);

    //useRef to control video playback
    const videoRef = useRef(null);

    //to show the emoji layer on top of the modal
    const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

    //post text state
    const [postText, setPostText] = useState('');

    //story progress state
    const [progress, setProgress] = useState(0);

    //find active index of the story
    const activeIndex = stories.findIndex(s => s.id === activeStory.id);


    useEffect(() => {

        const video = videoRef.current;

        const updateProgress = () => {
            if (video && video.duration) {
                const percent = (video.currentTime / video.duration) * 100; //"curentTime" and the "duration" are the properties of the video element
                setProgress(percent);
            }
        };

        video.addEventListener("timeupdate", updateProgress);  // "timeupdate" event fires when the time indicated by the currentTime property has been updated

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
        };
    }, [activeStory]);

    //handle play/pause toggle
    const togglePlay = () => {
        const video = videoRef.current;

        if (!video) return;

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

        if (!video) return;

        video.muted = !video.muted;
        setShowSpeaker(!video.muted);
    };


    const nextStory = () => {
        if (activeIndex < stories.length - 1) {
            setActiveStory(stories[activeIndex + 1]);
            setProgress(0);
        } else {
            // Last story → close viewer
            close();
        }
    };

    const prevStory = () => {
        if (activeIndex > 0) {
            setActiveStory(stories[activeIndex - 1]);
            setProgress(0);
        }
    };

    //dont play video until metadata is loaded
    useEffect(() => {
        setProgress(0);
        const video = videoRef.current;
        if (!video) return;

        // Always pause first when story changes
        // video.pause();
        video.currentTime = 0;
        // When metadata is loaded, then play safely
        const handleLoaded = () => {
            video.play().catch(() => { }); // avoid errors
            setShowPlay(false);
        };

        video.addEventListener("loadeddata", handleLoaded);

        //automatically goes to next story once current story ends, the "ended" is a video event triggered when the video playback ends
        video.addEventListener("ended", nextStory);

        return () => {
            video.removeEventListener("loadeddata", handleLoaded);
            video.removeEventListener("ended", nextStory);
        };

    }, [activeStory]);

    //handle the emoji
    const handleEmojiClick = (emojiObject) => {
        console.log('Full emoji object:', emojiObject);
        // Try different possible property names
        const emoji = emojiObject.emoji || emojiObject.native || emojiObject;
        setPostText(prev => prev + emoji);
        setShowEmojiOverlay(false); // Close picker after selecting
    };


    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            zIndex: 9999
        }}>

            {/* Left Sidebar */}
            <div
                style={{
                    backgroundColor: "#FFFFFF",
                    padding: "10px 16px",
                    width: "360px",
                    height: "100vh", overflowY: "auto"
                }}

            >
                {/* close button */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
                    <div className="fb-close-wrapper" onClick={close}>
                        <button className="fb-close-btn" ></button>
                    </div>

                    <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook Logo" style={{ height: '40px', marginRight: "14px" }} />

                </div>

                {/* HR Line */}
                <hr style={{
                    width: "100%",
                    border: "none",
                    height: "2px",
                    backgroundColor: "#CED0D4",
                    margin: "0 0 20px 0"
                }} />


                <h4 style={{ fontWeight: "bold" }}>Stories</h4>
                <p style={{ color: "#0064D1", fontSize: "15px" }}>Archieve · Settings</p>

                <div>
                    <p style={{ fontSize: "17px", fontWeight: "600" }}>Your Story</p>

                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <div style={{ background: "#F0F2F5", padding: "20px", borderRadius: "50%", width: "65px", height: "65px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <span style={{ color: "#0064D1", fontSize: "24px" }}>+</span>
                        </div>

                        <div >
                            <span style={{ fontSize: "15px", fontWeight: "600" }}>Create a Story</span>
                            <p style={{ fontSize: "13px" }}>Share a photo or write something</p>
                        </div>

                    </div>
                </div>



                <div style={{ marginTop: "20px" }}>
                    <p style={{ fontSize: "17px", fontWeight: "600" }}>All Stories</p>
                    {stories.map((story) => (
                        <div className="story-item"
                            onClick={() => setActiveStory(story)}   // changes the story video
                            style={{
                                borderRadius: activeStory.id === story.id ? "8px" : "0px",
                                backgroundColor: activeStory.id === story.id ? "#e8e9ebff" : "transparent",
                                cursor: "pointer",

                            }}
                            key={story.id}>

                            {/* OUTER BLUE BORDER WITH WHITE GAP */}
                            <div style={{
                                padding: "3px",              // white gap
                                background: "#FFFFFF",
                                borderRadius: "50%",
                                border: "2px solid #0064D1"
                            }}>

                                {/* INNER CIRCLE (NO PADDING) */}
                                <div style={{
                                    width: "58.5px",
                                    height: "58.5px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    background: "#F0F2F5",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <img
                                        src={story.profilePic}
                                        alt="Story"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "50%"
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: "15px", fontWeight: "600" }}>{story.username}</span>
                                <p style={{ fontSize: "13px" }}>{story.uploadedAt}</p>
                            </div>

                        </div>

                    ))}
                </div>


            </div>


            {/* Story Video */}
            <div style={{
                flex: 1,
                backgroundColor: "#080809",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative"
            }}>
                <div style={{ width: "500px", height: "90vh", position: "relative" }}>
                    {/* left slide button */}
                    {activeIndex > 0 && (
                        <button
                            onClick={prevStory}
                            style={{
                                position: "absolute",
                                left: "-60px",
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
                                e.currentTarget.style.transform = "translateY(-50%) scale(1.05) translateX(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "white";
                                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                            }}
                        >
                            <ChevronLeft />
                        </button>
                    )}

                    {/* Right slide button */}
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
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f0f2f5";
                                e.currentTarget.style.transform = "translateY(-50%) scale(1.05) translateX(4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "white";
                                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                            }}
                        >
                            <ChevronRight />
                        </button>
                    )}


                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            left: "15px",
                            right: "15px",
                            display: "flex",
                            alignItems: "center",
                            // justifyContent: "start",
                            justifyContent: "space-between",
                            gap: "5px",
                            color: "white",
                            zIndex: 10
                        }}
                    >

                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "-27px" }}>


                            {/* Profile Pic */}
                            <img
                                src={activeStory.profilePic}
                                alt="profile"
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />

                            {/* name and time */}
                            <div style={{ display: "flex", alignItems: "start", justifyContent: "start", marginLeft: "10px", gap: "5px" }}>
                                <span style={{ fontSize: "15px", fontWeight: "600", color: "white" }}>
                                    {activeStory.username}
                                </span>
                                <span style={{ fontSize: "13px", opacity: 0.8, color: "white", marginTop: "2px" }}>
                                    {activeStory.uploadedAt}
                                </span>
                            </div>

                            {/* account icon */}
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

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "-27px" }}>
                            {/* Speaker Icon */}
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

                            {/* Play / Pause */}
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

                            {/* 3 Dots Menu */}
                            <div className="fb-icon-btn">
                                <svg height="30" fill="#fff" viewBox="0 0 24 24">
                                    <circle cx="5" cy="12" r="2"></circle>
                                    <circle cx="12" cy="12" r="2"></circle>
                                    <circle cx="19" cy="12" r="2"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* <div style={{ position: "relative", width: "300px" }}> */}
                    {/* Progress Line */}
                    <div
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
                    </div>
                    {/* Story Video */}
                    <video
                        ref={videoRef}
                        src={activeStory.storyVid}
                        autoPlay
                        muted={!showspeaker}
                        style={{
                            marginTop: "-20px",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px"
                        }}
                    />
                    {/* </div> */}
                    <div className="input-container">
                        <input type="text" placeholder="Send message..."
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
                            }} />
                        <div className="smile_icon" onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojiOverlay(true);
                        }}><Smile size={20} color="#ffffffff" /></div>


                        <img src={sendIcon} alt="send_icon" className="send_icon" />
                    </div>
                </div>
            </div>

            {/* Add this wrapper around TopRightIcons */}
            <div style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                zIndex: 10000
            }}>
                <TopRightIcons />
            </div>

            {showEmojiOverlay && (
                <div style={{
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
                    marginLeft: "320px"
                }}
                    onClick={() => setShowEmojiOverlay(false)}
                >
                    <div style={{ zIndex: 200001, marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                </div>
            )}
        </div >
    );
}

export default StoryView;
