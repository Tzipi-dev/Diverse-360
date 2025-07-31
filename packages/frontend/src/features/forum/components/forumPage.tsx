// import { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import DisplayAllForums from "../components/DisplayAllForums";
// import { Forum } from "../forumTypes";
// import AddForum from "../components/AddForum";
// import { useGetAllForumMessagesByForumIdQuery } from "../../forumMessage/forumMessageApi";
// import {
//   useMarkForumViewedMutation,
//   useGetViewedForumViewsByUserQuery,
// } from "../fourmApi";
// import { RootState } from "../../../app/store";
// import ForumMessages from "features/forumMessage/components/forumMessage";
// import { Button } from "@mui/material";
// import { jwtDecode } from "jwt-decode";
// import { useAddScreenAnalyticsMutation } from "../../admin/analyticsApi";
// import { ForumMessage } from "features/forumMessage/forumMessageTypes";
// import ThreadMessages from "features/ThreadMessages/ThreadMessages";

// interface CustomJwtPayload {
//   role: string;
//   userId: string;
// }

// export default function ForumPage() {
//   const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [markViewed] = useMarkForumViewedMutation();
//   const [addAnalytics] = useAddScreenAnalyticsMutation();
//   const enterTimeRef = useRef(Date.now());
// const [selectedForumMessage, setSelectedForumMessage] = useState<ForumMessage | null>(null);
//   // קריאת טוקן ופענוח
//   const token = localStorage.getItem("token");
//   let userRole: string | null = null,
//     decodedUserId: string | null = null;
//   if (token) {
//     const decoded = jwtDecode<CustomJwtPayload>(token);
//     userRole = decoded.role;
//     decodedUserId = decoded.userId;
//     console.log("userId", decoded.userId);
//   }

//   const { data: messages = [], isLoading: isLoadingMessages } =
//     useGetAllForumMessagesByForumIdQuery(selectedForum?.id ?? "", {
//       skip: !selectedForum?.id,
//     });

//   const { refetch: refetchViewedForums } = useGetViewedForumViewsByUserQuery(
//     decodedUserId ?? "",
//     { skip: !decodedUserId }
//   );

//   useEffect(() => {
//     enterTimeRef.current = Date.now();
//     return () => {
//       const duration = Date.now() - enterTimeRef.current;
//       if (decodedUserId && duration > 1000) {
//         addAnalytics({
//           user_id: decodedUserId,
//           path: "ForumPage",
//           duration,
//         });
//       }
//     };
//   }, [decodedUserId, addAnalytics]); // תלויות מעודכנות

//   useEffect(() => {
//     const handleCloseForm = () => setShowForm(false);
//     window.addEventListener("forumCreated", handleCloseForm);
//     return () => {
//       window.removeEventListener("forumCreated", handleCloseForm);
//     };
//   }, []);

//   let userAcademicCycleId = "12345"; // TODO: לקבל מהיוזר

//   const handleSelectForum = async (forum: Forum) => {
//     setSelectedForum(forum);

//     if (decodedUserId && forum.id) {
//       try {
//         await markViewed({
//           forum_id: forum.id,
//           user_id: decodedUserId,
//           viewed_at: new Date().toISOString(),
//           was_opened: true,
//         }).unwrap();
//         await refetchViewedForums();
//       } catch (error: any) {
//         console.error("שגיאה בסימון פורום כנצפה:", error.message);
//       }
//     }
//   };
//   const hendelOpenTreadMassage = async (ForumMessage: ForumMessage) => {
//     setSelectedForumMessage(ForumMessage);
//   }
// const hendelcloseTreadMassage = async () => {
//     setSelectedForumMessage(null);
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         margin: 0,
//         padding: 0,
//         flexDirection: "column",
//         gap: 0,
//       }}
//     >
//       <div
//         style={{
//           height: "100%",
//           gap: 0,
//           backgroundImage: 'url("/images/home.png")',
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           marginTop: "-80px",
//         }}
//       >
//         <h1
//           style={{
//             textAlign: "center",
//             color: "white",
//             marginTop: "140px",
//             fontSize: "2rem",
//           }}
//         >
//           מרחב התמיכה הקהילתי – פורומים מקצועיים
//         </h1>
//       </div>

//       <div
//         style={{
//           width: "100%",
//           display: "flex",
//           minHeight: "80vh",
//           overflow: "hidden",
//           direction: "rtl",
//           boxShadow: "none",
//           background: "#fff",
//         }}
//       >
//         <div
//           style={{
//             flex: 1,
//             padding: "1rem",
//             borderLeft: "1px solid #eee",
//             backgroundColor: "#f5f5f5",
//             position: "relative",
//           }}
//         >
//           <div style={{ marginBottom: "1rem" }}>
//             <Button
//               onClick={() => setShowForm(true)}
//               fullWidth
//               sx={{
//                 padding: "0.75rem 1.25rem",
//                 borderRadius: "30px",
//                 fontSize: "1rem",
//                 color: "#fff",
//                 backgroundColor: "#442063",
//                 textAlign: "right",
//                 fontFamily: "Arial",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                 "&:hover": { backgroundColor: "#5b2a83" },
//               }}
//             >
//               צור פורום חדש
//             </Button>
//           </div>

//           <DisplayAllForums
//             onSelectForum={handleSelectForum}
//             userAcademicCycleId={userAcademicCycleId}
//             onClose={()=>(hendelcloseTreadMassage())}
//           />
//         </div>

//         <div
//           style={{
//             flex: 2,
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#f0f0f5",
//             color: "#222",
//             overflow: "hidden",
//           }}
//         >
//           {selectedForum ? (
//             <ForumMessages forum={selectedForum} onSelectForumMessage={hendelOpenTreadMassage}/>
//           ) : (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 height: "100%",
//                 gap: "24px",
//                 backgroundColor: "#f0f0f5",
//                 borderRadius: "20px",
//                 padding: "40px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "5rem",
//                   opacity: 0.3,
//                   background:
//                     "linear-gradient(135deg, #442063, #6B2C91)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
//                 }}
//               >
//                 💬
//               </div>
//               <div style={{ textAlign: "center" }}>
//                 <p
//                   style={{
//                     fontSize: "1.3rem",
//                     margin: "0 0 8px 0",
//                     fontWeight: "600",
//                     color: "#495057",
//                   }}
//                 >
//                   לא נבחר פורום
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "1rem",
//                     margin: 0,
//                     opacity: 0.7,
//                     color: "#6c757d",
//                   }}
//                 >
//                   בחרי פורום מהצד הימני כדי לשוחח
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {showForm && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               right: 0,
//               bottom: 0,
//               left: 0,
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 1000,
//             }}
//             onClick={() => setShowForm(false)}
//           >
//             <div
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 position: "relative",
//                 backgroundColor: "#ffffff",
//                 padding: "2rem",
//                 borderRadius: "12px",
//                 width: "90%",
//                 maxWidth: "500px",
//                 boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
//                 animation: "fadeIn 0.3s ease",
//               }}
//             >
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   position: "absolute",
//                   top: "1rem",
//                   left: "1rem",
//                   background: "transparent",
//                   border: "none",
//                   fontSize: "1.2rem",
//                   cursor: "pointer",
//                   color: "#666",
//                 }}
//                 aria-label="סגור"
//               >
//                 ✕
//               </button>

//               <AddForum />
//             </div>
//           </div>
//         )}
//         {selectedForumMessage && (
//           <div
//             style={{
//               flex: 2,
//               display: "flex",
//               flexDirection: "column",
//               backgroundColor: "#f0f0f5",
//               color: "#222",
//               overflow: "hidden",
//             }}
//           >
//             <ThreadMessages forumMessage={selectedForumMessage} onClose={()=>(hendelcloseTreadMassage())}/>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import DisplayAllForums from "../components/DisplayAllForums";
import { Forum } from "../forumTypes";
import AddForum from "../components/AddForum";
import { useGetAllForumMessagesByForumIdQuery } from "../../forumMessage/forumMessageApi";
import {
  useMarkForumViewedMutation,
  useGetViewedForumViewsByUserQuery,
} from "../fourmApi";
import { RootState } from "../../../app/store";
import ForumMessages from "features/forumMessage/components/forumMessage";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useAddScreenAnalyticsMutation } from "../../admin/analyticsApi";
import { ForumMessage } from "features/forumMessage/forumMessageTypes";
import ThreadMessages from "features/ThreadMessages/ThreadMessages";
import { useParams } from "react-router-dom";//added
import { useLazyGetAllForumsQuery } from "../fourmApi"; // path might vary

interface CustomJwtPayload {
  role: string;
  userId: string;
  id: string;
}

export default function ForumPage() {
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [markViewed] = useMarkForumViewedMutation();
  const [addAnalytics] = useAddScreenAnalyticsMutation();
  const enterTimeRef = useRef(Date.now());
  const [selectedForumMessage, setSelectedForumMessage] = useState<ForumMessage | null>(null);

  const token = localStorage.getItem("token");
  let userRole: string | null = null,
    decodedUserId: string | null = null;
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    userRole = decoded.role;
    decodedUserId = decoded.userId|| decoded.id; 
    console.log( decoded);
    console.log("userId", decodedUserId);
 
  }

  const { data: messages = [], isLoading: isLoadingMessages } =
    useGetAllForumMessagesByForumIdQuery(selectedForum?.id ?? "", {
      skip: !selectedForum?.id,
    });

  const { refetch: refetchViewedForums } = useGetViewedForumViewsByUserQuery(
    decodedUserId ?? "",
    { skip: !decodedUserId }
  );

  useEffect(() => {
    enterTimeRef.current = Date.now();
    return () => {
      const duration = Date.now() - enterTimeRef.current;
      if (decodedUserId && duration > 1000) {
        addAnalytics({
          user_id: decodedUserId,
          path: "ForumPage",
          duration,
        });
      }
    };
  }, [decodedUserId, addAnalytics]);

  useEffect(() => {
    const handleCloseForm = () => setShowForm(false);
    window.addEventListener("forumCreated", handleCloseForm);
    return () => {
      window.removeEventListener("forumCreated", handleCloseForm);
    };
  }, []);

  let userAcademicCycleId = "12345";

  const handleSelectForum = async (forum: Forum) => {
    setSelectedForum(forum);
    if (decodedUserId && forum.id) {
      try {
        await markViewed({
          forum_id: forum.id,
          user_id: decodedUserId,
          viewed_at: new Date().toISOString(),
          was_opened: true,
        }).unwrap();
        await refetchViewedForums();
      } catch (error: any) {
        console.error("שגיאה בסימון פורום כנצפה:", error.message);
      }
    }
  };

  const handleOpenThreadMessage = (forumMessage: ForumMessage) => {
    setSelectedForumMessage(forumMessage);
  };

  const handleCloseThreadMessage = () => {
    setSelectedForumMessage(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        style={{
          backgroundImage: 'url("/images/home.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-80px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "140px",
            fontSize: "2rem",
          }}
        >
          מרחב התמיכה הקהילתי – פורומים מקצועיים
        </h1>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          minHeight: "80vh",
          direction: "rtl",
          padding: "1rem",
          gap: "1rem",
          backgroundImage: 'url("/images/home.png")',
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "33%",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {userRole=== "manager" && (
        <div style={{ marginBottom: "1rem" }}>
            <Button
              onClick={() => setShowForm(true)}
              fullWidth
              sx={{
                padding: "0.75rem 1.25rem",
                borderRadius: "30px",
                fontSize: "1rem",
                color: "#fff",
                backgroundColor: "#442063",
                textAlign: "right",
                fontFamily: "Arial",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                "&:hover": { backgroundColor: "#5b2a83" },
              }}
            >
              צור פורום חדש
            </Button>
          </div>

          )}
  

          <DisplayAllForums
            onSelectForum={handleSelectForum}
            userAcademicCycleId={userAcademicCycleId}
            onClose={handleCloseThreadMessage}
          />
        </div>

        <div
          style={{
            width: "67%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f0f0f5",
            borderRadius: "20px",
            padding: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {selectedForum ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "100%",
                gap: "1rem",
              }}
            >
              {/* צד ימין – הודעות בפורום */}
              <div
                style={{
                  width: selectedForumMessage ? "50%" : "100%",
                  transition: "width 0.3s ease",
                }}
              >
                <ForumMessages
                  forum={selectedForum}
                  onSelectForumMessage={handleOpenThreadMessage}
                />
              </div>

              {/* צד שמאל – הודעות משורשרות */}
              {selectedForumMessage && (
                <div
                  style={{
                    width: "50%",
                    transition: "width 0.3s ease",
                  }}
                >
                  <ThreadMessages
                    forumMessage={selectedForumMessage}
                    onClose={handleCloseThreadMessage}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "24px",
                backgroundColor: "#f0f0f5",
                borderRadius: "20px",
                padding: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "5rem",
                  opacity: 0.3,
                  background: "linear-gradient(135deg, #442063, #6B2C91)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}
              >
                💬
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "1.3rem",
                    margin: "0 0 8px 0",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  לא נבחר פורום
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    margin: 0,
                    opacity: 0.7,
                    color: "#6c757d",
                  }}
                >
                  בחר פורום מהצד הימני כדי לשוחח
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#666",
              }}
              aria-label="סגור"
            >
              ✕
            </button>

            <AddForum />
          </div>
        </div>
      )}
    </div>
  );
}
