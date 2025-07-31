
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Upload, Smile, Underline, Video } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import TextFormatting from "./components/TextFormatting";
import FilePreview from "./components/FilePreview";
import EmojiPicker from "emoji-picker-react";
import AudioMessagePreview from "./components/AudioMessagePreview"
import { useUploadAudioMutation, useAddForumMessageMutation } from "./forumMessageApi";
import FilePreviewMessage from "./components/FilePreviewMessage";

export function linkifyHtml(text: string): string {
  const urlRegex = /(\bhttps?:\/\/[^\s<]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:blue;text-decoration:underline;">${url}</a>`;
  });
}


interface MessageInputProps {
  forumId: string;
  initialDraft?: string;
  onDraftChange?: (content: string) => void;
  onMessageSent?: () => void;
}

export default function MessageInput({ forumId, initialDraft, onDraftChange, onMessageSent }: MessageInputProps) {
  const [messageHtml, setMessageHtml] = useState<string>(initialDraft || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // --- קוד להקלטות ---
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);

  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const [uploadAudio] = useUploadAudioMutation();
  const [addForumMessage] = useAddForumMessageMutation()
useEffect(() => {
  if (contentRef.current) {
    contentRef.current.focus();
  }
}, []);

useEffect(() => {
  setTimeout(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      el.focus();

      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, 50);
}, [forumId]);

useEffect(() => {
  if (contentRef.current && initialDraft !== undefined) {
    const el = contentRef.current;
    if (el.innerHTML !== initialDraft) {
      el.innerHTML = initialDraft;
      setMessageHtml(initialDraft);

      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }
}, [initialDraft]);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      showEmojiPicker &&
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      emojiButtonRef.current &&
      !emojiButtonRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
      setSavedRange(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showEmojiPicker]);

  // useEffect(() => {
  //   if (contentRef.current) {
  //     contentRef.current.focus();
  //   }
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (contentRef.current) {
  //       const el = contentRef.current;
  //       el.focus();

  //       const range = document.createRange();
  //       range.selectNodeContents(el);
  //       range.collapse(false);

  //       const sel = window.getSelection();
  //       sel?.removeAllRanges();
  //       sel?.addRange(range);
  //     }
  //   }, 50);
  // }, [forumId]);

  // useEffect(() => {
  //   if (contentRef.current && initialDraft !== undefined) {
  //     const el = contentRef.current;
  //     if (el.innerHTML !== initialDraft) {
  //       el.innerHTML = initialDraft;
  //       setMessageHtml(initialDraft);
  //       const range = document.createRange();
  //       range.selectNodeContents(el);
  //       range.collapse(false);
  //       const sel = window.getSelection();
  //       sel?.removeAllRanges();
  //       sel?.addRange(range);
  //     }
  //   }
  // }, [initialDraft]);

  // useEffect(() => {
  //   if (contentRef.current) {
  //     contentRef.current.focus();
  //   }
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (contentRef.current) {
  //       const el = contentRef.current;
  //       el.focus();
  //       const range = document.createRange();
  //       range.selectNodeContents(el);
  //       range.collapse(false);
  //       const sel = window.getSelection();
  //       sel?.removeAllRanges();
  //       sel?.addRange(range);
  //     }
  //   }, 50);
  // }, [forumId]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       showEmojiPicker &&
  //       emojiPickerRef.current &&
  //       !emojiPickerRef.current.contains(event.target as Node) &&
  //       emojiButtonRef.current &&
  //       !emojiButtonRef.current.contains(event.target as Node)
  //     ) {
  //       setShowEmojiPicker(false);
  //       setSavedRange(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [showEmojiPicker]);

function getFileIcon(fileType: string): string {
  if (fileType.includes("word")) return "/icons/word-icon.svg";
  if (fileType.includes("excel")) return "/icons/excel-icon.svg";
  if (fileType.includes("pdf")) return "/icons/pdf-icon.svg";
  if (fileType.includes("zip")) return "/icons/zip-icon.svg";
  return "/icons/file-icon.svg"; // ברירת מחדל
}

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
      onDraftChange?.(newHtml);
    }
  };

  const startRecording = async () => {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.mp3`, {
          type: 'audio/mp3',
        });
        setSelectedFile(audioFile);
        setFilePreview(URL.createObjectURL(audioFile));
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("הקלטה נכשלה:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  //   const onInput = () => {
  //   if (contentRef.current) {
  //     const newHtml = contentRef.current.innerHTML;
  //     setMessageHtml(newHtml);
  //     onDraftChange?.(newHtml);
  //   }
  // };

  const sendMessage = async () => {
    if ((!messageHtml.trim() && !selectedFile) || !user?.id) return;

    try {
      const htmlWithLinks = linkifyHtml(messageHtml); 
      const formData = new FormData();
      formData.append("forum_id", forumId);
      formData.append("sender_id", user.id);
      formData.append("content", htmlWithLinks);

      if (selectedFile && selectedFile.type.startsWith("audio/")) {

        const audioForm = new FormData();
        audioForm.append("forum_id", forumId);
        audioForm.append("sender_id", user.id);
        audioForm.append("file", selectedFile);

        const result = await uploadAudio(audioForm).unwrap();

        formData.append("file_url", result.file_url);
        formData.append("file_name", selectedFile.name);
        formData.append("file_type", selectedFile.type);
      }

      if (selectedFile && !selectedFile.type.startsWith("audio/")) {
        formData.append("file", selectedFile);
        formData.append("file_type", selectedFile.type);
      }

      // await addForumMessage(formData).unwrap();
      await addForumMessage(formData as any).unwrap();

      setMessageHtml("");
      if (contentRef.current) contentRef.current.innerHTML = "";
      setToolbarVisible(false);
      setSelectedFile(null);
      setFilePreview(null);
      onMessageSent?.();
    } catch (error) {
      console.error("שגיאה בשליחת הודעה:", error);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setSelectedFile(file);
  // if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
  //   const url = URL.createObjectURL(file);
  //   setFilePreview(url);
  // } else {
  //   setFilePreview(null);
  // }

  // };
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
    await sendMessage(); // שליחה מידית
  }
};

  const handleEmojiMartSelect = (emoji: any) => {
    const emojiChar = emoji.native;
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
    range.insertNode(document.createTextNode(emojiChar));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    setMessageHtml(contentRef.current.innerHTML);
    contentRef.current.focus();
  };

  const handleCancelAudioPreview = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

const renderFilePreview = () => {
  if (!selectedFile) return null;

  // יצירת URL לתצוגה (אם אין כבר קיים)
  const fileUrl = filePreview || URL.createObjectURL(selectedFile);

  return (
    <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #eee", textAlign: "right", position: "relative" }}>
      <FilePreviewMessage
        fileUrl={fileUrl}
        fileName={selectedFile.name}
      />
      <button
        onClick={() => {
          setSelectedFile(null);
          setFilePreview(null);
        }}
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          background: "transparent",
          border: "none",
          color: "red",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1.2rem",
          lineHeight: 1,
        }}
        aria-label="הסר קובץ"
      >
        ×
      </button>
    </div>
  );
};

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} style={{ display: 'flex', alignItems: "center", width: "80%" }}>

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

          {/* {filePreview && selectedFile?.type.startsWith("audio/") && (
            // <AudioMessagePreview fileUrl={filePreview} />

          )} */}
          {/* {filePreview && selectedFile?.type.startsWith("audio/") && (
            <AudioMessagePreview
              fileUrl={filePreview}
              onCancel={handleCancelAudioPreview}
            />
          )}
          {filePreview && !selectedFile?.type.startsWith("audio/") && (
            <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #eee", textAlign: "right" }}>
              <FilePreview
                file={selectedFile!}
                onRemove={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
              />
            </div>
          )} */}

{selectedFile && selectedFile.type.startsWith("audio/") && filePreview && (
  <AudioMessagePreview
    fileUrl={filePreview}
    onCancel={handleCancelAudioPreview}
  />
)}

{selectedFile && !selectedFile.type.startsWith("audio/") && (
  <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #eee", textAlign: "right" }}>
    <FilePreview
      file={selectedFile}
      onRemove={() => {
        setSelectedFile(null);
        setFilePreview(null);
      }}
    />
  </div>
)}

          <div style={{ display: "flex", alignItems: "flex-end", padding: "0.5rem 1rem", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  height: 24,
                  width: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                aria-label={isRecording ? "הפסק הקלטה" : "התחל הקלטה"}
              >
                <Mic color={isRecording ? "red" : "black"} size={18} />
              </button>

              <Upload size={18} style={{ cursor: "pointer" }} onClick={handleUploadClick} />
              <Video size={18} style={{ cursor: "pointer" }} onClick={openGoogleMeet} />

              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

              <span
                ref={emojiButtonRef}
                onMouseDown={() => {
                  const selection = window.getSelection();
                  if (
                    selection &&
                    selection.rangeCount > 0 &&
                    contentRef.current?.contains(selection.anchorNode)
                  ) {
                    setSavedRange(selection.getRangeAt(0));
                  }
                }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <Smile size={18} />

              </span>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    zIndex: 10
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}



              <Underline
                size={18}
                onClick={() => setToolbarVisible((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </div>

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
              color: messageHtml.trim() === "" && !selectedFile ? "#a0a0a0" : "#444444",
            }}
          />
        </button>
      </form>
    </div>
  );
}
