import { useGetAllForumMessagesByForumIdQuery } from "../forumMessageApi";
import MessageInput from "./messageInput";
import { useGetAllUsersQuery } from "../../users/usersApi";
import { useRef, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import he from "date-fns/locale/he";
import socket from "../../../app/socket";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import FilePreviewMessage from "./FilePreviewMessage";
import MessageActions from "./MessageActions";
import { Forum } from "../../forum/forumTypes";
import ForumCard from "../../forum/components/ForumCard"
import { backdropClasses } from "@mui/material";
import LinkPreview from "./LinkPreview";
import { ForumMessage } from "../forumMessageTypes";
import { MessageSquareMore } from "lucide-react";
import { ms } from "date-fns/locale";
import React from "react";




interface ForumMessagesProps {
  forum: Forum
  onSelectForumMessage: (ForumMessage: ForumMessage) => void;
}

export default function ForumMessages({ forum, onSelectForumMessage }: ForumMessagesProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // בדיקה אם נלחץ בתוך דיאלוג של MUI
      const isInMuiDialog = target.closest(".MuiDialog-root");
      if (isInMuiDialog) return;

      if (cardRef.current && !cardRef.current.contains(target)) {
        setShowOptions(false);
      }
    };


    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);



  useEffect(() => {
    if (forum?.id) {
      socket.emit("joinForum", forum.id);
      console.log("📥 הצטרפת לחדר פורום", forum.id);

      return () => {
        socket.emit("leaveForum", forum.id);
        console.log("📤 עזבת את חדר פורום", forum.id);
      };
    }
  }, [forum?.id]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleDraftChange = (forumId: string, newContent: string) => {
    setDrafts((prev) => ({
      ...prev,
      [forumId]: newContent,
    }));
  };

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { data: users = [] } = useGetAllUsersQuery();

  const option = () => {
    setShowOptions((prev) => !prev);
  }

  const getSenderName = (id: string): string => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "משתמש לא ידוע";
  };
  const openTread = (msg: ForumMessage) => {
    onSelectForumMessage(msg)
  }


  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useGetAllForumMessagesByForumIdQuery(forum.id);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <p>טוען הודעות...</p>;
  if (error) return <p>שגיאה בטעינת ההודעות</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "92vh" }}>
      <div
        // style={{
        //   padding: "1rem",
        //   height: "100px",
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   flexDirection: "column",
        //   borderBottom: "1px solid #cccccc",
        //   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        // }}
      >
        <div ref={cardRef} style={{ backgroundColor: over || showOptions ? "#d1d1d1" : "transparent", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
          <div
            onClick={option}
            onMouseEnter={() => setOver(true)}
            onMouseLeave={() => setOver(false)}
            style={{ margin: 0, cursor: "pointer" }}
          >
            <h2 style={{ margin: 0 }}>
              {forum.title}▼
            </h2>
            <div style={{ fontSize: "15px" }}>{forum.description}</div>
          </div>


          {showOptions && (
            <div
              style={{
                position: "absolute",
                right: "70%",
                zIndex: 20,
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "20px",
              }}
            >
              <ForumCard forum={forum} user={user!} />
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          width: "98%",
          flexGrow: 1,
          marginBottom: "1rem",
          overflowY: "scroll",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[...messages]
          .sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime())
          .map((msg, index, arr) => {
            const isOwnMessage = msg.sender_id === currentUser?.id;
            const senderName = getSenderName(msg.sender_id);
            const firstLetter = senderName.trim().charAt(0);

            const previousMsg = index > 0 ? arr[index - 1] : null;
            const isSameSender = previousMsg?.sender_id === msg.sender_id;

            const timeDiff = previousMsg
              ? Math.abs(new Date(msg.sent_at).getTime() - new Date(previousMsg.sent_at).getTime())
              : Infinity;

            const groupWithPrevious = isSameSender && timeDiff < 60000;
            const marginTop = !groupWithPrevious ? "1rem" : "0.25rem";

            const urlMatch = msg.content?.match(/https?:\/\/[^\s<"]+/);
            const previewUrl = urlMatch?.[0];

            return (
              <React.Fragment key={msg.id}>
            {msg.is_deleted ? (
  <div
    key={msg.id}
    style={{
      fontStyle: "italic",
      color: "#888",
      backgroundColor: "#eeededff",
      borderRadius: "16px",
      padding: "0.75rem 1rem",
      fontSize: "0.95rem",
      direction: "rtl",
      maxWidth: "60%",
      margin: "8px 36px 8px auto", // זה מצמיד לימין
      textAlign: "right"
    }}
  >
    ההודעה נמחקה על ידי המשתמש
  </div>
) : (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  width: "100%",
                  marginTop,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isOwnMessage ? "row" : "row-reverse",
                    alignItems: "flex-start",
                    gap: "10px",
                    direction: "rtl",
                    maxWidth: "75%",
                  }}
                >
                  {!isOwnMessage && (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: !groupWithPrevious ? "#442063" : "transparent",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        flexShrink: 0,
                        order: 2,
                      }}
                    >
                      {!groupWithPrevious ? firstLetter : null}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", alignItems: isOwnMessage ? "flex-end" : "flex-start" }}>
                    {!groupWithPrevious ? (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#666",
                          marginBottom: "0.2rem",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "5px",
                        }}
                      >
                        {!isOwnMessage && <strong>{senderName}</strong>}
                        <span>
                          {formatDistanceToNow(new Date(msg.sent_at), {
                            addSuffix: true,
                            locale: he,
                          })}
                          {msg.is_Edited ? " • נערכה" : ""}
                        </span>
                      </div>
                    ):(
                      <div
    style={{
      fontSize: "0.75rem",
      color: "#666",
      marginBottom: "0.2rem",
      display: "flex",
      justifyContent: "flex-start",
      gap: "5px",
    }}
  >
    {msg.is_Edited && (
      <span>
        {formatDistanceToNow(new Date(msg.sent_at), {
          addSuffix: true,
          locale: he,
        })} • נערכה
      </span>
    )}
  </div>
                    )}

                    <div
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                      style={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      
                      {msg.content?.trim().replace(/<[^>]*>/g, "").length > 0 && (
                        <div
                          style={{
                            backgroundColor: isOwnMessage ? "#e0f7fa" : "#ffffff",
                            color: "#000",
                            borderRadius: isOwnMessage ? "18px 18px 18px 0px" : "18px 18px 0px 18px",
                            padding: "0.75rem 1rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            fontFamily: "Arial, sans-serif",
                            fontSize: "1rem",
                            textAlign: "right",
                            direction: "rtl",
                          }}
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                      )}
                      {msg.ammuntOffThteadMessegase > 0 && (
                        <button
                          onClick={() => openTread(msg)}
                          style={{
                            textAlign: "center",
                            marginTop: "8px",
                            padding: "6px 12px",
                            backgroundColor: "transparent",
                            borderRadius: "15px",
                            color: "#8a8a8aff",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                          }}>
                          ◞ {msg.ammuntOffThteadMessegase} תשובות
                        </button>)}
                      {previewUrl && <LinkPreview url={previewUrl} />}
                      {msg.file_url && msg.file_name && (
                        <FilePreviewMessage fileUrl={msg.file_url} fileName={msg.file_name} />
                      )}
                      {!isOwnMessage && hoveredMessageId === msg.id && (msg.ammuntOffThteadMessegase > 0 ||!(index === arr.length - 1)) &&(
                        <div
                          style={{
                            position: "absolute",
                            top: "-20px",
                            right: "80%",
                            transform: "translateX(50%)",
                            //width: "80px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            padding: "0.3rem 0.6rem",
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.5rem",
                            zIndex: 10,

                          }}
                        >
                          <div
                            onClick={() => openTread(msg)}
                            style={{
                              marginTop: "4px",
                              cursor: "pointer",
                              fontSize: "0.9rem"
                            }}>
                            <MessageSquareMore size={20} />
                          </div>

                        </div>)}
                      {!isOwnMessage && index === arr.length - 1 && msg.ammuntOffThteadMessegase === 0 && (
                        <button
                          onClick={() => openTread(msg)}
                          style={{
                            marginTop: "8px",
                            padding: "6px 12px",
                            backgroundColor: "transparent",
                            // border: "1px solid #007bff",
                            borderRadius: "15px",
                            color: "#bdaacf",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#bdaacf";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#bdaacf";
                          }}
                        >
                          ◞שליחת תשובה
                        </button>
                      )}


                      {isOwnMessage && hoveredMessageId === msg.id && editingMessageId !== msg.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-20px",
                            left: "80%",
                            transform: "translateX(-50%)",
                            width: "80px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            padding: "0.3rem 0.6rem",
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.5rem",
                            zIndex: 10,

                          }}
                        >
                          <MessageActions message={msg} onUpdateDone={refetch} setEditing={() => setEditingMessageId(msg.id)} />
                          <div
                            onClick={() => openTread(msg)}
                            style={{
                              marginTop: "4px",
                            }}
                          >
                            <MessageSquareMore size={20} />
                          </div>
                        </div>
                      )}
                    </div>

                    {isOwnMessage && editingMessageId === msg.id && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <MessageActions message={msg} onUpdateDone={() => { refetch(); setEditingMessageId(null); }} isEditingOnly />
                      </div>
                    )}


                  </div>
                </div>
              </div>
)}

            </React.Fragment >

            );
          })}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ paddingTop: "1rem" }}>
        <MessageInput
          forumId={forum.id}
          initialDraft={drafts[forum.id] || ""}
          onDraftChange={(content) => handleDraftChange(forum.id, content)}
          onMessageSent={() => {
            handleDraftChange(forum.id, "");
            refetch();
          }}
        />

      </div>
    </div>
  );
}



