import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import {
//   useDeleteForumMessageMutation,
//   useUpdateForumMessageMutation,
// } from "../forumMessageApi";
// import { ForumMessage } from "../forumMessageTypes";
import { Edit, Trash2 } from "lucide-react";
import{ useUpdateThreadMessageMutation,
  useDeleteThreadMessageMutation,} from "./ThreadMessagesApi";
import { ThreadMessagesTypes } from "./ThreadMessagesTypes";
import { useUpdateForumMessageMutation } from "features/forumMessage/forumMessageApi";

interface MessageActionsProps {
  forumMessageId: string;
  ammuntOffThteadMessegase: number;
  message: ThreadMessagesTypes;
  onUpdateDone: () => void; 
  setEditing?: () => void;
  isEditingOnly?: boolean;
  setAmmuontOffThteadMessegase :(ammunt:number) => void;
}


export default function ThreadMessagActions({
  forumMessageId,
  ammuntOffThteadMessegase,
  message,
  onUpdateDone,
  setEditing,
  isEditingOnly,
  setAmmuontOffThteadMessegase,
}: MessageActionsProps) {

      const buttonHoverStyle: React.CSSProperties = {
width:"50px", backgroundColor: "#f0f0f5", border: "2px solid purple",borderRadius: "20px",padding: "0.5rem 1rem",color: "purple", fontSize: "1rem", cursor: "pointer",
};
  const [deleteThreadMessage] = useDeleteThreadMessageMutation();
  const [updateThreadMessage] = useUpdateThreadMessageMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isHovered1, setIsHovered1] = React.useState(false);
const [updateForumMessage] = useUpdateForumMessageMutation();
const [ammuntOffThteadMessegase2, setAmmuntOffThteadMessegase2] = useState(ammuntOffThteadMessegase);
const editableRef = useRef<HTMLDivElement>(null);

const contentEditableStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "60px", // שורה אחת
  maxHeight: "150px", // בערך 3 שורות
  overflowY: "auto", // גלילה מעבר לזה
  fontSize: "1rem",
  fontFamily: "Arial, sans-serif",
  padding: "0.5rem 1rem",
  borderRadius: "18px",
  border: "1px solid #ccc",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
  outline: "none",
  backgroundColor: "rgba(0, 0, 0, 0)",
  color: "#000",
  lineHeight: "1.4",
  whiteSpace: "pre-wrap", // חשוב: מאפשר ירידת שורה
  wordBreak: "break-word", // מונע גלילה לצדדים
overflowWrap: "break-word", // שובר מילים ארוכות


};
useEffect(() => {
  setAmmuntOffThteadMessegase2(ammuntOffThteadMessegase);
}, [message.id, ammuntOffThteadMessegase]);

const handleUpdateAmmuont = async () => {
  const updatedAmmunt = ammuntOffThteadMessegase2 - 1;
  setAmmuntOffThteadMessegase2(updatedAmmunt);
  await updateForumMessage({ id: forumMessageId, ammuntOffThteadMessegase: updatedAmmunt });
  setAmmuontOffThteadMessegase(updatedAmmunt);
};
useEffect(() => {
  if (editableRef.current && editableRef.current.innerHTML.trim() === "") {
    editableRef.current.innerHTML = "<br>";
  }
}, []);


useEffect(() => {
  if (editableRef.current) {
    editableRef.current.innerHTML = message.content;
  }
}, [message.content]);


  const handleDelete = async () => {
    await deleteThreadMessage(message.id);
    setShowConfirm(false);
    handleUpdateAmmuont();
    onUpdateDone();
    
  };

  const handleUpdate = async () => {
    await updateThreadMessage({ id: message.id, content: newContent });
    setIsEditing(false);
    onUpdateDone();
  };


  // מודל הודעת
  const modal = showConfirm
    ? ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              minWidth: "300px",
              maxWidth: "90vw",
              animation: "scaleIn 0.3s ease",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "1.2rem", fontSize: "1.1rem" }}>
              את בטוחה שאת רוצה למחוק את ההודעה?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  background: "#eee",
                  border: "1px solid #888",
                  minWidth: "80px",
                  cursor: "pointer",
                }}
              >
                ביטול
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  backgroundColor: "#5b2a83",
                  color: "white",
                  border: "none",
                  minWidth: "80px",
                  cursor: "pointer",
                }}
              >
                מחק
              </button>
            </div>
          </div>
          <style>
            {`
              @keyframes scaleIn {
                0% { transform: scale(0.9); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>,
        document.body
      )
    : null;

  // ----- תצוגה של עריכה -----
if (isEditingOnly) {
  const isSaveDisabled =
    newContent.replace(/<br\s*\/?>/gi, "").replace(/&nbsp;|\s/g, "").trim() === ""|| newContent.trim() === message.content.trim();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "400px",
      }}
    >
<div
  contentEditable
  ref={editableRef}
  onInput={(e) => setNewContent(e.currentTarget.innerHTML)}
  style={contentEditableStyle}
/>



      <div
        style={{
          display: "flex",
         justifyContent:"end",
          gap: "0.5rem",
        }}
      >
        <button
          style={
            !isHovered
              ? {
                  width: "50px",
                  backgroundColor: "white",
                  border: "2px solid purple",
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  color: "purple",
                  fontSize: "1rem",
                  cursor: "pointer",
                }
              : buttonHoverStyle
          }
          onClick={onUpdateDone}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          ביטול
        </button>

        <button
          disabled={isSaveDisabled}
          style={{
            ...(!isHovered1
              ? {
                
                  width: "50px",
                  backgroundColor: "white",
                  border: "2px solid purple",
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  color: "purple",
                  fontSize: "1rem",
                  cursor: isSaveDisabled ? "not-allowed" : "pointer",
                  opacity: isSaveDisabled ? 0.5 : 1,
                }
              : buttonHoverStyle),
          }}
          onClick={handleUpdate}
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
        >
          שמירה
        </button>
      </div>
      {modal}
    </div>
  );
}


  // ----- תצוגה רגילה -----
  return (
    <>
 
    
        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
          <Edit size={20} color="#333" style={{ cursor: "pointer" }}  onClick={setEditing} />
          <Trash2 size={20} color="#d32f2f" style={{ cursor: "pointer" }} onClick={() => setShowConfirm(true)} />
        </div>
    
      {modal}
    </>
  );
}

const textareaStyle: React.CSSProperties = {
    width: "100%", 
  height: "50px",
  fontSize: "1rem",
  fontFamily: "Arial, sans-serif",
  padding: "0.5rem 1rem",
  borderRadius: "18px",
  border: "1px solid #ccc",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
  resize: "none",
  outline: "none",
  direction: "rtl",
  textAlign: "right",
  backgroundColor: "rgba(0, 0, 0, 0)",
  color: "#000",
  lineHeight: "1.4",
};
