import { useState, useRef, useEffect } from "react";
import { Send, Mic, Upload, Smile, Underline, Video } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import TextFormatting from "../forumMessage/components/TextFormatting";
import EmojiPicker from "emoji-picker-react";
import FilePreview from "../forumMessage/components/FilePreview";
import { useAddThreadMessageMutation } from "features/ThreadMessages/ThreadMessagesApi";
import { useUpdateForumMessageMutation } from "features/forumMessage/forumMessageApi";
import LinkPreview from "../forumMessage/components/LinkPreview";

export function linkifyHtml(text: string): string {
  const urlRegex = /(\bhttps?:\/\/[^\s<]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" 
    style="color:blue;text-decoration:underline;">${url}</a>`;
  });
}

interface ThreadMessageInputProps {
  forumMessageId: string;
  onMessageSent?: () => void;
  ammuntOffThteadMessegase: number;
  setAmmuontOffThteadMessegase: (ammunt: number) => void;
}

export default function ThreadMessageInput({ forumMessageId, onMessageSent, ammuntOffThteadMessegase, setAmmuontOffThteadMessegase }: ThreadMessageInputProps) {
  const [messageHtml, setMessageHtml] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [updateForumMessage] = useUpdateForumMessageMutation()
  const [addThreadMessage] = useAddThreadMessageMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [ammuntOffThteadMessegase2, setAmmuntOffThteadMessegase2] = useState(ammuntOffThteadMessegase);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
        setSavedRange(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    if (contentRef.current) contentRef.current.focus();

    const selection = window.getSelection();
    if (savedRange) {
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
    }
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!contentRef.current?.contains(range.commonAncestorContainer)) return;

    range.deleteContents();
    range.insertNode(document.createTextNode(emoji));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    setMessageHtml(contentRef.current.innerHTML);
    contentRef.current.focus();
  };

  const applyColor = (color: string) => {
    document.execCommand("foreColor", false, color);
    if (contentRef.current) {
      contentRef.current.focus();
      setMessageHtml(contentRef.current.innerHTML);
    }
  };

  const updateFormattingState = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  const execCommand = (command: string) => {
    document.execCommand(command, false);
    if (contentRef.current) {
      contentRef.current.focus();
      setMessageHtml(contentRef.current.innerHTML);
      updateFormattingState();
    }
  };

  const onInput = () => {
    if (contentRef.current) {
      const newHtml = contentRef.current.innerHTML;
      setMessageHtml(newHtml);
    }
  };
  useEffect(() => {
    setAmmuntOffThteadMessegase2(ammuntOffThteadMessegase);
  }, [forumMessageId, ammuntOffThteadMessegase]);

  const handleUpdate = async () => {
    const updatedAmmunt = ammuntOffThteadMessegase2 + 1;
    setAmmuntOffThteadMessegase2(updatedAmmunt);
    await updateForumMessage({ id: forumMessageId, ammuntOffThteadMessegase: updatedAmmunt });
    setAmmuontOffThteadMessegase(updatedAmmunt);
    console.log("עדכון מספר ההודעות המשוררות בוצע בהצלחה", updatedAmmunt);
  };

  const sendMessage = async () => {
    const htmlWithLinks = linkifyHtml(messageHtml);
    if ((!messageHtml.trim() && !selectedFile) || !user?.id) return;
    const formData = new FormData();
    formData.append("forumMessage_id", forumMessageId);
    formData.append("sender_id", user.id);
    formData.append("content", htmlWithLinks || "");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    for (const [key, val] of formData.entries()) {
      console.log(`${key}:`, val, "→ typeof:", typeof val);
    }

    try {
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await addThreadMessage(formData).unwrap();
      console.log("הודעה משוררת נשלחה בהצלחה");
      handleUpdate();
      setMessageHtml("");
      contentRef.current!.innerHTML = "";
      setSelectedFile(null);
      setFilePreview(null);
      onMessageSent?.();
    } catch (err) {
      console.error("שגיאה בשליחת תגובה משוררת:", err);
      alert(JSON.stringify(err));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const openGoogleMeet = async () => {
    const url = `https://meet.google.com/new`;

    if (contentRef.current) {
      contentRef.current.focus();
      contentRef.current.innerHTML += url + "<br/>";
      setMessageHtml(contentRef.current.innerHTML);
      await sendMessage(); 
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        onKeyDown={handleKeyDown}
        style={{ display: "flex", alignItems: "center", width: "80%" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
            width: "90%",
            position: "relative",
          }}
        >
          {selectedFile && (
            <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #eee", textAlign: "right" }}>
              <FilePreview file={selectedFile} onRemove={() => {
                setSelectedFile(null);
                setFilePreview(null);
              }} />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "flex-end", padding: "0.5rem 1rem", gap: "0.75rem" }}>
            <Mic size={18} />
            <Upload size={18} onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer" }} />
            <Video size={18} style={{ cursor: "pointer" }} onClick={openGoogleMeet} />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            <span
              ref={emojiButtonRef}
              onMouseDown={() => {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0 && contentRef.current?.contains(sel.anchorNode)) {
                  setSavedRange(sel.getRangeAt(0));
                }
              }}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <Smile size={18} />
            </span>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} style={{ position: "absolute", bottom: "100%", right: 0, zIndex: 10 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <Underline size={18} onClick={() => setToolbarVisible((v) => !v)} style={{ cursor: "pointer" }} />
            <div
              ref={contentRef}
              contentEditable
              onInput={onInput}
              onMouseUp={updateFormattingState}
              onKeyUp={updateFormattingState}
              style={{
                wordBreak: "break-word",
                flex: 1,
                minHeight: "30px",
                maxHeight: "100px",
                overflowY: "auto",
                fontSize: "1rem",
                background: "transparent",
                direction: "rtl",
                textAlign: "right",
                fontFamily: "Arial",
                whiteSpace: "pre-wrap",
                outline: "none",
              }}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {toolbarVisible && (
            <TextFormatting
              onCommand={execCommand}
              onColorSelect={applyColor}
              formattingState={{ isBold, isItalic, isUnderline }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={messageHtml.trim() === "" && !selectedFile}
          style={{
            background: "none",
            border: "none",
            cursor: messageHtml.trim() === "" && !selectedFile ? "not-allowed" : "pointer",
            alignSelf: "flex-end",
          }}
        >
          <Send
            size={20}
            style={{
              transform: "rotate(180deg)",
              color: messageHtml.trim() === "" && !selectedFile ? "#a0a0a0" : "#444",
            }}
          />
        </button>
      </form>
    </div>
  );
}
