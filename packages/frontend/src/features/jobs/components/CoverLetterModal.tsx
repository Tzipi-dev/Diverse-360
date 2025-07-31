
// import React, { useEffect, useState } from "react";
// import PrimaryButton from "../../../globalComponents/ui/PrimaryButton";
// import { printCoverLetter } from "../../../utils/printCoverLetter";
// import { useUploadCoverLetterMutation } from "../resumeApi";
// import { supabase } from "../../../config/supabaseConfig";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../app/store";



// import CloseIcon from "@mui/icons-material/Close";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import GTranslateIcon from "@mui/icons-material/GTranslate";


// interface CoverLetterModalProps {
//   content: string;
//   onClose: () => void;
//   onChange: (newContent: string) => void;
//   jobTitle: string;
//   jobId: string;
//   userId?: string;
// }
// const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
//   content,
//   onClose,
//   onChange,
//   jobTitle,
//   jobId,
//   userId,

// }) => {
//   const [uploadCoverLetter] = useUploadCoverLetterMutation();
//   const currentUser = useSelector((state: RootState) => state.auth.user);
//   const [internalUserId, setInternalUserId] = useState(userId || currentUser?.id || "");

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!internalUserId) {
//         try {
//           const { data, error } = await supabase.auth.getSession();
//           console.log("📦 Session info:", data?.session);

//           if (data?.session?.user?.id) {
//             setInternalUserId(data.session.user.id);
//           } else {
//             console.warn("⚠️ לא נמצא משתמש מחובר או סשן חסר:", error);
//           }
//         } catch (err) {
//           console.error("❌ שגיאה בבדיקת הסשן:", err);
//         }
//       }
//     };

//     fetchUser();
//   }, [internalUserId]);

//   const sendCoverLetter = async () => {
//     const uid = internalUserId.trim();
//     console.log("🔍 מזהה משתמש פנימי:", uid);

//     if (!jobId || !uid) {
//       alert("⚠️ חסר מזהה משתמש או מזהה משרה – לא ניתן לשלוח מכתב.");
//       return;
//     }

//     try {
//       const blob = new Blob([`${content}`], { type: "application/pdf" });
//       const file = new File([blob], "cover_letter.pdf", {
//         type: "application/pdf",
//       });

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("job_id", jobId);
//       formData.append("user_id", uid);
//       formData.append("summary_text", content.slice(0, 20));
//       formData.append("cover_letter_url", content); // טקסט המכתב בשלמותו

//       await uploadCoverLetter(formData).unwrap();
//       alert("✅ המכתב נשלח בהצלחה!");
//     } catch (error: any) {
//       console.error("❌ שגיאה בשליחה:", error);
//       alert("שגיאה בשליחת המכתב: " + error.message);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.4)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "white",
//           borderRadius: "12px",
//           width: "90%",
//           maxWidth: "800px",
//           maxHeight: "90vh",
//           overflowY: "auto",
//           padding: "2rem",
//           position: "relative",
//           direction: "rtl",
//           fontFamily: "Heebo, sans-serif",
//         }}
//       >
//         {/* כפתור סגירה */}
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: "1rem",
//             left: "1rem",
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//           }}
//         />
//         <div style={{ display: "flex", gap: "1rem" }}>
//           <PrimaryButton onClick={() => printCoverLetter(content, jobTitle)}>
//             הדפס / תצוגה
//           </PrimaryButton>
//           <PrimaryButton onClick={onClose}>סגור</PrimaryButton>
//           <PrimaryButton onClick={sendCoverLetter}>
//             שליחת מכתב למשרה
//           </PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CoverLetterModal;


import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../globalComponents/ui/PrimaryButton";
import { printCoverLetter } from "../../../utils/printCoverLetter";
import { useUploadCoverLetterMutation } from "../resumeApi";
import { supabase } from "../../../config/supabaseConfig";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

interface CoverLetterModalProps {
  content: string;
  onClose: () => void;
  onChange: (newContent: string) => void;
  jobTitle: string;
  jobId: string;
  userId?: string;
}

const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  content,
  onClose,
  onChange,
  jobTitle,
  jobId,
  userId,
}) => {
  const [uploadCoverLetter] = useUploadCoverLetterMutation();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [internalUserId, setInternalUserId] = useState(userId || currentUser?.id || "");

  useEffect(() => {
    const fetchUser = async () => {
      if (!internalUserId) {
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("📦 Session info:", data?.session);

          if (data?.session?.user?.id) {
            setInternalUserId(data.session.user.id);
          } else {
            console.warn("⚠️ לא נמצא משתמש מחובר או סשן חסר:", error);
          }
        } catch (err) {
          console.error("❌ שגיאה בבדיקת הסשן:", err);
        }
      }
    };

    fetchUser();
  }, [internalUserId]);

  const sendCoverLetter = async () => {
    const uid = internalUserId.trim();
    console.log("🔍 מזהה משתמש פנימי:", uid);

    if (!jobId || !uid) {
      alert("⚠️ חסר מזהה משתמש או מזהה משרה – לא ניתן לשלוח מכתב.");
      return;
    }

    try {
      const blob = new Blob([], { type: "application/pdf" });
      const file = new File([blob], "cover_letter.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_id", jobId);
      formData.append("user_id", uid);
      formData.append("summary_text", content.slice(0, 20));
      formData.append("cover_letter_url", content); // טקסט המכתב בשלמותו

      await uploadCoverLetter(formData).unwrap();
      alert("✅ המכתב נשלח בהצלחה!");
    } catch (error: any) {
      console.error("❌ שגיאה בשליחה:", error);
      alert("שגיאה בשליחת המכתב: " + error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "80%",
          maxHeight: "80%",
          overflowY: "auto",
          direction: "rtl",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>טיוטת מכתב מקדים</h2>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: "200px",
            padding: "1rem",
            direction: "rtl",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "1rem",
          }}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <PrimaryButton onClick={() => printCoverLetter(content, jobTitle)}>
            הדפס / תצוגה
          </PrimaryButton>
          <PrimaryButton onClick={onClose}>סגור</PrimaryButton>
          <PrimaryButton onClick={sendCoverLetter}>
            שליחת מכתב למשרה
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterModal;