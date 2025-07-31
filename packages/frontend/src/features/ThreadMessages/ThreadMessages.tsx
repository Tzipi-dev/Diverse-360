import { useGetAllUsersQuery } from "../users/usersApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import he from "date-fns/locale/he";
import { useGetAllThreadMessagesByForumMessageIdQuery } from "./ThreadMessagesApi";
import ThreadMessageInput from "./ThreadMessagesInput";
import ThreadMessagActions from "./ThreadMessagActions";
import LinkPreview from "../forumMessage/components/LinkPreview";

interface ThreadMessagesProps {
  forumMessage: {
    id: string;
    content: string;
    ammuntOffThteadMessegase: number;
  };
  onClose: () => void;
}

export default function ThreadMessages({ forumMessage, onClose }: ThreadMessagesProps) {
  const { data: users = [] } = useGetAllUsersQuery();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [ammuntOffThteadMessegase2, setAmmuntOffThteadMessegase2] = useState(forumMessage.ammuntOffThteadMessegase);

  useEffect(() => {
    setAmmuntOffThteadMessegase2(forumMessage.ammuntOffThteadMessegase);
  }, [forumMessage.id, forumMessage.ammuntOffThteadMessegase]);

  const {
    data: threadMessages = [],
    isLoading,
    error,
    refetch,
  } = useGetAllThreadMessagesByForumMessageIdQuery(forumMessage.id ?? "");

  const getSenderName = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "משתמש לא ידוע";
  };

  const [now, setNow] = useState(Date.now());
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleDraftChange = (forumId: string, newContent: string) => {
    setDrafts((prev) => ({
      ...prev,
      [forumId]: newContent,
    }));
  };
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  if (isLoading) return <p>טוען הודעות משורשרות...</p>;
  if (error) return <p>שגיאה בטעינת הודעות</p>;

  return (
  <div style={{ display: "flex", flexDirection: "column", height: "92vh", width: "100%" }}>

      <div
        style={{
          padding: "1rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          borderBottom: "1px solid #cccccc",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            left: "20px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          ✕
        </button>
        <h3 style={{ margin: 0 }}>שרשור תגובות</h3>
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
        {/* הודעה מקורית */}
        <div

          style={{
            backgroundColor: "#ffffffff",
            padding: "1rem",
            borderRadius: "18px",
            marginBottom: "1rem",
            direction: "rtl",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "Arial, sans-serif",
            fontSize: "1rem",
          }}
          dangerouslySetInnerHTML={{ __html: forumMessage?.content }}
        />
        <div
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
          }}
        >_______________ {ammuntOffThteadMessegase2}  תשובות   _______________</div>

        {/* תגובות */}
        {threadMessages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>אין תגובות עדיין</p>
        ) : (
          [...threadMessages]
            .sort((a, b) => new Date(a.send_at).getTime() - new Date(b.send_at).getTime())
            .map((msg, index, arr) => {
              const isOwnMessage = msg.sender_id === currentUser?.id;
              const senderName = getSenderName(msg.sender_id);
              const firstLetter = senderName.trim().charAt(0);

              const previousMsg = index > 0 ? arr[index - 1] : null;
              const isSameSender = previousMsg?.sender_id === msg.sender_id;
              const timeDiff = previousMsg
                ? Math.abs(new Date(msg.send_at).getTime() - new Date(previousMsg.send_at).getTime())
                : Infinity;

              const groupWithPrevious = isSameSender && timeDiff < 60000;
              const marginTop = !groupWithPrevious ? "1rem" : "0.25rem";

              return (
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
                      {!groupWithPrevious && (
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
                            {formatDistanceToNow(new Date(msg.send_at), {
                              addSuffix: true,
                              locale: he,
                            })}
                          </span>
                        </div>
                      )}

                      <div
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
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
                          position: "relative",
                        }}


                      >
                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                        
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
                              <ThreadMessagActions forumMessageId={forumMessage.id} ammuntOffThteadMessegase={ammuntOffThteadMessegase2} message={msg} onUpdateDone={refetch} setEditing={() => setEditingMessageId(msg.id)} setAmmuontOffThteadMessegase={(ammunt) => {setAmmuntOffThteadMessegase2(ammunt);}} />
                            </div>
                          )}
                        
                        {isOwnMessage && editingMessageId === msg.id && (
                          <div style={{ marginTop: "0.5rem" }}>
                            <ThreadMessagActions forumMessageId={forumMessage.id} ammuntOffThteadMessegase={ammuntOffThteadMessegase2} message={msg} onUpdateDone={() => { refetch(); setEditingMessageId(null); }} isEditingOnly setAmmuontOffThteadMessegase={(ammunt) => {setAmmuntOffThteadMessegase2(ammunt); }}/>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
        )}

        <div ref={messagesEndRef} />
      </div>
      <ThreadMessageInput
        forumMessageId={forumMessage.id}
        onMessageSent={() => {
          handleDraftChange(forumMessage.id, "");
          refetch();
        }}
        ammuntOffThteadMessegase={ammuntOffThteadMessegase2}
        setAmmuontOffThteadMessegase={(ammunt) => {
          setAmmuntOffThteadMessegase2(ammunt);
        }}
      />
    </div>
  );
}
