import React, { useState, useRef, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import posts from "../../data/postData.json"
import { useUser } from "../../context/UserProvider";
import "./ShareButton.css"

function ShareButton({ post, ...props }) {

    const { user, profilePic } = useUser();

    // left and right chevron
    const storyContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    //default pic
    const defaultPic = "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

    //share icons array of objects
    const shareIcons = [
        {
            "id": "1",
            "icon_src": "https://img.icons8.com/?size=100&id=20383&format=png&color=000000",
            "label": "messenger"
        },
        {
            "id": "2",
            "icon_src": "https://img.icons8.com/?size=100&id=TRtiP3z8pXb0&format=png&color=000000",
            "label": "whatsapp"
        },
        {
            "id": "3",
            "icon_src": "https://img.icons8.com/?size=100&id=9480&format=png&color=000000",
            "label": "Your Story"
        },
        {
            "id": "4",
            "icon_src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpbmstaWNvbiBsdWNpZGUtbGluayI+PHBhdGggZD0iTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzEiLz48cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiLz48L3N2Zz4=",
            "label": "Copy Link"
        },
        {
            "id": "5",
            "icon_src": "https://img.icons8.com/?size=100&id=sRqPnYg3QRf7&format=png&color=000000",
            "label": "Group"
        },
        {
            "id": "6",
            "icon_src": "https://img.icons8.com/?size=100&id=dmuNjmy42Ovd&format=png&color=000000",
            "label": "Friend's Profile"
        },
    ]


    // Scroll detection
    useEffect(() => {
        const container = storyContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            console.log("scrollLeft:", container.scrollLeft); // Add this
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        };

        container.addEventListener("scroll", handleScroll);

        // Initial check
        handleScroll();

        // Also check after modal fully renders
        setTimeout(handleScroll, 100);

        console.log("scrollWidth:", container.scrollWidth);
        console.log("clientWidth:", container.clientWidth);

        return () => container.removeEventListener("scroll", handleScroll);
    }, [props.show]); // dependency

    const slideStories = (direction) => {
        if (!storyContainerRef.current) return;

        const container = storyContainerRef.current;
        const amount = 200;


        if (direction === "left") {
            container.scrollLeft -= amount;
        } else {
            container.scrollLeft += amount;
        }
    };
    return (
        <div>
            <Modal
                {...props}
                // size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                dialogClassName="custom-share-modal"
            // contentClassName="custom_modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Share
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                        <img
                            src={profilePic || defaultPic}
                            alt="profile"
                            style={{ width: 40, height: 40, borderRadius: "50%" }}
                        />
                        <span style={{ color: "#080809", marginLeft: "15px", fontSize: "15px" }}>{user.username}</span>
                    </div>
                    <input
                        type='text'
                        style={{
                            color: "#686666ff",
                            fontSize: "17px",
                            marginTop: "10px",
                            border: "none",
                            outline: "none",
                            width: "100%",
                            padding: "10px 20px"
                        }}
                        placeholder="Say something about this..."
                    />

                    <Button
                        variant="primary"
                        style={{ marginTop: "15px", float: "right" }}
                    >
                        Share now
                    </Button>
                </Modal.Body>

                <Modal.Footer style={{
                    display: "block",  // Change from flex to block
                    padding: "16px"
                }}>
                    {/* Send in Messenger */}
                    <p style={{
                        color: "#080809",
                        fontSize: "17px",
                        fontWeight: "600",
                        marginBottom: "15px",
                    }}>
                        Send in Messenger
                    </p>

                    {/* Scrollable container with buttons */}

                    <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>

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
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: "white",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#515458ff",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f0f2f5";
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "white";
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                }}
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {/* scrollable contacts */}
                        <div
                            ref={storyContainerRef}
                            style={{
                                display: "flex",
                                gap: "15px",
                                overflowX: "auto",  // Only ONE overflow container
                                scrollBehavior: "smooth",
                                scrollbarWidth: "none",  // Hide scrollbar Firefox
                                msOverflowStyle: "none",  // Hide scrollbar IE
                                padding: "10px 45px 10px 0px",  // Space for buttons
                                WebkitOverflowScrolling: "touch"  // Smooth iOS scroll
                            }}
                            // Hide scrollbar for Chrome/Safari
                            className="hide-scrollbar"
                        >
                            {posts.map((p) => (
                                <div
                                    key={p.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        minWidth: "50px",  // Prevent shrinking
                                        flexShrink: 0,  //  Keep size
                                        width: "84px",
                                        height: "116px",
                                        padding: "8px 12px",
                                        marginBottom: "5px"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.border = "none";
                                        e.currentTarget.style.borderRadius = "5px";
                                        e.currentTarget.style.backgroundColor = "#F2F4F7";
                                    }}
                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                    }}
                                >
                                    <img
                                        src={p.profilePic}
                                        alt={p.username}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            border: "2px solid #e4e6eb",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={(e) => {

                                            e.currentTarget.style.backgroundColor = "#737475ff";
                                        }}
                                        onMouseLeave={(e) => {

                                            e.currentTarget.style.border = "2px solid #e4e6eb";
                                        }}
                                    />
                                    <span style={{
                                        fontSize: "12px",
                                        marginTop: "5px",
                                        textAlign: "center",
                                        maxWidth: "70px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        marginBottom: "0px"
                                    }}>
                                        {p.username}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT BUTTON */}
                        {showRightArrow && (
                            <button
                                onClick={() => slideStories("right")}
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: "white",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#515458ff",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f0f2f5";
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "white";
                                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>


                    {/* Share to */}
                    <p style={{
                        color: "#080809",
                        fontSize: "17px",
                        fontWeight: "600",
                        marginBottom: "15px",
                    }}>
                        Share to
                    </p>

                    <div style={{
                        display: "flex",
                        gap: "0px",
                        flexWrap: "nowrap",    // prevents breaking into multiple rows
                        overflowX:"hidden",
                        paddingBottom: "10px"
                    }}>
                        {/* Icons */}
                        {shareIcons.map((item) => (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        minWidth: "50px",
                                        flexShrink: 0,
                                        width: "84px",
                                        height: "116px",
                                        padding: "8px 12px",
                                        marginBottom: "5px",

                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.border = "none";
                                        e.currentTarget.style.borderRadius = "5px";
                                        e.currentTarget.style.backgroundColor = "#F2F4F7";
                                    }}
                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                    }}
                                >
                                    {/* messenger icon */}
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        backgroundColor: "#E2E5E9"
                                    }}
                                    >
                                        <img src={item.icon_src} alt="icon" width={24} height={24} />

                                    </div>
                                    <span style={{ fontSize: "13px", textAlign: "center" }}>{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>



                    {/* CSS to hide scrollbar */}
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ShareButton