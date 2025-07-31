// // import { useEffect } from "react";
// // import { useAppDispatch } from "../../app/hooks";
// // import socket from "../../app/socket";
// // import forumMessageApi from "./forumMessageApi"; // ודאי שהנתיב נכון
// // import { ForumMessage } from "./forumMessageTypes";
// // import forumApi from "./../forum/fourmApi";
// // const ForumMessageSocket = () => {
// //   const dispatch = useAppDispatch();

// //   useEffect(() => {
// //     const handleMessageCreated = (newMessage: ForumMessage) => {
// //       dispatch(
// //         forumMessageApi.util.updateQueryData(
// //           "getAllForumMessagesByForumId",
// //           newMessage.forum_id,
// //           (draft) => {
// //             draft.push(newMessage);
// //           }
// //         )
// //       );
// //     };
// //     const handleMessageUpdated = (updatedMessage: ForumMessage) => {
// //       dispatch(
// //         forumMessageApi.util.updateQueryData(
// //           "getAllForumMessagesByForumId",
// //           updatedMessage.forum_id,
// //           (draft) => {
// //             const index = draft.findIndex(m => m.id === updatedMessage.id);
// //             if (index !== -1) {
// //               Object.assign(draft[index], updatedMessage);
// //             }
// //           }
// //         )
// //       );
// //     };

// //     const handleMessageDeleted = ({ id, forum_id }: { id: string; forum_id: string }) => {
// //       dispatch(
// //         forumMessageApi.util.updateQueryData(
// //           "getAllForumMessagesByForumId",
// //           forum_id,
// //           (draft) => {
// //             //   return draft.filter(m => m.id !== id);
// //             // }
// //             const index = draft.findIndex(m => m.id === id);
// //             if (index !== -1) {
// //               draft.splice(index, 1);

// //             }
// //           }
// //         )
// //       );
// //     };

// //     socket.on("newMessage", handleMessageCreated);
// //     socket.on("messageUpdated", handleMessageUpdated);
// //     socket.on("messageDeleted", handleMessageDeleted);

// //     return () => {
// //       socket.off("newMessage", handleMessageCreated);
// //       socket.off("messageUpdated", handleMessageUpdated);
// //       socket.off("messageDeleted", handleMessageDeleted);

// //     };
// //   }, [dispatch]);

// //   return null;
// // };

// // export default ForumMessageSocket;
// import { useEffect } from "react";
// import { useAppDispatch } from "../../app/hooks";
// import socket from "../../app/socket";
// import forumMessageApi from "./forumMessageApi";
// import { useLazyGetAllForumsQuery } from "../forum/fourmApi";
// import forumApi from "../forum/fourmApi";

// import { ForumMessage } from "./forumMessageTypes";
// import { jwtDecode } from "jwt-decode";

// interface CustomJwtPayload {
//   role: string;
//   userId: string;
// }

// const ForumMessageSocket = () => {
//   const dispatch = useAppDispatch();
//       const [trigger] = useLazyGetAllForumsQuery();
//       const limit = JSON.parse(localStorage.getItem("forumLimit") || "20");
//       const offset = JSON.parse(localStorage.getItem("forumOffset") || "0");
//       const token = localStorage.getItem("token");
//       let userRole: string | null = null;
//       let userId: string | null = null;
//       if (token) {
//         const decoded = jwtDecode<CustomJwtPayload>(token);
//         userRole = decoded.role;
//         userId = decoded.userId;
//       }

//   useEffect(() => {
//     const limit = JSON.parse(localStorage.getItem("forumLimit") || "null");
//     const offer = JSON.parse(localStorage.getItem("forumOffer") || "null");
//     const token = localStorage.getItem("token");

//     let userRole: string | null = null;
//     let userId: string | null = null;

//     if (token) {
//       const decoded = jwtDecode<CustomJwtPayload>(token);
//       userRole = decoded.role;
//       userId = decoded.userId;
//     }

//     const handleMessageCreated = (newMessage: ForumMessage) => {
//       // עדכון הודעות הפורום
//       dispatch(
//         forumMessageApi.util.updateQueryData(
//           "getAllForumMessagesByForumId",
//           newMessage.forum_id,
//           (draft) => {
//             draft.push(newMessage);
//           }
//         )
//       );

//       if (userId && userRole) {
//         trigger({ limit, offset, userId, userRole });
//       }
//     };
//   });

//   const handleMessageUpdated = (updatedMessage: ForumMessage) => {
//     dispatch(
//       forumMessageApi.util.updateQueryData(
//         "getAllForumMessagesByForumId",
//         updatedMessage.forum_id,
//         (draft) => {
//           const index = draft.findIndex(m => m.id === updatedMessage.id);
//           if (index !== -1) {
//             Object.assign(draft[index], updatedMessage);
//           }
//         }
//       )
//     );
//   };

//   const handleMessageDeleted = ({ id, forum_id }: { id: string; forum_id: string }) => {
//     dispatch(
//       forumMessageApi.util.updateQueryData(
//         "getAllForumMessagesByForumId",
//         forum_id,
//         (draft) => {
//           const index = draft.findIndex(m => m.id === id);
//           if (index !== -1) {
//             draft.splice(index, 1);
//           }
//         }
//       )
//     );


//   socket.on("newMessage", handleMessageCreated);
//   socket.on("messageUpdated", handleMessageUpdated);
//   socket.on("messageDeleted", handleMessageDeleted);

//   return () => {
//     socket.off("newMessage", handleMessageCreated);
//     socket.off("messageUpdated", handleMessageUpdated);
//     socket.off("messageDeleted", handleMessageDeleted);
//   };
// }, [dispatch]);

// return null;
// };

// export default ForumMessageSocket;
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import socket from "../../app/socket";
import forumMessageApi from "./forumMessageApi";
import { useLazyGetAllForumsQuery } from "../forum/fourmApi";
import { ForumMessage } from "./forumMessageTypes";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  role: string;
  userId: string;
}

const ForumMessageSocket = () => {
  const dispatch = useAppDispatch();
  const [trigger] = useLazyGetAllForumsQuery();

  useEffect(() => {
    // שליפת פרמטרים מה-localStorage ומ-token
    const limit = JSON.parse(localStorage.getItem("forumLimit") || "20");
    const offset = JSON.parse(localStorage.getItem("forumOffset") || "0");
    const token = localStorage.getItem("token");

    let userRole: string | null = null;
    let userId: string | null = null;

    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      userRole = decoded.role;
      userId = decoded.userId;
    }

    // טיפול ביצירת הודעה חדשה
    const handleMessageCreated = (newMessage: ForumMessage) => {
      dispatch(
        forumMessageApi.util.updateQueryData(
          "getAllForumMessagesByForumId",
          newMessage.forum_id,
          (draft) => {
            draft.push(newMessage);
          }
        )
      );

      // טעינת הפורומים מחדש עם הפילטרים הקיימים
      if (userId && userRole) {
        trigger({ limit, offset, userId, userRole });
      }
    };

    // טיפול בעדכון הודעה
    const handleMessageUpdated = (updatedMessage: ForumMessage) => {
      dispatch(
        forumMessageApi.util.updateQueryData(
          "getAllForumMessagesByForumId",
          updatedMessage.forum_id,
          (draft) => {
            const index = draft.findIndex((m) => m.id === updatedMessage.id);
            if (index !== -1) {
              Object.assign(draft[index], updatedMessage);
            }
          }
        )
      );
    };

    // טיפול במחיקת הודעה
    const handleMessageDeleted = ({ id, forum_id }: { id: string; forum_id: string }) => {
      dispatch(
        forumMessageApi.util.updateQueryData(
          "getAllForumMessagesByForumId",
          forum_id,
          (draft) => {
            const index = draft.findIndex((m) => m.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          }
        )
      );
    };

    // התחברות לאירועים
    socket.on("newMessage", handleMessageCreated);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);

    // ניקוי האירועים בהורדת הקומפוננטה
    return () => {
      socket.off("newMessage", handleMessageCreated);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [dispatch, trigger]);

  return null;
};

export default ForumMessageSocket;
export {};
