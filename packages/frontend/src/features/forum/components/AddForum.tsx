import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateForumMutation } from "../fourmApi";
import { Forum } from "../forumTypes";
import ForumPermissionsSelector from "./ForumPermissionsSelector";
import { jwtDecode } from "jwt-decode";
import  { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { useRef, useEffect } from "react";

const token = localStorage.getItem("token");


// סכימה
const forumSchema = z.object({
  title: z.string().min(1, "יש להזין שם פורום"),
    icon: z.string().optional(), 
  description: z.string().optional(),
  isPublic: z.boolean(),
  allowedUserIds: z.array(z.string()),
  academicCycleId: z.string().optional(),
  accessType: z.enum(["public", "specificUsers", "academicCycle"]),
});

type ForumFormValues = z.infer<typeof forumSchema>;
type DecodedToken = {
 id: string;
  role: string;
  [key: string]: any;
};


export default function CreateForumForm() {


  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

// סגירה בלחיצה מחוץ לפיקר
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
      setShowEmojiPicker(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  let userRole: string | null = null;
  let userId: string | null = null;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emoji, setEmoji] = useState<string>("");

  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    userRole = decodedToken.role;
    userId = decodedToken.userId;
    console.log("userId",userId)
  }



  const [createForum] = useCreateForumMutation();

  const methods = useForm<ForumFormValues>({
    resolver: zodResolver(forumSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      allowedUserIds: [],
      academicCycleId: "",
      accessType: "public",
    },
  });
  const title = methods.watch("title");

  useEffect(() => {
    if (title && !emoji) {
      const firstChar = title.trim().charAt(0).toUpperCase();
      methods.setValue("icon", firstChar);
    }
  }, [title, emoji,methods]);

  const { handleSubmit, reset } = methods;

//   const onSubmit = async (data: ForumFormValues) => {
//     window.dispatchEvent(new Event("forumCreated"));
//     if(userId===undefined)
//       console.log("userId not found")
// else{
//    const newForum: Forum = {
//       id: "",
//       title: data.title,
//       description: data.description ?? "",
//       created_by_user_id: userId!,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       last_message_time: new Date().toISOString(),
//       Forum_Permissions: {
//         isPublic: data.isPublic,
//         allowedUserIds: data.allowedUserIds,
//         academicCycleId: data.accessType === "academicCycle" ? "משתמש_נוכחי_מחזור" : "",
//       },
//       // last_message_time: new Date().toISOString(),
//     };

//     try {
//       await createForum(newForum).unwrap();
//       reset();
//     toast.success("פורום נוצר בהצלחה!");
      
//     } catch (e) {
//       console.error(e);
//      toast.error("שגיאה ביצירת הפורום");
//     }
//   }};

const onSubmit = async (data: ForumFormValues) => {
  window.dispatchEvent(new Event("forumCreated"));
  
  if (!userId) {
    console.log("userId not found");
    return;
  }

  const isPublic = data.accessType === "public";

  const newForum: Forum = {
    id: "",
    title: data.title,
    icon: data.icon ?? title.trim().charAt(0).toUpperCase(),
    description: data.description ?? "",
    created_by_user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message_time: new Date().toISOString(),
    Forum_Permissions: {
      isPublic,
      allowedUserIds: data.accessType === "specificUsers" ? data.allowedUserIds : [],
      academicCycleId: data.accessType === "academicCycle" ? data.academicCycleId ?? "" : "",
    },
  };

  try {
    await createForum(newForum).unwrap();
    reset();
    toast.success("פורום נוצר בהצלחה!");
  } catch (e) {
    console.error(e);
    toast.error("שגיאה ביצירת הפורום");
  }
};


  return (
  <FormProvider {...methods}>
    <h2 style={{textAlign:"center"}}>צור פורום משלך!</h2>
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
      }}
    >
       <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", position: "relative" }}>
                <span style={{  fontWeight: "600", fontSize: "1.1rem" }}>שם הפורום:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#f1f3f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    cursor: "pointer",
                    border: "1px solid #ccc"
                  }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {emoji || "➕"}
                  </div>
      
                  <input
                    {...methods.register("title")}
                    placeholder="שם הפורום שלך..."
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                  />
                </div>
      
              {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                zIndex: 999,
                direction: "ltr" // כדי שהאימוג'ים יסתדרו נכון
              }}>

              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  const selectedEmoji = emojiData.emoji;
                  setEmoji(selectedEmoji);
                  methods.setValue("icon", selectedEmoji);
                  setShowEmojiPicker(false);
                }}
              />

            </div>
          )}

              </label>

      <label style={{ fontWeight: "600", fontSize: "1.1rem" }}>
        תיאור:
        <textarea
          {...methods.register("description")}
          placeholder="תיאור הפורום"
          rows={4}
          style={{
            width: "100%",
            padding: "0.8rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "0.4rem",
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
          }}
        />
      </label>

      <ForumPermissionsSelector />

      <button
        type="submit"
        style={{
          padding: "0.9rem",
          fontSize: "1.1rem",
           backgroundColor: "#442063",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
   
      >
        צור פורום
      </button>
    </form>
  </FormProvider>
);

}
