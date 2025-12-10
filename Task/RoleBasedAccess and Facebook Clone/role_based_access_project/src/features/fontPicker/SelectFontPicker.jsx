// import React, { useState, useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { FONT_LIST } from "../../utils/fonts";

// export default function SelectFontPicker({ selectedFont, setSelectedFont,selectedFontWeight,setSelectedFontWeight }) {
//   const [open, setOpen] = useState(false);
//   const buttonRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const [position, setPosition] = useState({ top: 0, left: 0 });

//   // calculate position of dropdown
//   useEffect(() => {
//     if (open && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setPosition({
//         top: rect.bottom + 4,
//         left: rect.left
//       });
//     }
//   }, [open]);

//   // close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target) &&
//         !buttonRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <>
//       {/* button stays in modal */}
//       <button
//         ref={buttonRef}
//         onClick={() => setOpen(!open)}
//         style={{
//           padding: "8px 12px",
//           background: "#fff",
//           border: "1px solid #ccc",
//           borderRadius: "6px",
//         }}
//       >
//         {selectedFont || "Choose Font"}
//       </button>

//       {/* DROPDOWN PORTAL */}
//       {open &&
//         ReactDOM.createPortal(
//           <div
//             ref={dropdownRef}
//             style={{
//               position: "fixed",
//               top: position.top,
//               left: position.left,
//               width: "260px",
//               maxHeight: "300px",
//               overflowY: "auto",
//               background: "white",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//               zIndex: 9999999,
//               borderRadius: "8px"
//             }}
//           >
//             {FONT_LIST.map((font) => (
//               <div
//                 key={font}
//                 onClick={() => {
//                   setSelectedFont(font);
//                   setOpen(false);
//                 }}
//                 style={{
//                   padding: "10px",
//                   cursor: "pointer",
//                   fontFamily: font,
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 {font}
//               </div>
//             ))}
//           </div>,
//           document.body
//         )}
//     </>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ChevronDown, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { FONT_LIST } from "../../utils/fonts";

const FONT_SIZES = [
  "12px", "14px", "16px", "18px", "20px", "24px", 
  "28px", "32px", "36px", "40px", "48px", "56px", "64px", "72px"
];

const FONT_WEIGHTS = [
  { label: "Thin", value: "100" },
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" }
];

function Dropdown({ label, options, selected, onSelect, width = "140px", renderOption }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        style={{
          padding: "6px 10px",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          fontSize: "13px",
          width: width,
          justifyContent: "space-between",
          height: "32px"
        }}
      >
        <span style={{ 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap",
          fontSize: "13px"
        }}>
          {selected || label}
        </span>
        <ChevronDown size={14} />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: width,
              maxHeight: "250px",
              overflowY: "auto",
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 9999999,
              borderRadius: "6px",
              border: "1px solid #ddd"
            }}
          >
            {options.map((option, index) => {
              const value = typeof option === "string" ? option : option.value;
              const displayLabel = typeof option === "string" ? option : option.label;
              
              return (
                <div
                  key={index}
                  onClick={() => {
                    onSelect(value);
                    setOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: index < options.length - 1 ? "1px solid #eee" : "none",
                    backgroundColor: selected === value ? "#f0f0f0" : "transparent",
                    fontSize: "13px"
                  }}
                  onMouseEnter={(e) => {
                    if (selected !== value) {
                      e.currentTarget.style.backgroundColor = "#f8f8f8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== value) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {renderOption ? renderOption(option) : displayLabel}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

function IconButton({ icon: Icon, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "32px",
        height: "32px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        background: active ? "#c7c7c7ff" : "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = "#f8f8f8";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = "#fff";
        }
      }}
    >
      <Icon size={16} color={active ? "#080809" : "#666"} />
    </button>
  );
}

export default function SelectFontPicker({ 
  selectedFont, 
  setSelectedFont,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontWeight, 
  setSelectedFontWeight,
  selectedTextAlign,
  setSelectedTextAlign,
  selectedIsBold,
  setSelectedIsBold,
  selectedIsItalic,
  setSelectedIsItalic
}) {
  return (
    <div style={{ 
      display: "flex", 
      gap: "6px", 
      alignItems: "center",
      flexWrap: "wrap"
    }}>
      {/* Font Family */}
      <Dropdown
        label="Font"
        options={FONT_LIST}
        selected={selectedFont}
        onSelect={setSelectedFont}
        width="150px"
        renderOption={(font) => (
          <span style={{ fontFamily: font }}>{font}</span>
        )}
      />

      {/* Font Size */}
      <Dropdown
        label="Size"
        options={FONT_SIZES}
        selected={selectedFontSize}
        onSelect={setSelectedFontSize}
        width="80px"
      />

      {/* Font Weight */}
      <Dropdown
        label="Weight"
        options={FONT_WEIGHTS}
        selected={selectedFontWeight}
        onSelect={setSelectedFontWeight}
        width="120px"
        renderOption={(weight) => (
          <span style={{ fontWeight: weight.value }}>
            {weight.label}
          </span>
        )}
      />

      {/* Bold */}
      <IconButton
        icon={Bold}
        active={selectedIsBold}
        onClick={() => {
          setSelectedIsBold(!selectedIsBold);
          setSelectedFontWeight(selectedIsBold ? "400" : "700");
        }}
        title="Bold"
      />

      {/* Italic */}
      <IconButton
        icon={Italic}
        active={selectedIsItalic}
        onClick={() => setSelectedIsItalic(!selectedIsItalic)}
        title="Italic"
      />

      {/* Text Align */}
      <div style={{ display: "flex", gap: "2px" }}>
        <IconButton
          icon={AlignLeft}
          active={selectedTextAlign === "left"}
          onClick={() => setSelectedTextAlign("left")}
          title="Align Left"
        />
        <IconButton
          icon={AlignCenter}
          active={selectedTextAlign === "center"}
          onClick={() => setSelectedTextAlign("center")}
          title="Align Center"
        />
        <IconButton
          icon={AlignRight}
          active={selectedTextAlign === "right"}
          onClick={() => setSelectedTextAlign("right")}
          title="Align Right"
        />
      </div>
    </div>
  );
}