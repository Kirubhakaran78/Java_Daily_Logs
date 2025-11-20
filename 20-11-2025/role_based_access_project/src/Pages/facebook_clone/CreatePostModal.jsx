import { useEffect, useRef, useState } from 'react'

import {  Modal } from 'react-bootstrap'
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import {  MoreHorizontal } from 'lucide-react';
import Button from 'react-bootstrap/Button';
import "./FbHome.css"




//modal for create post
function CreatePostModal(props) {

    //image/video input
    const fileInputRef = useRef(null);

    //handle input image and video
    const openFilePicker = () => {
        fileInputRef.current.click();
    }

    return (
        <Modal
            {...props}
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
            <Modal.Body>
                <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                    <img
                        src={fb_profile}
                        style={{ width: 32, height: 32, borderRadius: "50%" }}
                    />
                    <span style={{ color: "#080809", marginLeft: "15px",fontWeight:"600" }}> Peter </span>
                </div>
                <textarea
                    style={{ color: "#686666ff", fontSize: "28px", marginTop: "10px", border: "none", outline: "none", width: "100%", padding: "0px 16px 40px" }}
                    placeholder="What's on your mind, Peter?"
                />

                <div style={{
                    height: "60px", width: "468px", margin: "0px", padding: "8px", background: "#ffffff", border: "1px solid #adababff", borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
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
                                onChange={(e) => e.console.log(e.target.files[0])}
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
                            onClick={openFilePicker}
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
                            onClick={openFilePicker}
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
                            // onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)} //same post click it will be closed
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <MoreHorizontal size={20} color="#65676b" />
                        </div>
                    </div>


                </div>



            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>

        </Modal>
    );
}

export default CreatePostModal