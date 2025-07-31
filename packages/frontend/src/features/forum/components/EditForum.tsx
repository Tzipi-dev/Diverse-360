import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Forum } from "../forumTypes";
import { useUpdateForumMutation } from "../fourmApi";
import ForumPermissionsSelector from "./ForumPermissionsSelector";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from "@mui/material";

const forumEditSchema = z.object({
  title: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean(),
  allowedUserIds: z.array(z.string()),
  academicCycleId: z.string().optional(),
  accessType: z.enum(["public", "specificUsers", "academicCycle"]),
});

type ForumEditFormValues = z.infer<typeof forumEditSchema>;
interface EditForumProps {
  forum: Forum;
  onCancel: () => void;
  onSave: () => void;
  currentUserId: string | null;
  isAdmin: boolean;
  userAcademicCycleId: string;
}

const EditForum: React.FC<EditForumProps> = ({
  forum,
  onCancel,
  onSave,
  currentUserId,
  isAdmin,
  userAcademicCycleId,
}) => {
  const [updateForum, { isLoading }] = useUpdateForumMutation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState<string>("");
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

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

  const accessType = forum.Forum_Permissions.isPublic
    ? "public"
    : forum.Forum_Permissions.academicCycleId
      ? "academicCycle"
      : "specificUsers";

  const methods = useForm<ForumEditFormValues>({
    resolver: zodResolver(forumEditSchema),
    defaultValues: {
      title: forum.title,
      description: forum.description,
      isPublic: forum.Forum_Permissions.isPublic,
      allowedUserIds: forum.Forum_Permissions.allowedUserIds,
      academicCycleId: forum.Forum_Permissions.academicCycleId,
      accessType,
    },
  });

  useEffect(() => {
    if (openErrorDialog && errorMessage) {
      const timer = setTimeout(() => {
        setOpenErrorDialog(false);
        setErrorMessage("");
        onCancel();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [openErrorDialog, errorMessage, onCancel]);

  const onSubmit = async (data: ForumEditFormValues) => {
    if (forum.created_by_user_id !== currentUserId && !isAdmin) {
      setErrorMessage("אין לך הרשאות לערוך את הפורום הזה");
      setOpenErrorDialog(true);
      return;
    }
    try {
      await updateForum({
        id: forum.id,
        title: (emoji ? emoji + " " : "") + data.title,
        icon: emoji || "",
        description: data.description ?? "",
        created_by_user_id: forum.created_by_user_id,
        created_at: forum.created_at,
        updated_at: new Date().toISOString(),
        last_message_time: forum.last_message_time,
        Forum_Permissions: {
          isPublic: data.isPublic,
          allowedUserIds: data.allowedUserIds,
          academicCycleId:
            data.accessType === "academicCycle" ? userAcademicCycleId : "",
        },
      }).unwrap();
      onSave();
    } catch (e) {
      console.error("Error updating forum:", e);
      setErrorMessage("שגיאה בעדכון הפורום");
      setOpenErrorDialog(true);
    }}


    return (<FormProvider {...methods}>
      <h2 style={{ textAlign: "center" }}>עדכון פורום</h2>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          direction: "rtl",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", position: "relative" }}>
          <span style={{ fontWeight: 500 }}>שם הפורום</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#f1f3f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                cursor: "pointer",
                border: "1px solid #ccc",
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
                fontSize: "16px",
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
                direction: "ltr"
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

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 500, }}>תיאור</span>
          <textarea
            {...methods.register("description")}
            rows={3}
            placeholder="כמה מילים על מה הפורום עוסק..."
            style={{
              fontFamily: "Arial",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </label>

        <ForumPermissionsSelector />
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "שומר..." : "שמור"}
          </button>
          <button type="button" onClick={onCancel}>
            בטל
          </button>
        </div>

        <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
          <DialogTitle style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d32f2f" }}>
            <ErrorOutlineIcon />
            שגיאה
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenErrorDialog(false)} color="primary">
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </FormProvider>
    );
  };
export default EditForum;
