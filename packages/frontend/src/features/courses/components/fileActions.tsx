import { useLocation, useNavigate } from "react-router-dom";
import { Course } from "../../../types/coursesTypes";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { useGetVideosByCourseIdQuery } from "../../admin/videosApiSlice";
import { MessageCircle, Trash2 } from "lucide-react";
import { Box, Drawer, TextField } from "@mui/material";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByCourseIdQuery,
} from "features/comments/commentsApi";
import { Comments } from "features/comments/commentsTypes";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type ThisUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  password: string;
  created_at: string;
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 900;

const VideoReveal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course as Course;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { data: videos, isLoading, isError } = useGetVideosByCourseIdQuery(course.id);
  const [newComment, setNewComment] = useState<string>("");
  const [CreateComment] = useCreateCommentMutation();
  const { data: CommentsByCourse } = useGetCommentsByCourseIdQuery(course.id);
  const userString = localStorage.getItem("currentUser");
  const user: ThisUser | undefined = userString ? JSON.parse(userString) : undefined;

  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  useEffect(() => {
    if (!videos) return;
    const generateThumbnails = async () => {
      const results: string[] = [];

      for (const video of videos) {
        const url = video.video_url;
        const videoEl = document.createElement("video");
        videoEl.src = url;
        videoEl.crossOrigin = "anonymous";
        videoEl.muted = true;
        videoEl.currentTime = 0.1;

        await new Promise<void>((resolve) => {
          videoEl.addEventListener("loadeddata", () => {
            const canvas = document.createElement("canvas");
            canvas.width = 160;
            canvas.height = 90;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL("image/png");
              results.push(dataUrl);
            } else {
              results.push("");
            }
            resolve();
          });
        });
      }

      setThumbnails(results);
    };

    generateThumbnails();
  }, [videos]);
  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id);
      console.log("התגובה נמחקה בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקת תגובה:", error);
    }
  };
  const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitComment();
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return; // לא שולח אם ריק או רק רווחים

    const add: Comments = {
      course_id: course.id,
      text: newComment,
      user_name: user?.first_name!,
    };

    const res = await CreateComment(add);
    console.log(res);
    setNewComment("");
  };


  const goToPrevious = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goToNext = () => setCurrentIndex((prev) => Math.min(prev + 1, videos!.length - 1));
  const goToIndex = (index: number) => setCurrentIndex(index);

  const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(inOpen);
  };

  const getColorFromString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const Avatar = ({ name }: { name: string; size?: number }) => {
    if (!name) return null;
    const firstLetter = name.charAt(0).toUpperCase();
    const bgColor = getColorFromString(name);

    return (
      <svg width={40} height={40} style={{ borderRadius: "50%", backgroundColor: bgColor }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill={bgColor} />
        <text x="50" y="60" textAnchor="middle" fontSize="50" fill="white" fontFamily="Arial" fontWeight="bold">
          {firstLetter}
        </text>
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("he-IL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Responsive main content layout
  const [mobile, setMobile] = useState(isMobile());
  useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getIsSmallMobile = () => typeof window !== 'undefined' && window.innerWidth <= 400;
  const [isSmallMobile, setIsSmallMobile] = useState(getIsSmallMobile());
  useEffect(() => {
    const handleResize = () => setIsSmallMobile(getIsSmallMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // סגנון אחיד לכפתורי ניווט
  const navButtonStyle = {
    backgroundColor: "#6d3c98",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontSize: isSmallMobile ? "0.95rem" : "1rem",
    height: isSmallMobile ? 36 : 44,
    padding: isSmallMobile ? "6px 10px" : "10px 16px",
    opacity: 1,
    cursor: "pointer",
  };

  if (isLoading) return <div>טוען...</div>;

  if (isError || !videos || videos.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          backgroundColor: "#f7f4fc",
        }}
      >
        <h2 style={{ color: "#6d3c98" }}>אין סרטונים זמינים לקורס זה</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            backgroundColor: "#6d3c98",
          }}
        >
          ← חזור לקורסים
        </button>
      </div>
    );
  }
  return (
    <>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        direction: "rtl",
        backgroundImage: 'url("/images/rignt.png")',
        backgroundSize: "cover",
        backgroundPosition: mobile ? "right center" : "center",
        minHeight: "100vh",
        width: "100vw",
        zIndex: 0,
      }}>
        {/* כפתור חזור לקורסים במובייל */}
        {/* Sidebar (desktop only) */}
        {!mobile && (
          <div
            style={{
              width: "260px",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              position: "sticky",
              top: 0,
              background: mobile ? "transparent" : undefined,
            }}
          >
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff",
                borderBottom: "1px solid #ccc",
                zIndex: 1,
                // marginTop: "30px",
                marginRight: "-17px",
              }}
            >
              <button
                onClick={() => navigate(-1)}
                style={{
                  marginTop: "48px", // או top: 48 אם position: absolute
                  color: "white",
                  border: "none",
                  padding: "10px 8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  backgroundColor: "#6d3c98",
                  width: "100%",
                }}
              >
                ← חזור לקורסים
              </button>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#f7f4fc",
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                gap: "1rem",
                overflowY: "auto",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#4b2a6a", textAlign: "center" }}>
                סרטונים נוספים בקורס            </div>

              {thumbnails.map((thumb, index) => {
                const isCurrent = index === currentIndex;
                return (
                  <img
                    key={index}
                    src={thumb}
                    alt={`סרטון ${index + 1}`}
                    onClick={() => goToIndex(index)}
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9", // יחס קלאסי לווידאו
                      objectFit: "cover",
                      border: isCurrent ? "3px solid #6d3c98" : "1px solid #ccc",
                      cursor: "pointer",
                      borderRadius: "6px",
                      opacity: isCurrent ? 1 : 0.7,
                      transition: "0.2s",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, padding: isSmallMobile ? "0.5rem" : mobile ? "1rem" : "2rem", width: "100%", marginTop: mobile ? (isSmallMobile ? 100 : 120) : 0, background: mobile ? "transparent" : undefined, paddingBottom: 0 }}>
          {/* כפתור חזור לקורסים במובייל */}
          {mobile && (
            <button
              onClick={() => navigate(-1)}
              style={{
                color: "white",
                border: "none",
                padding: isSmallMobile ? "6px 12px" : "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: isSmallMobile ? "0.85rem" : "0.9rem",
                backgroundColor: "#6d3c98",
                marginBottom: "0.5rem",
                marginTop: "0.3rem",
                width: "auto",
                maxWidth: isSmallMobile ? "140px" : "160px",
                alignSelf: "flex-start",
              }}
            >
              ← חזור לקורסים
            </button>
          )}
          
          <h2 style={{ fontSize: isSmallMobile ? "1.3rem" : "2rem", marginBottom: isSmallMobile ? "0.3rem" : "0.5rem", color: "#333" }}>
            {course.title}
          </h2>

          <p style={{
            fontSize: isSmallMobile ? "0.95rem" : "1.1rem",
            color: "#444",
            lineHeight: "1.5",
            marginBottom: isSmallMobile ? "0.3rem" : "0.5rem",
            width: "90%",
          }}>
            {course.description}
          </p>

          <div style={{
            width: "100%",
            maxWidth: 900,
            margin: mobile ? (isSmallMobile ? "8px auto 0 auto" : "auto") : 0,
            marginLeft: mobile ? 0 : "24px",
            marginRight: 0,
            marginTop: mobile ? (isSmallMobile ? "16px" : "24px") : 0,
            overflow: isSmallMobile ? "visible" : "hidden",
            borderRadius: "12px",
            position: "relative",
          }}>
            {/* נגן הווידאו */}
            <div
              style={{
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                border: "4px solid #442063",
                backgroundColor: "#000",
                transition: "transform 0.3s ease-in-out",
                position: "relative",
              }}
            >
              <ReactPlayer
                key={videos![currentIndex].id}
                url={videos![currentIndex].video_url}
                controls
                width="100%"
                height={isSmallMobile ? "220px" : mobile ? "40vw" : "65vh"}
                style={{ maxWidth: "100vw", borderRadius: "20px" }}
              />
            </div>
          </div>

          {/* Thumbnails bar for mobile */}
          {mobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                width: "100%",
                marginTop: isSmallMobile ? "0.5rem" : "1rem",
                gap: isSmallMobile ? "0.15rem" : "0.3rem",
                paddingBottom: isSmallMobile ? "0.1rem" : "0.2rem",
              }}
            >
              {thumbnails.map((thumb, index) => {
                const isCurrent = index === currentIndex;
                return (
                  <img
                    key={index}
                    src={thumb}
                    alt={`סרטון ${index + 1}`}
                    onClick={() => goToIndex(index)}
                    style={{
                      width: isSmallMobile ? "120px" : "160px",
                      aspectRatio: "16 / 9",
                      objectFit: "cover",
                      border: isCurrent ? "3px solid #6d3c98" : "1px solid #ccc",
                      cursor: "pointer",
                      borderRadius: "6px",
                      opacity: isCurrent ? 1 : 0.7,
                      transition: "0.2s",
                    }}
                  />
                );
              })}
            </div>
          )}

<div
            style={{
              marginTop: isSmallMobile ? "0.5rem" : "1rem",
              display: "flex",
              justifyContent: "center",
              gap: isSmallMobile ? "0.5rem" : "1rem",
              marginLeft: mobile ? 0 : "28vw",
            }}
          >
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="nav-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              הקודם
            </button>
            <span style={{ fontSize: isSmallMobile ? "0.95rem" : "1rem" }}>
              סרטון {currentIndex + 1} מתוך {videos!.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === videos!.length - 1}
              className="nav-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              הבא
            </button>
          </div>

          {/* כפתור תגובות יוצג תמיד, עם עיצוב אחיד */}
          {mobile ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button
                onClick={toggleDrawer(true)}
                aria-label="תגובות"
                style={{
                  borderRadius: "50%",
                  width: "30px",
                  height: "45px",
                }}
              >
                <MessageCircle />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleDrawer(true)}
              aria-label="תגובות"
              style={{
                position: "fixed",
                bottom: "16px",
                left: "20px",
                zIndex: 1000,
                borderRadius: "50%",
                width: "30px",
                height: "45px",
              }}
            >
              <MessageCircle />
            </button>
          )}
        </div>
      </div>


      <Drawer
        open={openDrawer}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: mobile ? '100vw' : '27vw',
            maxWidth: '100vw',
            height: '100vh',
          }
        }}
      >
        <Box
          role="presentation"
          sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px',
            boxSizing: 'border-box',
            direction: 'rtl',
          }}
        >
          {/* כפתור חזור במובייל */}
          {mobile && (
            <button
              onClick={toggleDrawer(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginBottom: '1rem',
                background: '#f5f5f5',
                color: '#442063',
                border: 'none',
                borderRadius: '24px',
                padding: '10px 20px',
                fontSize: '1.1rem',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(68,32,99,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#e0e0e0')}
              onMouseOut={e => (e.currentTarget.style.background = '#f5f5f5')}
            >
              <ArrowBackIcon style={{ marginLeft: 8 }} />
              חזור
            </button>
          )}
          {/* תגובות עם גלילה בצד ימין */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column-reverse",
              direction: "rtl",
            }}
          >
            {CommentsByCourse
              ?.slice()
              .sort((a, b) => {
                const aDate = new Date(a.created_at || '').getTime();
                const bDate = new Date(b.created_at || '').getTime();
                return bDate - aDate;
              })
              .map((comment) => {
                const isCurrentUser = comment.user_name === user?.first_name;
                const isHovered = hoveredCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCurrentUser ? "flex-end" : "flex-start",
                      marginBottom: "1.5rem",
                      paddingLeft: isCurrentUser ? "20px" : "0",
                      paddingRight: !isCurrentUser ? "20px" : "0",
                      position: "relative",
                    }}
                    onMouseEnter={() => setHoveredCommentId(comment.id!)}
                    onMouseLeave={() => setHoveredCommentId(null)}
                  >
                    {/* אייקון מחיקה שמופיע מעל הבועה */}
                    {isCurrentUser && isHovered && (
                      <div
                        onClick={() => handleDeleteComment(comment.id!)}
                        style={{
                          position: "absolute",
                          top: "-24px",
                          left: "2",
                          cursor: "pointer",
                          zIndex: 10,
                          borderRadius: "50%",
                          padding: 4,
                        }}
                        title="מחק תגובה"
                      >
                        <Trash2 size={16} color="gray" />
                      </div>
                    )}

                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#333",
                        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      }}
                    >
                      {comment.user_name}
                    </div>
                    <div
                      style={{
                        backgroundColor: isCurrentUser ? "#d1ecf1" : "#f1f1f1",
                        padding: "0.8rem 1rem",
                        borderRadius: 16,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word"
                      }}
                    >
                      {comment.text}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#777",
                        marginTop: "4px",
                        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      }}
                    >
                      {comment.created_at ? formatDate(comment.created_at) : ""}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* שורת הקלדה בתחתית */}
          <TextField
            variant="outlined"
            placeholder="הכנס תגובה..."
            onChange={handleChangeComment}
            onKeyDown={handleKeyDown}
            value={newComment}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                width: "100%",
              },
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default VideoReveal;

/* גלובלי */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .nav-btn {
      background: linear-gradient(90deg, #6d3c98 0%, #8f5cc2 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      height: 38px;
      min-width: 56px;
      padding: 0 14px;
      box-shadow: 0 2px 8px rgba(68,32,99,0.10);
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      outline: none;
      opacity: 1;
      margin: 0 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-btn:hover:not(:disabled) {
      background: linear-gradient(90deg, #8f5cc2 0%, #6d3c98 100%);
      box-shadow: 0 4px 16px rgba(68,32,99,0.18);
    }
    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #bba6d6;
      box-shadow: none;
    }
    @media (max-width: 400px) {
      .nav-btn {
        font-size: 0.92rem;
        height: 32px;
        min-width: 44px;
        padding: 0 8px;
      }
    }
  `;
  document.head.appendChild(style);
}