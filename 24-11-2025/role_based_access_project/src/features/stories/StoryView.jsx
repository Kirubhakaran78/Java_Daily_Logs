import { useState } from "react";
import './StoryView.css';

function StoryView({ story, stories, close }) {

    //change active story on click of story item from left sidebar
    const [activeStory, setActiveStory] = useState(story);

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
                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            left: "15px",
                            right: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: "5px",
                            color: "white",
                            zIndex: 10
                        }}
                    >
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
                        <div style={{ display: "flex", alignItems: "start", justifyContent: "start", marginLeft: "10px", gap: "8px" }}>
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


                    {/* Story Video */}
                    <video
                        src={activeStory.storyVid}
                        autoPlay
                        muted
                        loop
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px"
                        }}
                    />
                </div>

            </div>
        </div >
    );
}

export default StoryView;
