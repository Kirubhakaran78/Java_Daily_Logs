import React, { useRef, useState } from 'react'
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import './StoryView.css';
import TopRightIcons from '../../Components/Layout/TopBar/FbTopRightIcons';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import './CreateStory.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';


function PhotoStoryEditor({ selectedFile }) {
  return (

    <div style={{
      width: "962px",
      height: "874px",
      borderRadius: "12px",
      backgroundColor: selectedFile ? "#fff" : "transparent",
      position: "relative",
      overflow: "hidden",
      padding: "20px 0px 10px 35px",
      // padding:"56px 24px 32px",
    }}>

      <span style={{ color: "#080809", fontWeight: "600", fontSize: "15px" }}> {selectedFile ? "Preview" : ""}</span>

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

        {/* AFTER SELECTING → show image centered */}
        {selectedFile && (
          <div style={{ border: "1px solid white", width: "372px", height: "670px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", backgroundColor: "#2d2d2eff" }}>
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

        {/* SHOW GRADIENT ONLY AFTER IMAGE SELECTED */}
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

        {/* Caption text */}
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
          }} setTimeout
        >
          Discard
        </Button>
      </Modal.Footer>
    </Modal >
  );
}




function CreateStory({ close }) {

  //show the text story creation area
  const [showTextStory, setShowTextStory] = useState(false);

  //selected file
  const [selectedFile, setSelectedFile] = useState(null);

  //selected Text
  const [selectedText, setSelectedText] = useState(null);

  //to open the file input from home page
  const modalFileInputRef = useRef(null);

  //discard confirmation modal state
  const [discardModalShow, setDiscardModalShow] = useState(false);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F2F4F7",
      display: "flex",
      zIndex: 9999
    }}>
      {/* Left Sidebar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          width: "375px",
          height: "100vh", overflowY: "auto"
        }}

      >
        {/* close button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

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
        }} />


        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontWeight: "700" }}>Your Story</h4>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" style={{ backgroundColor: "#E2E5E9", padding: "8px", borderRadius: "50px" }}>

              <img src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000" alt="settings" width={24} height={24}

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
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "25px" }}>

            <img src={fb_profile} alt='fb_profile pic' width={65} height={65} style={{ borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}></img>

            <div >
              <span style={{ fontSize: "17px", fontWeight: "600" }}>Peter</span>

            </div>

          </div>
        </div>

        {/* HR Line */}
        <hr style={{
          width: "100%",
          border: "none",
          height: "2px",
          backgroundColor: "#CED0D4",
          margin: "25px 0 20px 0"
        }} />


        {/* {selectedText && ( */}

        <div style={{marginBottom:"20px"}}>
          <DropdownButton id="dropdown-variants-Secondary" variant="Secondary" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Clean</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Casual</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Fancy</Dropdown.Item>
            <Dropdown.Item href="#/action-4">Headline</Dropdown.Item>
          </DropdownButton>
        </div>
        {/* Backgrounds */}

        <div style={{ width: "328px", height: "235px", borderRadius: "8px", border: "1px solid #E2E5E9" ,padding:"10px"}} >

          <span style={{ color: "grey" }}>Backgrounds</span>


        </div>

        {/* Add music */}
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "10px", padding: "8px" }}
          className="create_story_left_Options"
        >

          <div style={{
            borderRadius: "50%", padding: "8px", backgroundColor: "#E2E5E9", width: "44px", height: "44px", display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div style={{
              backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/QHXEIFF6IuS.png')",
              backgroundPosition: "0px -351px",
              backgroundSize: "auto",
              width: "24px",
              height: "24px",
              backgroundRepeat: "no-repeat",
              display: "inline-block",
            }}>
            </div>

          </div>
          <span style={{ fontWeight: "600" }}>Add music</span>
        </div>

        {/* )} */}

        {selectedFile && (
          <>
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "10px", padding: "8px" }}
              className="create_story_left_Options"
            >
              {/* add text */}
              <div style={{
                borderRadius: "50%", padding: "8px", backgroundColor: "#E2E5E9", width: "44px", height: "44px", display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <div style={{
                  backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/EBvutOuy0EA.png')",
                  backgroundPosition: "0px -83px",
                  backgroundSize: "auto",
                  width: "24px",
                  height: "24px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                }}>
                </div>

              </div>
              <span style={{ fontWeight: "600" }}>Add Text</span>

            </div>

            {/* Add music */}
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "10px", padding: "8px" }}
              className="create_story_left_Options"
            >

              <div style={{
                borderRadius: "50%", padding: "8px", backgroundColor: "#E2E5E9", width: "44px", height: "44px", display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <div style={{
                  backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/QHXEIFF6IuS.png')",
                  backgroundPosition: "0px -351px",
                  backgroundSize: "auto",
                  width: "24px",
                  height: "24px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                }}>
                </div>

              </div>
              <span style={{ fontWeight: "600" }}>Add music</span>
            </div>

            {/* Alternative text */}
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "10px", padding: "8px" }}
              className="create_story_left_Options"
            >

              <div style={{
                borderRadius: "50%", padding: "8px", backgroundColor: "#E2E5E9", width: "44px", height: "44px", display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <div style={{
                  backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/ya/r/I1p1ysN2ANR.png')",
                  backgroundPosition: "0px -25px",
                  backgroundSize: "auto",
                  width: "24px",
                  height: "24px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                }}>
                </div>

              </div>
              <span style={{ fontWeight: "600" }}>Alternative text</span>
            </div>
          </>
        )}

        {/* Bottom card */}
        {selectedFile && (
          <div style={{
            width: "375px", height: "72px", bottom: "0", position: "fixed", backgroundColor: "#FFFFFF", left: "0", display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)"
          }}>

            <button style={{
              backgroundColor: "#E2E5E9", borderRadius: "6px", marginRight: "10px", width: "140px", height: "36px", fontWeight: "600", color: "#050505"
            }} onClick={() => setDiscardModalShow(true)}
            >
              Discard
            </button>

            <button style={{
              backgroundColor: "#0866FF", borderRadius: "6px", marginRight: "10px", width: "185px", height: "36px", color: "white"
            }}>
              Share to Story
            </button>

          </div>

        )}




      </div>

      {/* wrapper around TopRightIcons */}
      <div style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 10000
      }}>
        <TopRightIcons />
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>

        {selectedFile ? (

          <PhotoStoryEditor selectedFile={selectedFile}
            openFileInput={() => modalFileInputRef.current?.click()} />
        ) : (


          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            width: "100%",
            height: "100vh"
          }}>
            {/* Photo story card */}
            <div style={{
              position: "relative",
              backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
              backgroundPosition: "0 0",
              backgroundSize: "auto",
              width: "220px",
              height: "330px",
              backgroundRepeat: "no-repeat",
              display: "inline-block",

            }}
              onClick={() => modalFileInputRef.current?.click()}
              className='create_story_card'>



              <div style={{
                borderRadius: "50%", padding: "8px", backgroundColor: "white", width: "44px", height: "44px", bottom: "64%",
                left: "50%",
                transform: "translate(-50%, 50%)", position: "absolute",
              }}>
                <div style={{
                  position: "absolute",
                  backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yK/r/RtDIYQE_bF3.png')",
                  backgroundPosition: "0px -230px",
                  backgroundSize: "auto",
                  width: "20px",
                  height: "20px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                }}>
                </div>
              </div>

              {/* Text overlay */}
              <div style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                transform: "translate(-50%, 50%)",
                textAlign: "center",
                color: "#fff",
                fontWeight: "700",
                fontSize: "13.3px",
                textShadow: "0 0 5px rgba(0,0,0,0.5)"
              }}>
                Create a Photo Story
              </div>
            </div>


            {/* Text story card */}
            <div style={{
              position: "relative",
              backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/OKGvh9pqBPm.png')",
              backgroundPosition: "0px -331px",
              backgroundSize: "auto",
              width: "220px",
              height: "330px",
              backgroundRepeat: "no-repeat",
              display: "inline-block"
            }}
              className='create_story_card'
              onClick={() => setShowTextStory(true)}
            >


              <div style={{
                borderRadius: "50%", padding: "8px", backgroundColor: "white", width: "44px", height: "44px", bottom: "64%",
                left: "50%",
                transform: "translate(-50%, 50%)", position: "absolute",
              }}>
                <div style={{
                  position: "absolute",
                  backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/EBvutOuy0EA.png')",
                  backgroundPosition: "0px -83px",
                  backgroundSize: "auto",
                  width: "20px",
                  height: "20px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                }}>
                </div>
              </div>
              {/* Text overlay */}
              <div style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                transform: "translate(-50%, 50%)",
                textAlign: "center",
                color: "#fff",
                fontWeight: "700",
                fontSize: "13.3px",
                textShadow: "0 0 5px rgba(0,0,0,0.5)"
              }}>
                Create a Text Story
              </div>
            </div>



          </div>

        )}
      </div>


      <input
        type="file"
        accept="image/*"
        ref={modalFileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedFile(URL.createObjectURL(e.target.files[0]));
          }
          // Reset input value so same file can be selected again
          e.target.value = '';
        }}
      />

      <DiscardConfirmationModal
        show={discardModalShow}
        resetStory={() => setSelectedFile(null)}
        onHide={() => setDiscardModalShow(false)}
      />

    </div>
  )
}

export default CreateStory
