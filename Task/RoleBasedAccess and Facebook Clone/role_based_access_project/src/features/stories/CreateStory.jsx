// import React, { useRef, useState } from "react";
// import fb_profile from "../../assets/icons/fb_profile3.jpg";
// import "./StoryView.css";
// import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
// import { Button, Dropdown, Modal } from "react-bootstrap";
// import "./CreateStory.css";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import { useUser } from "../../context/UserProvider";
// import { useNavigate, useLocation } from "react-router-dom";

// function PhotoStoryEditor({ selectedFile }) {
//   return (
//     <div
//       style={{
//         width: "962px",
//         height: "874px",
//         borderRadius: "12px",
//         backgroundColor: selectedFile ? "#fff" : "transparent",
//         position: "relative",
//         overflow: "hidden",
//         padding: "20px 0px 10px 35px",
//         // padding:"56px 24px 32px",
//       }}
//     >
//       <span style={{ color: "#080809", fontWeight: "600", fontSize: "15px" }}>
//         {" "}
//         {selectedFile ? "Preview" : ""}
//       </span>

//       <div
//         style={{
//           width: "900px",
//           height: "800px",
//           borderRadius: "12px",
//           backgroundColor: selectedFile ? "#000" : "transparent",
//           position: "relative",
//           overflow: "hidden",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         {/* AFTER SELECTING → show image centered */}
//         {selectedFile && (
//           <div
//             style={{
//               border: "1px solid white",
//               width: "372px",
//               height: "670px",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: "12px",
//               backgroundColor: "#2d2d2eff",
//             }}
//           >
//             <img
//               src={selectedFile}
//               alt="preview"
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: "100%",
//                 objectFit: "contain",
//               }}
//             />
//           </div>
//         )}

//         {/* SHOW GRADIENT ONLY AFTER IMAGE SELECTED */}
//         {selectedFile && (
//           <div
//             style={{
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               width: "100%",
//               height: "200px",
//               background:
//                 "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
//             }}
//           ></div>
//         )}

//         {/* Caption text */}
//         {selectedFile && (
//           <div
//             style={{
//               position: "absolute",
//               bottom: "25px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               color: "#fff",
//               fontWeight: "600",
//               fontSize: "20px",
//               marginTop: "15px",
//             }}
//           >
//             Your Story
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// function DiscardConfirmationModal({ show, onHide, resetStory }) {
//   return (
//     <Modal show={show} onHide={onHide} centered size="md">
//       <Modal.Header closeButton />

//       <Modal.Body>
//         <h4 style={{ textAlign: "center" }}>Discard story?</h4>
//         <p style={{ textAlign: "center" }}>
//           Are you sure you want to discard this story? Your progress will not be
//           saved.
//         </p>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Continue Editing
//         </Button>

//         <Button
//           variant="danger"
//           onClick={() => {
//             resetStory();
//             onHide();
//           }}
//           setTimeout
//         >
//           Discard
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// function TextStoryEditor({
//   storyText,
//   setStoryText,
//   selectedBackground,
//   backgrounds,
//   setSelectedBackground,
// }) {
//   return (
//     <div
//       style={{
//         width: "962px",
//         height: "874px",
//         borderRadius: "12px",
//         backgroundColor: "#fff",
//         position: "relative",
//         overflow: "hidden",
//         padding: "20px 0px 10px 35px",
//       }}
//     >
//       <span style={{ color: "#080809", fontWeight: "600", fontSize: "15px" }}>
//         Preview
//       </span>

//       <div
//         style={{
//           width: "900px",
//           height: "800px",
//           borderRadius: "12px",
//           backgroundColor: selectedBackground,
//           position: "relative",
//           overflow: "hidden",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         {/* Text Story Container */}
//         <div
//           style={{
//             width: "372px",
//             height: "670px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             borderRadius: "12px",
//             padding: "40px",
//             position: "relative",
//           }}
//         >
//           <textarea
//             value={storyText}
//             onChange={(e) => setStoryText(e.target.value)}
//             placeholder="Start typing"
//             style={{
//               width: "100%",
//               height: "auto",
//               background: "transparent",
//               border: "none",
//               color: "#fff",
//               fontSize: "32px",
//               fontWeight: "600",
//               textAlign: "center",
//               resize: "none",
//               outline: "none",
//               fontFamily: "inherit",
//               overflow: "hidden",
//             }}
//             maxLength={200}
//             rows={1}
//             onInput={(e) => {
//               e.target.style.height = "auto";
//               e.target.style.height = e.target.scrollHeight + "px";
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function CreateStory({ close, onCreateStory }) {

//   const navigate = useNavigate();
  
//   const { user, profilePic } = useUser();

//   const defaultPic =
//     "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

//   //show the text story creation area
//   const [showTextStory, setShowTextStory] = useState(false);

//   //selected file
//   const [selectedFile, setSelectedFile] = useState(null);

//   //selected Text
//   const [selectedText, setSelectedText] = useState(null);

//   //to open the file input from home page
//   const modalFileInputRef = useRef(null);

//   //discard confirmation modal state
//   const [discardModalShow, setDiscardModalShow] = useState(false);

//   // After line 136 (after const [discardModalShow, setDiscardModalShow] = useState(false);)
//   const [storyText, setStoryText] = useState("");
//   const [selectedBackground, setSelectedBackground] = useState("#0866FF"); // default blue

//   // Background options
//   const backgrounds = [
//     "#0866FF",
//     "#E74694",
//     "#F35369",
//     "#FA7E1E",
//     "#FFBA00",
//     "#44BEC7",
//     "#FFC0CB",
//     "#9B59B6",
//     "#1ABC9C",
//     "#E67E22",
//     "#95A5A6",
//     "#34495E",
//     "#16A085",
//     "#8E44AD",
//     "#2C3E50",
//     "#F39C12",
//   ];

//   // Add function to convert profile pic to blob
//   const getProfilePicBlob = async () => {
//     try {
//       const response = await fetch(profilePic || defaultPic);
//       const blob = await response.blob();
//       return new File([blob], "profile.jpg", { type: "image/jpeg" });
//     } catch (error) {
//       console.error("Error converting profile pic:", error);
//       return null;
//     }
//   };

//   // Handle Share to Story for Photo
//   const handleSharePhotoStory = async () => {
//     if (!selectedFile) return;

//     console.log("User ID:", user?.id);

//     try {
//       const profilePicBlob = await getProfilePicBlob();

//       // Convert the selectedFile URL back to a file
//       const response = await fetch(selectedFile);
//       const blob = await response.blob();
//       const file = new File([blob], "story.jpg", { type: blob.type });

//       await onCreateStory({
//         type: "photo",
//         file: file,
//         profilePic: profilePicBlob,
//         userId: user?.id
//       });

//       // close();
//       navigate("/HomePage/facebook");
//     } catch (error) {
//       console.error("Error sharing photo story:", error);
//     }
//   };

//   // Handle Share to Story for Text
//   const handleShareTextStory = async () => {
//     if (!storyText.trim()) {
//       alert("Please enter some text for your story");
//       return;
//     }

//     try {
//       const profilePicBlob = await getProfilePicBlob();

//       await onCreateStory({
//         type: "text",
//         text: storyText,
//         backgroundColor: selectedBackground,
//         profilePic: profilePicBlob,
//         userId: user?.id,
//       });

//       // close();
//       navigate("/HomePage/facebook");
//     } catch (error) {
//       console.error("Error sharing text story:", error);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "#F2F4F7",
//         display: "flex",
//         zIndex: 9999,
//       }}
//     >
//       {/* Left Sidebar */}
//       <div
//         style={{
//           backgroundColor: "#FFFFFF",
//           padding: "10px 16px",
//           width: "375px",
//           height: "100vh",
//           overflowY: "auto",
//         }}
//       >
//         {/* close button */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div className="fb-close-wrapper" onClick={() => navigate("/HomePage/facebook")}>
//             <button className="fb-close-btn"></button>
//           </div>

//           <img
//             src="https://www.facebook.com/images/fb_icon_325x325.png"
//             alt="Facebook Logo"
//             style={{ height: "40px", marginRight: "14px" }}
//           />
//         </div>

//         {/* HR Line */}
//         <hr
//           style={{
//             width: "100%",
//             border: "none",
//             height: "2px",
//             backgroundColor: "#CED0D4",
//           }}
//         />

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h4 style={{ fontWeight: "700" }}>Your Story</h4>
//           <Dropdown align="end">
//             <Dropdown.Toggle
//               variant="light"
//               style={{
//                 backgroundColor: "#E2E5E9",
//                 padding: "8px",
//                 borderRadius: "50px",
//               }}
//             >
//               <img
//                 src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000"
//                 alt="settings"
//                 width={24}
//                 height={24}
//               />
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.Header>
//                 <h3>Settings</h3>
//               </Dropdown.Header>
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>

//         <div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "start",
//               alignItems: "center",
//               gap: "12px",
//               cursor: "pointer",
//               marginTop: "25px",
//             }}
//           >
//             <img
//               src={profilePic || defaultPic}
//               alt="fb_profile pic"
//               width={65}
//               height={65}
//               style={{
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             ></img>

//             <div>
//               <span style={{ fontSize: "17px", fontWeight: "600" }}>
//                 {user?.username}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* HR Line */}
//         <hr
//           style={{
//             width: "100%",
//             border: "none",
//             height: "2px",
//             backgroundColor: "#CED0D4",
//             margin: "25px 0 20px 0",
//           }}
//         />

//         {showTextStory && (
//           <>
//             <div style={{ marginBottom: "20px" }}>
//               <DropdownButton
//                 id="dropdown-variants-Secondary"
//                 variant="light"
//                 title={
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "14px" }}>Aa</span>
//                     <span style={{ fontSize: "15px", fontWeight: "500" }}>
//                       Clean
//                     </span>
//                   </div>
//                 }
//                 style={{
//                   width: "328px",
//                 }}
//               >
//                 <Dropdown.Item href="#/action-1">
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "14px" }}>Aa</span>
//                     <span>Clean</span>
//                   </div>
//                 </Dropdown.Item>
//                 <Dropdown.Item href="#/action-2">
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "14px" }}>Aa</span>
//                     <span>Casual</span>
//                   </div>
//                 </Dropdown.Item>
//                 <Dropdown.Item href="#/action-3">
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "14px" }}>Aa</span>
//                     <span>Fancy</span>
//                   </div>
//                 </Dropdown.Item>
//                 <Dropdown.Item href="#/action-4">
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "14px" }}>Aa</span>
//                     <span>Headline</span>
//                   </div>
//                 </Dropdown.Item>
//               </DropdownButton>
//             </div>

//             {/* Backgrounds */}
//             <div
//               style={{
//                 width: "328px",
//                 borderRadius: "8px",
//                 border: "1px solid #E2E5E9",
//                 padding: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <span style={{ color: "grey", fontSize: "14px" }}>
//                 Backgrounds
//               </span>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(8, 1fr)",
//                   gap: "8px",
//                   marginTop: "10px",
//                 }}
//               >
//                 {backgrounds.map((bg, index) => (
//                   <div
//                     key={index}
//                     onClick={() => setSelectedBackground(bg)}
//                     style={{
//                       width: "32px",
//                       height: "32px",
//                       borderRadius: "50%",
//                       backgroundColor: bg,
//                       cursor: "pointer",
//                       border:
//                         selectedBackground === bg
//                           ? "3px solid #0866FF"
//                           : "2px solid #E2E5E9",
//                       boxShadow:
//                         selectedBackground === bg ? "0 0 0 2px white" : "none",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Add music */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "start",
//                 alignItems: "center",
//                 gap: "12px",
//                 cursor: "pointer",
//                 marginTop: "10px",
//                 padding: "8px",
//               }}
//               className="create_story_left_Options"
//             >
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "#E2E5E9",
//                   width: "44px",
//                   height: "44px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/QHXEIFF6IuS.png')",
//                     backgroundPosition: "0px -351px",
//                     backgroundSize: "auto",
//                     width: "24px",
//                     height: "24px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                   }}
//                 ></div>
//               </div>
//               <span style={{ fontWeight: "600" }}>Add music</span>
//             </div>
//           </>
//         )}

//         {selectedFile && (
//           <>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "start",
//                 alignItems: "center",
//                 gap: "12px",
//                 cursor: "pointer",
//                 marginTop: "10px",
//                 padding: "8px",
//               }}
//               className="create_story_left_Options"
//             >
//               {/* add text */}
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "#E2E5E9",
//                   width: "44px",
//                   height: "44px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/EBvutOuy0EA.png')",
//                     backgroundPosition: "0px -83px",
//                     backgroundSize: "auto",
//                     width: "24px",
//                     height: "24px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                   }}
//                 ></div>
//               </div>
//               <span style={{ fontWeight: "600" }}>Add Text</span>
//             </div>

//             {/* Add music */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "start",
//                 alignItems: "center",
//                 gap: "12px",
//                 cursor: "pointer",
//                 marginTop: "10px",
//                 padding: "8px",
//               }}
//               className="create_story_left_Options"
//             >
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "#E2E5E9",
//                   width: "44px",
//                   height: "44px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/QHXEIFF6IuS.png')",
//                     backgroundPosition: "0px -351px",
//                     backgroundSize: "auto",
//                     width: "24px",
//                     height: "24px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                   }}
//                 ></div>
//               </div>
//               <span style={{ fontWeight: "600" }}>Add music</span>
//             </div>

//             {/* Alternative text */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "start",
//                 alignItems: "center",
//                 gap: "12px",
//                 cursor: "pointer",
//                 marginTop: "10px",
//                 padding: "8px",
//               }}
//               className="create_story_left_Options"
//             >
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "#E2E5E9",
//                   width: "44px",
//                   height: "44px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/ya/r/I1p1ysN2ANR.png')",
//                     backgroundPosition: "0px -25px",
//                     backgroundSize: "auto",
//                     width: "24px",
//                     height: "24px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                   }}
//                 ></div>
//               </div>
//               <span style={{ fontWeight: "600" }}>Alternative text</span>
//             </div>
//           </>
//         )}

//         {/* Bottom card */}
//         {(selectedFile || showTextStory) && (
//           <div
//             style={{
//               width: "375px",
//               height: "72px",
//               bottom: "0",
//               position: "fixed",
//               backgroundColor: "#FFFFFF",
//               left: "0",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
//             }}
//           >
//             <button
//               style={{
//                 backgroundColor: "#E2E5E9",
//                 borderRadius: "6px",
//                 marginRight: "10px",
//                 width: "140px",
//                 height: "36px",
//                 fontWeight: "600",
//                 color: "#050505",
//               }}
//               onClick={() => setDiscardModalShow(true)}
//             >
//               Discard
//             </button>

//             <button
//               style={{
//                 backgroundColor: "#0866FF",
//                 borderRadius: "6px",
//                 marginRight: "10px",
//                 width: "185px",
//                 height: "36px",
//                 color: "white",
//               }}
//               onClick={
//                 selectedFile ? handleSharePhotoStory : handleShareTextStory
//               }
//             >
//               Share to Story
//             </button>
//           </div>
//         )}
//       </div>

//       {/* wrapper around TopRightIcons */}
//       <div
//         style={{
//           position: "fixed",
//           top: "10px",
//           right: "10px",
//           zIndex: 10000,
//         }}
//       >
//         <TopRightIcons />
//       </div>

//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         {selectedFile ? (
//           <PhotoStoryEditor
//             selectedFile={selectedFile}
//             openFileInput={() => modalFileInputRef.current?.click()}
//           />
//         ) : showTextStory ? (
//           <TextStoryEditor
//             storyText={storyText}
//             setStoryText={setStoryText}
//             selectedBackground={selectedBackground}
//             backgrounds={backgrounds}
//             setSelectedBackground={setSelectedBackground}
//           />
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "20px",
//               width: "100%",
//               height: "100vh",
//             }}
//           >
//             {/* Photo story card */}
//             <div
//               style={{
//                 position: "relative",
//                 backgroundImage:
//                   "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
//                 backgroundPosition: "0 0",
//                 backgroundSize: "auto",
//                 width: "220px",
//                 height: "330px",
//                 backgroundRepeat: "no-repeat",
//                 display: "inline-block",
//               }}
//               onClick={() => modalFileInputRef.current?.click()}
//               className="create_story_card"
//             >
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "white",
//                   width: "44px",
//                   height: "44px",
//                   bottom: "64%",
//                   left: "50%",
//                   transform: "translate(-50%, 50%)",
//                   position: "absolute",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/yK/r/RtDIYQE_bF3.png')",
//                     backgroundPosition: "0px -230px",
//                     backgroundSize: "auto",
//                     width: "20px",
//                     height: "20px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                     bottom: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, 50%)",
//                   }}
//                 ></div>
//               </div>

//               {/* Text overlay */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, 50%)",
//                   textAlign: "center",
//                   color: "#fff",
//                   fontWeight: "700",
//                   fontSize: "13.3px",
//                   textShadow: "0 0 5px rgba(0,0,0,0.5)",
//                 }}
//               >
//                 Create a Photo Story
//               </div>
//             </div>

//             {/* Text story card */}
//             <div
//               style={{
//                 position: "relative",
//                 backgroundImage:
//                   "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
//                 backgroundPosition: "0px -331px",
//                 backgroundSize: "auto",
//                 width: "220px",
//                 height: "330px",
//                 backgroundRepeat: "no-repeat",
//                 display: "inline-block",
//               }}
//               className="create_story_card"
//               onClick={() => setShowTextStory(true)}
//             >
//               <div
//                 style={{
//                   borderRadius: "50%",
//                   padding: "8px",
//                   backgroundColor: "white",
//                   width: "44px",
//                   height: "44px",
//                   bottom: "64%",
//                   left: "50%",
//                   transform: "translate(-50%, 50%)",
//                   position: "absolute",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     backgroundImage:
//                       "url('https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/EBvutOuy0EA.png')",
//                     backgroundPosition: "0px -83px",
//                     backgroundSize: "auto",
//                     width: "20px",
//                     height: "20px",
//                     backgroundRepeat: "no-repeat",
//                     display: "inline-block",
//                     bottom: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, 50%)",
//                   }}
//                 ></div>
//               </div>
//               {/* Text overlay */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, 50%)",
//                   textAlign: "center",
//                   color: "#fff",
//                   fontWeight: "700",
//                   fontSize: "13.3px",
//                   textShadow: "0 0 5px rgba(0,0,0,0.5)",
//                 }}
//               >
//                 Create a Text Story
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <input
//         type="file"
//         accept="image/*"
//         ref={modalFileInputRef}
//         style={{ display: "none" }}
//         onChange={(e) => {
//           if (e.target.files && e.target.files[0]) {
//             setSelectedFile(URL.createObjectURL(e.target.files[0]));
//           }
//           // Reset input value so same file can be selected again
//           e.target.value = "";
//         }}
//       />

//       <DiscardConfirmationModal
//         show={discardModalShow}
//         resetStory={() => {
//           setSelectedFile(null);
//           setShowTextStory(false);
//           setStoryText("");
//           setSelectedBackground("#0866FF");
//         }}
//         onHide={() => setDiscardModalShow(false)}
//       />
//     </div>
//   );
// }

// export default CreateStory;





import React, { useRef, useState } from "react";
import "./CreateStory.css";
import { Button, Dropdown, Modal } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useUser } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";
import TopRightIcons from "../../Components/Layout/TopBar/FbTopRightIcons";
import axios from "axios";

function PhotoStoryEditor({ selectedFile }) {
  return (
    <div
      style={{
        width: "962px",
        height: "874px",
        borderRadius: "12px",
        backgroundColor: selectedFile ? "#fff" : "transparent",
        position: "relative",
        overflow: "hidden",
        padding: "20px 0px 10px 35px",
      }}
    >
      <span style={{ color: "#080809", fontWeight: "600", fontSize: "15px" }}>
        {selectedFile ? "Preview" : ""}
      </span>

      <div
        style={{
          width: "900px",
          height: "800px",
          borderRadius: "12px",
          backgroundColor: selectedFile ? "#000" : "transparent",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selectedFile && (
          <div
            style={{
              border: "1px solid white",
              width: "372px",
              height: "670px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              backgroundColor: "#2d2d2eff",
            }}
          >
            <img
              src={selectedFile}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {selectedFile && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "200px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          ></div>
        )}

        {selectedFile && (
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "20px",
              marginTop: "15px",
            }}
          >
            Your Story
          </div>
        )}
      </div>
    </div>
  );
}

function DiscardConfirmationModal({ show, onHide, resetStory }) {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4 style={{ textAlign: "center" }}>Discard story?</h4>
        <p style={{ textAlign: "center" }}>
          Are you sure you want to discard this story? Your progress will not be saved.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Continue Editing
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            resetStory();
            onHide();
          }}
        >
          Discard
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function TextStoryEditor({
  storyText,
  setStoryText,
  selectedBackground,
  backgrounds,
  setSelectedBackground,
}) {
  return (
    <div
      style={{
        width: "962px",
        height: "874px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        padding: "20px 0px 10px 35px",
      }}
    >
      <span style={{ color: "#080809", fontWeight: "600", fontSize: "15px" }}>
        Preview
      </span>

      <div
        style={{
          width: "900px",
          height: "800px",
          borderRadius: "12px",
          backgroundColor: selectedBackground,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "372px",
            height: "670px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            padding: "40px",
            position: "relative",
          }}
        >
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Start typing"
            style={{
              width: "100%",
              height: "auto",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "32px",
              fontWeight: "600",
              textAlign: "center",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              overflow: "hidden",
            }}
            maxLength={200}
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CreateStory() {
  const navigate = useNavigate();
  const { user, profilePic } = useUser();
  const API_BASE_URL = "http://localhost:8082/Org_Management_java/api";

  const defaultPic =
    "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

  const [showTextStory, setShowTextStory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actualFile, setActualFile] = useState(null); // Store the actual file object
  const modalFileInputRef = useRef(null);
  const [discardModalShow, setDiscardModalShow] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("#0866FF");
  const [isUploading, setIsUploading] = useState(false);

  const backgrounds = [
    "#0866FF", "#E74694", "#F35369", "#FA7E1E", "#FFBA00", "#44BEC7",
    "#FFC0CB", "#9B59B6", "#1ABC9C", "#E67E22", "#95A5A6", "#34495E",
    "#16A085", "#8E44AD", "#2C3E50", "#F39C12",
  ];

  const getProfilePicBlob = async () => {
    try {
      const response = await fetch(profilePic || defaultPic);
      const blob = await response.blob();
      return new File([blob], "profile.jpg", { type: "image/jpeg" });
    } catch (error) {
      console.error("Error converting profile pic:", error);
      return null;
    }
  };

  const handleSharePhotoStory = async () => {
    if (!actualFile || !user?.id) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const profilePicBlob = await getProfilePicBlob();
      const formData = new FormData();
      
      formData.append("userId", user.id);
      formData.append("username", user.username);
      formData.append("profilePic", profilePicBlob);
      formData.append("storyFile", actualFile);
      formData.append("fileType", "image");

      console.log("Uploading photo story...");
      
      const response = await axios.post(`${API_BASE_URL}/stories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Story created successfully:", response.data);
      
      // Navigate back to home after successful upload
      navigate("/HomePage/facebook");
    } catch (error) {
      console.error("Error sharing photo story:", error);
      alert("Failed to create story: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleShareTextStory = async () => {
    if (!storyText.trim()) {
      alert("Please enter some text for your story");
      return;
    }

    setIsUploading(true);
    try {
      const profilePicBlob = await getProfilePicBlob();
      const formData = new FormData();
      
      formData.append("userId", user.id);
      formData.append("username", user.username);
      formData.append("profilePic", profilePicBlob);
      formData.append("storyText", storyText);
      formData.append("backgroundColor", selectedBackground);
      formData.append("fileType", "text");

      console.log("Uploading text story...");
      
      const response = await axios.post(`${API_BASE_URL}/stories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Story created successfully:", response.data);
      
      // Navigate back to home after successful upload
      navigate("/HomePage/facebook");
    } catch (error) {
      console.error("Error sharing text story:", error);
      alert("Failed to create story: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const resetStory = () => {
    setSelectedFile(null);
    setActualFile(null);
    setShowTextStory(false);
    setStoryText("");
    setSelectedBackground("#0866FF");
    navigate("/HomePage/facebook");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F2F4F7",
        display: "flex",
        zIndex: 9999,
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          width: "375px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div 
            className="fb-close-wrapper" 
            onClick={() => navigate("/HomePage/facebook")}
            style={{ cursor: "pointer" }}
          >
            <button className="fb-close-btn"></button>
          </div>

          <img
            src="https://www.facebook.com/images/fb_icon_325x325.png"
            alt="Facebook Logo"
            style={{ height: "40px", marginRight: "14px" }}
          />
        </div>

        <hr style={{ width: "100%", border: "none", height: "2px", backgroundColor: "#CED0D4" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontWeight: "700" }}>Your Story</h4>
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              style={{
                backgroundColor: "#E2E5E9",
                padding: "8px",
                borderRadius: "50px",
              }}
            >
              <img
                src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000"
                alt="settings"
                width={24}
                height={24}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>
                <h3>Settings</h3>
              </Dropdown.Header>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              marginTop: "25px",
            }}
          >
            <img
              src={profilePic || defaultPic}
              alt="profile"
              width={65}
              height={65}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <span style={{ fontSize: "17px", fontWeight: "600" }}>
                {user?.username}
              </span>
            </div>
          </div>
        </div>

        <hr
          style={{
            width: "100%",
            border: "none",
            height: "2px",
            backgroundColor: "#CED0D4",
            margin: "25px 0 20px 0",
          }}
        />

        {showTextStory && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <DropdownButton
                id="dropdown-variants-Secondary"
                variant="light"
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px" }}>Aa</span>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>Clean</span>
                  </div>
                }
                style={{ width: "328px" }}
              >
                <Dropdown.Item href="#/action-1">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px" }}>Aa</span>
                    <span>Clean</span>
                  </div>
                </Dropdown.Item>
              </DropdownButton>
            </div>

            {/* Backgrounds */}
            <div
              style={{
                width: "328px",
                borderRadius: "8px",
                border: "1px solid #E2E5E9",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <span style={{ color: "grey", fontSize: "14px" }}>Backgrounds</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {backgrounds.map((bg, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedBackground(bg)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: bg,
                      cursor: "pointer",
                      border: selectedBackground === bg ? "3px solid #0866FF" : "2px solid #E2E5E9",
                      boxShadow: selectedBackground === bg ? "0 0 0 2px white" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bottom Buttons */}
        {(selectedFile || showTextStory) && (
          <div
            style={{
              width: "375px",
              height: "72px",
              bottom: "0",
              position: "fixed",
              backgroundColor: "#FFFFFF",
              left: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <button
              style={{
                backgroundColor: "#E2E5E9",
                borderRadius: "6px",
                marginRight: "10px",
                width: "140px",
                height: "36px",
                fontWeight: "600",
                color: "#050505",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDiscardModalShow(true)}
              disabled={isUploading}
            >
              Discard
            </button>

            <button
              style={{
                backgroundColor: isUploading ? "#ccc" : "#0866FF",
                borderRadius: "6px",
                marginRight: "10px",
                width: "185px",
                height: "36px",
                color: "white",
                border: "none",
                cursor: isUploading ? "not-allowed" : "pointer",
              }}
              onClick={selectedFile ? handleSharePhotoStory : handleShareTextStory}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Share to Story"}
            </button>
          </div>
        )}
      </div>

      {/* Top Right Icons */}
      <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 10000 }}>
        <TopRightIcons />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selectedFile ? (
          <PhotoStoryEditor selectedFile={selectedFile} />
        ) : showTextStory ? (
          <TextStoryEditor
            storyText={storyText}
            setStoryText={setStoryText}
            selectedBackground={selectedBackground}
            backgrounds={backgrounds}
            setSelectedBackground={setSelectedBackground}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              height: "100vh",
            }}
          >
            {/* Photo Story Card */}
            <div
              style={{
                position: "relative",
                backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
                backgroundPosition: "0 0",
                backgroundSize: "auto",
                width: "220px",
                height: "330px",
                backgroundRepeat: "no-repeat",
                cursor: "pointer",
              }}
              className="create_story_card"
              onClick={() => modalFileInputRef.current?.click()}
            >
              <div
                style={{
                  borderRadius: "50%",
                  padding: "8px",
                  backgroundColor: "white",
                  width: "44px",
                  height: "44px",
                  bottom: "64%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  position: "absolute",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yK/r/RtDIYQE_bF3.png')",
                    backgroundPosition: "0px -230px",
                    backgroundSize: "auto",
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    bottom: "50%",
                    left: "50%",
                    transform: "translate(-50%, 50%)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "13.3px",
                  textShadow: "0 0 5px rgba(0,0,0,0.5)",
                }}
              >
                Create a Photo Story
              </div>
            </div>

            {/* Text Story Card */}
            <div
              style={{
                position: "relative",
                backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
                backgroundPosition: "0px -331px",
                backgroundSize: "auto",
                width: "220px",
                height: "330px",
                backgroundRepeat: "no-repeat",
                cursor: "pointer",
              }}
              className="create_story_card"
              onClick={() => setShowTextStory(true)}
            >
              <div
                style={{
                  borderRadius: "50%",
                  padding: "8px",
                  backgroundColor: "white",
                  width: "44px",
                  height: "44px",
                  bottom: "64%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  position: "absolute",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/EBvutOuy0EA.png')",
                    backgroundPosition: "0px -83px",
                    backgroundSize: "auto",
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    bottom: "50%",
                    left: "50%",
                    transform: "translate(-50%, 50%)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "13.3px",
                  textShadow: "0 0 5px rgba(0,0,0,0.5)",
                }}
              >
                Create a Text Story
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        ref={modalFileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setActualFile(file); // Store actual file
            setSelectedFile(URL.createObjectURL(file)); // Store preview URL
          }
          e.target.value = "";
        }}
      />

      <DiscardConfirmationModal
        show={discardModalShow}
        resetStory={resetStory}
        onHide={() => setDiscardModalShow(false)}
      />
    </div>
  );
}

export default CreateStory;