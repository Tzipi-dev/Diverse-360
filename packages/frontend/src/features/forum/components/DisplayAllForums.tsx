import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  useLazyGetAllForumsQuery,
  useGetViewedForumViewsByUserQuery,
  useMarkForumViewedMutation,
} from "../fourmApi";
import { Forum } from "../forumTypes";
import ForumCard from "./ForumCard";
import EditForum from "./EditForum";
import DeleteForm from "./deleteForm";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "features/users/usersApi";
import { TextField } from "@mui/material";
import { log } from "node:console";
interface DisplayAllForumsProps {
  onSelectForum: (forum: Forum) => void;
  userAcademicCycleId: string;
  onClose: () => void;
}
interface CustomJwtPayload {
  role: string;
  userId: string;
  id: string;
}

const DisplayAllForums: React.FC<DisplayAllForumsProps> = ({
  onSelectForum,
  userAcademicCycleId,
  onClose,
}) => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [] } = useGetAllUsersQuery();
  const [selectedForumId, setSelectedForumId] = useState<string | null>(null);
  const [hoveredForumId, setHoveredForumId] = useState<string | null>(null);

  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem("forumLimit");
    return saved ? parseInt(saved) : 20;
  });


  const token = localStorage.getItem("token");
  let userRole: string | null = null,
    userId: string | null = null;
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    userRole = decoded.role||"student";
    userId = decoded.userId|| decoded.id ;
  }

  const [trigger, { data: pageData, isLoading: loadingPage, error: pageError }] = useLazyGetAllForumsQuery();
  const { data: forumViews = [], isLoading: loadingViews, refetch } =
    useGetViewedForumViewsByUserQuery(userId ?? "", { skip: !userId });

  const [markForumViewed] = useMarkForumViewedMutation();

  useEffect(() => {
    setOffset(0);
    if (!userId || !userRole) return;
    trigger({ limit: limit, offset: 0, userId: userId, userRole: userRole });
  }, [trigger, userId, userRole, limit]);

  // useEffect(() => {
  //   if (pageData?.data) {
  //     setForums((prev) => {
  //       const newForums = pageData.data.filter(
  //         (forum) => !prev.some((f) => f.id === forum.id)
  //       );
  //       return [...prev, ...newForums];
  //     });
  //     setTotalCount(pageData.total);
  //   }
  // }, [pageData]);
  useEffect(() => {
    if (pageData?.data) {
      setForums((prev) => {
        const updated = pageData.data.map((incomingForum) => {
          const existing = prev.find((f) => f.id === incomingForum.id);
          return existing ? { ...existing, ...incomingForum } : incomingForum;
        });
        setTotalCount(pageData.total);

        const merged = [
          ...updated,
          ...prev.filter((f) => !updated.some((u) => u.id === f.id)),
        ];

        return merged;
      });
    }
  }, [pageData]);

  useEffect(() => {
    if (userRole === "manager") setIsAdmin(true);
  }, [userRole]);
  useEffect(() => {
    localStorage.setItem("forumLimit", limit.toString());
  }, [limit]);

  useEffect(() => {
    localStorage.setItem("forumOffset", offset.toString());
  }, [offset]);


  const enriched = useMemo(() => {
    return forums
      .filter((f) => f.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((forum) => {
        const forumView = forumViews.find((v) => v.forum_id === forum.id);
        let hasUnread = false;
        const last = forum.last_message_time ? Date.parse(forum.last_message_time) : 0;
        const viewed = forumView?.viewed_at ? Date.parse(forumView.viewed_at) : 0;
        hasUnread =
          (forumView ? forumView.was_opened === false : true) &&
          forum.last_message_sender_id !== userId &&
          last > viewed;

        const lastActivity = Math.max(
          ...["last_message_time", "updated_at", "created_at"]
            .map((key) => forum[key as keyof Forum])
            .filter(Boolean)
            .map((d) => Date.parse(d as string))
        );

        return { forum, forumView, hasUnread, lastActivity };
      })
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }, [forums, searchTerm, forumViews, userId]);

  if (loadingPage || loadingViews) return <p>טוען פורומים…</p>;
  if (pageError) return <p>שגיאה בטעינת פורומים</p>;
  const shortenText = (text: string) => {
    return text.length > 20 ? text.slice(0, 16) + "..." : text;
  };

  const handleForumClick = async (forum: Forum) => {

    setSelectedForumId(forum.id);
    onClose();

    if (!userId) return;
    const now = new Date().toISOString();
    try {
      await markForumViewed({
        forum_id: forum.id,
        user_id: userId,
        viewed_at: now,
        was_opened: true,
      }).unwrap();

      await refetch();
    } catch (e) {
      console.error("שגיאה בסימון כנצפה:", e);
    }
    onSelectForum(forum);
  };

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    if (!userId || !userRole) return;
    trigger({ limit: limit, offset: newOffset, userId: userId, userRole: userRole });
  };



  return (
    <>

      <div>
        <TextField
          variant="outlined"
          placeholder="חפש פורום..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              backgroundColor: "#f0f0f0",
              paddingRight: "10px",
              paddingLeft: "10px",
              "& fieldset": {
                borderColor: "#442063",
              },
              "&:hover fieldset": {
                borderColor: "#6c3483",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#442063",
                borderWidth: "2px",
              },
            },
            input: {
              textAlign: "right",
              fontFamily: "Arial",
            },
            mb: 2,
          }}
        />
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f0f0f0",
            direction: "ltr",
          }}
        >
          {enriched.map(({ forum, hasUnread }) => (
            <div key={forum.id}
              onClick={() => handleForumClick(forum)}
              onMouseEnter={() => setHoveredForumId(forum.id)}
              onMouseLeave={() => setHoveredForumId(null)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "12px",
                marginBottom: "10px",
                backgroundColor:
                  selectedForumId === forum.id
                    ? "#bdaacf"
                    : hoveredForumId === forum.id
                      ? "#d8cee5"
                      : "transparent",
                border: "none",
                borderRadius: "8px",
                transition: "background-color 0.3s",
                minHeight: "60px",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >

              <div>
                <h3
                  style={{
                    fontWeight: hasUnread ? "bold" : "normal",
                    margin: "0 0 5px",
                    fontSize: "18px",
                  }}
                >
                  {shortenText(forum.title)}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                  {forum.description}
                </p>
              </div>
              {/* האייקון משמאל */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#f1f1f1",
                  color: "#442063",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                {forum.icon}
              </div>

            </div>

          ))}

          {
            forums.length < totalCount && (
              <button onClick={handleLoadMore} style={{
                marginTop: 10,
                padding: "0.75rem 1.25rem",
                borderRadius: "30px",
                fontSize: "1rem",
                color: "#fff",
                backgroundColor: "#442063",
                textAlign: "right",
                fontFamily: "Arial",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                width: "90%",
                cursor: "pointer"
              }}>
                טען עוד
              </button>
            )
          }
        </div >
      </div >
    </>
  )

}
export default DisplayAllForums;