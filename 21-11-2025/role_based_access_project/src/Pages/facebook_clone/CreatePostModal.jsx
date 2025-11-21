import { useEffect, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import { MoreHorizontal, X, Pencil, Smile } from 'lucide-react';
import Button from 'react-bootstrap/Button';
import "./CreatePostModal.css"
import EmojiPicker from 'emoji-picker-react';
import { HexColorPicker } from "react-colorful";
import { ChevronLeft } from 'lucide-react';
import Aa_icon from "../../assets/icons/Aa_icon.png"



//modal for create post
function CreatePostModal({ show, onHide, onCreatePost }) {

    //image/video input
    const fileInputRef = useRef(null);

    //state to handle the file or image input
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [postText, setPostText] = useState('');
    const [fileType, setFileType] = useState(null);

    //emoji picker useState
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    //to show the emoji layer on top of the modal
    const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

    //backgrond color picker
    const [color, setColor] = useState("#aabbcc");

    //bg mode
    const [isBgMode, setIsBgMode] = useState(false);

    //media mode
    const [isMediaMode, setIsMediaMode] = useState(false);


    //background styles
    const backgroundStyles = [
        {
            id: 0,
            background: "white", // or "transparent"
            isDefault: true
        },
        {
            id: 1,
            background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
        },
        {
            id: 2,
            background: "url('https://i.imgur.com/2nCt3Sbl.jpg') center/cover",
        },
        {
            id: 3,
            background: "linear-gradient(to right, #00c6ff, #0072ff)",
        },
        {
            id: 4,
            background: "linear-gradient(45deg, #f3ec78, #af4261)",
        },
    ];

    //bg text area
    const [selectedBg, setSelectedBg] = useState(null);
    const [showBgPicker, setShowBgPicker] = useState(false);



    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    //handle input image and video
    const openFilePicker = () => {
        setIsBgMode(false);  // turn off BG mode
        setSelectedBg(null);
        fileInputRef.current.click();
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setIsMediaMode(true);      // media mode ON
            setIsBgMode(false);        // background mode OFF
            setSelectedBg(null);

            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            if (file.type.startsWith('image/')) {
                setFileType('image');
            } else if (file.type.startsWith('video/')) {
                setFileType('video');
            }

            console.log('File selected:', file.name);
        }
    };



    // Remove selected file
    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileType(null);
        setIsMediaMode(false);   // <— allow Aa again

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle post creation
    const handleCreatePost = async () => {
        if (!postText.trim() && !selectedFile) {
            alert('Please write something or select a file!');
            return;
        }

        // Convert file to Base64
        let permanentImageUrl = null;
        if (selectedFile) {
            try {
                permanentImageUrl = await convertToBase64(selectedFile);
                console.log('Image converted to Base64');
            } catch (error) {
                console.error('Error converting file:', error);
                alert('Error processing image');
                return;
            }
        }

        const newPost = {
            text: postText,
            fileType: fileType,
            imageUrl: permanentImageUrl,
            backgroundStyle: selectedBg ? selectedBg.background : null
        };

        console.log('Creating post with data:', newPost);

        if (onCreatePost) {
            onCreatePost(newPost);
        }

        // Reset and close
        setPostText('');
        setSelectedBg(null);
        handleRemoveFile();
        onHide();
    };

    //handle the emoji
    const handleEmojiClick = (emojiObject) => {
        setPostText(prev => prev + emojiObject.emoji);
    };




    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <>

            <Modal
                show={show} onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                dialogClassName="custom_dialog"
                contentClassName="custom_modal"

            >
                <Modal.Header closeButton>
                    <Modal.Title
                        style={{
                            width: "100%",
                            textAlign: "center",
                            marginLeft: "20px"
                        }}
                    >
                        Create Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >


                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={fb_profile} style={{ width: 32, height: 32, borderRadius: "50%" }} />
                        <span style={{ color: "#080809", marginLeft: "15px", fontWeight: "600" }}>Peter</span>
                    </div>

                    {/* BACKGROUND POST AREA */}
                    <div
                        style={{
                            width: "100%",
                            height: selectedBg ? "300px" : "auto",
                            marginTop: "12px",
                            borderRadius: "10px",
                            background: selectedBg ? selectedBg.background : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: selectedBg ? "center" : "flex-start",
                            padding: "20px",
                            transition: "0.3s",
                            position: "relative"
                        }}
                    >
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="What's on your mind, Peter?"
                            style={{
                                width: "100%",
                                height: selectedBg ? "200px" : "80px",
                                fontSize: selectedBg ? "32px" : "18px",
                                fontWeight: selectedBg ? "700" : "400",
                                textAlign: selectedBg ? "center" : "left",
                                color: selectedBg ? "white" : "#050505",
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                resize: "none",
                            }}
                        />


                    </div>

                    {/* Text tools (Aa / ChevronLeft + backgrounds + Smile) */}

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "10px",
                    }}>

                        {/* LEFT BUTTON → Toggle background mode */}
                        {!isBgMode ? (
                            // Aa button
                            <div
                                onClick={() => {
                                    if (isMediaMode) return;  // prevent clicking
                                    setIsBgMode(true)
                                }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    opacity: isMediaMode ? 0.4 : 1,
                                    pointerEvents: isMediaMode ? "none" : "auto"
                                }}
                            >
                                <img src={Aa_icon} height={36} width={36} />
                            </div>
                        ) : (
                            // ChevronLeft button
                            <div
                                onClick={() => setIsBgMode(false)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    background: "#C9CCD1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <ChevronLeft size={22} color="#050505" />
                            </div>
                        )}

                        {/* Background styles — only if background mode ON */}
                        {isBgMode && (
                            <>
                                {backgroundStyles.map((bg) => (
                                    <div
                                        key={bg.id}
                                        onClick={() => setSelectedBg(bg.isDefault ? null : bg)}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            background: bg.background,
                                            border: selectedBg?.id === bg.id ? "3px solid #0866FF" :
                                                bg.isDefault ? "1px solid #ddd" : "none",
                                        }}
                                    />
                                ))}
                            </>
                        )}

                        {/* Spacer keeps Smile at right */}
                        <div style={{ flex: 1 }} />

                        {/* SMILE — always shows at right */}
                        <div
                            onClick={() => setShowEmojiOverlay(true)}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "#f0f2f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Smile size={20} color="#65676b" />
                        </div>

                    </div>


                    {previewUrl && (
                        <div className="image-preview-container">
                            {/* Dark overlay with buttons */}
                            <div className="image-preview-overlay">
                                {/* Left side - Edit and Add buttons */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="preview-action-btn">
                                        <span><img src="https://img.icons8.com/?size=100&id=H5dKJanZkZNk&format=png&color=000000" alt="add image" height={20} width={20} /></span>
                                        <span>Edit</span>
                                    </button>
                                    <button className="preview-action-btn" onClick={openFilePicker}>
                                        <span><img src="https://img.icons8.com/?size=100&id=Uboc7f1oa4JX&format=png&color=000000" alt="add image" height={20} width={20} /></span>
                                        <span>change photos/videos</span>
                                    </button>
                                </div>

                                {/* Right side - Remove button */}
                                <button
                                    className="remove-preview-btn"
                                    onClick={handleRemoveFile}
                                >
                                    <X size={20} color="#050505" />
                                </button>
                            </div>

                            {/* Image Preview */}
                            {fileType === 'image' && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="preview-media"
                                />
                            )}

                            {/* Video Preview */}
                            {fileType === 'video' && (
                                <video
                                    src={previewUrl}
                                    controls
                                    className="preview-media"
                                />
                            )}
                        </div>
                    )}

                    <div style={{
                        height: "60px",
                        width: "100%",
                        margin: "0px",
                        marginTop: "12px",
                        padding: "8px 16px",
                        background: "#ffffff",
                        border: "1px solid #ced0d4",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexShrink: 0
                    }}>

                        <p style={{ fontSize: "15px", color: "#080809", fontWeight: "600", textAlign: "center", marginTop: "10px" }}>Add to your Post </p>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>

                            {/* image has file input */}
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}
                                onClick={openFilePicker}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png" alt="video image icon" />

                                {/* hidden input */}
                                <input type="file" ref={fileInputRef}
                                    accept='image/*,video/*'
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />

                            </div>

                            {/* image has contact */}
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}
                                onClick={openFilePicker}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yq/r/b37mHA1PjfK.png" alt="contact icon" />
                            </div>

                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}
                                onClick={() => setShowEmojiOverlay(true)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/Y4mYLVOhTwq.png" alt="smile icon" />
                            </div>

                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}

                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v4/y1/r/8zlaieBcZ72.png" alt="location icon" />
                            </div>

                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}
                                onClick={openFilePicker}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yT/r/q7MiRkL7MLC.png" alt="gif icon" />
                            </div>

                            {/* <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            marginLeft: "10px"
                        }}
                            onClick={openFilePicker}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png" alt="live video icon" />
                        </div>

                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            marginLeft: "10px"
                        }}
                            onClick={openFilePicker}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/pkbalDbTOVI.png" alt="flag icon"  />
                        </div> */}


                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginLeft: "10px"
                            }}

                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <MoreHorizontal size={20} color="#65676b" />
                            </div>
                        </div>


                    </div>



                </Modal.Body>


                <Modal.Footer style={{
                    padding: "12px 16px",
                    borderTop: "1px solid #e4e6eb",
                    backgroundColor: "white"
                }}>
                    <Button
                        onClick={handleCreatePost}
                        disabled={!postText.trim() && !selectedFile}
                        style={{
                            width: "100%",
                            backgroundColor: (!postText.trim() && !selectedFile) ? "#e4e6eb" : "#0866FF",
                            color: (!postText.trim() && !selectedFile) ? "#bcc0c4" : "white",
                            border: "none",
                            padding: "12px",
                            fontSize: "15px",
                            fontWeight: "600",
                            borderRadius: "6px"
                        }}
                    >
                        Post
                    </Button>
                </Modal.Footer>

            </Modal >
            {showEmojiOverlay && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.3)",
                    zIndex: 99999,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: "80px"
                }}
                    onClick={() => setShowEmojiOverlay(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                </div>
            )}
        </>
    );
}

export default CreatePostModal