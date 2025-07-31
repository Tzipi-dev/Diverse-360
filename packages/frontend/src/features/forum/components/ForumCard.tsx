import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "features/users/usersApi";
import EditForum from "./EditForum";
import DeleteForm from "./deleteForm";
import Modal from "./Modal";
import { Forum } from "../forumTypes";
import {User} from "../../users/usersTypes"

interface ForumOptionsProps {
  forum: Forum;
  user: User
}

const ForumOptions: React.FC<ForumOptionsProps> = ({
  forum,
  user
}) => {
  const [showPopup, setShowPopup]=useState(false)
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
const [go1,setGo1]=useState(false)
const [go2,setGo2]=useState(false)
const [go3,setGo3]=useState(false)
  const { data: users = [] } = useGetAllUsersQuery();
  

  const creator = users.find((u) => u.id === forum.created_by_user_id);
  const creatorName = creator
    ? `${creator.firstName} ${creator.lastName}`
    : "משתמש לא ידוע";

      const getSenderName = (id: string): string => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "משתמש לא ידוע";
  };

 const styles = {
    popupOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    popupContent: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      width: "400px",
      direction: "rtl" as const,

    },
    closeButton: {
      marginTop: "1rem",
      background: "#442063",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };


  return (
    <div style={{boxShadow:" 0 4px 10px rgba(0, 0, 0, 0.3)",padding: 0 }}>
      <div style={{ display: "flex", gap: 0 , flexDirection: "column"}}>
        <button style={{color: "black", width:"100px", height:"20px",borderRadius:"0px",backgroundColor:go1?"#d8cee5":"white"}} 
        onClick={() =>{ setEditing(true)}}
        onMouseEnter={() => setGo1(true)}
        onMouseLeave={() => setGo1(false)}
        >עריכה</button>
        <button  style={{color: "black",width:"100px", height:"20px",borderRadius:"0px",backgroundColor:go2?"#d8cee5":"white"}} 
         onClick={() => setDeleting(true)}
        onMouseEnter={() => setGo2(true)}
        onMouseLeave={() => setGo2(false)}
         >מחיקה</button>
        <button  style={{color: "black",width:"100px", height:"20px",borderRadius:"0px",backgroundColor:go3?"#d8cee5":"white"}} 
        onClick={() => setShowPopup(true)}
        onMouseEnter={() => setGo3(true)}
        onMouseLeave={() => setGo3(false)}
        >פרטים</button>
      </div>

              {showPopup && (
          <div style={styles.popupOverlay} onClick={() => setShowPopup(false)}>
            <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ textAlign: "center" }}>{forum.title}</h2>
              <p><strong>תיאור:</strong> {forum.description}</p>
              <p><strong>נוצר ע״י:</strong> {getSenderName(forum.created_by_user_id)}</p>
              <p><strong>נוצר בתאריך:</strong> {new Date(forum.created_at).toLocaleString()}</p>
              <p><strong>עודכן לאחרונה:</strong> {new Date(forum.updated_at).toLocaleString()}</p>
              <button style={styles.closeButton} onClick={() => setShowPopup(false)}>סגור</button>
            </div>
          </div>
        )}

      {editing && (
        <Modal isOpen onClose={() => setEditing(false)}>
          <EditForum
            forum={forum}
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
            userAcademicCycleId={user.email}
            currentUserId={user.id}
            isAdmin={forum.created_by_user_id===user.id? true:false}
          />
        </Modal>
      )}

{deleting && (
  <div onClick={(e) => e.stopPropagation()}>
    <DeleteForm
      forum={forum}
      currentUserId={user.id}
      isAdmin={forum.created_by_user_id === user.id}
      onsave={() => setDeleting(false)}
    />
    </div>
)}
    </div>
  );
};

export default ForumOptions;
