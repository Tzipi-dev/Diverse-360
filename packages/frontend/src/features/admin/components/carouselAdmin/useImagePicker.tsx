// useImagePicker.tsx - בלי שינוי משמעותי מלבד הסבר שהקריאה ל-requestAccessToken צריכה להיות ישירה מאירוע משתמש.


import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../../../../config/supabaseConfig";


declare global {
  interface Window {
    google?: any;
  }
}


export const useImagePicker = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [loadingSupabaseImages, setLoadingSupabaseImages] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleDriveImages, setGoogleDriveImages] = useState<{ id: string; name: string; thumbnailLink: string }[]>([]);
  // const [googlePhotosImages, setGooglePhotosImages] = useState<
  //   { id: string; baseUrl: string; filename: string; creationTime?: string }[]
  // >([]);
  const tokenClientRef = useRef<any>(null);
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID!;


  const initTokenClient = useCallback(() => {
    if (!window.google) {
      console.error("Google API not available yet");
      return;
    }
  tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/photoslibrary.readonly",
      // prompt: "consent",
      callback: (tokenResponse:any) => {
        console.log("Token response", tokenResponse); // 🔍 חשוב מאוד
        setAccessToken(tokenResponse.access_token);
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokenResponse.access_token}`)
        .then(r => r.json())
        .then(info => console.log("🔍 מחברות טוקן בפועל:", info))
        .catch(err => console.error(err));
      },
    });
  }, [GOOGLE_CLIENT_ID]);


  useEffect(() => {
    if (document.getElementById("google-identity-script")) {
      initTokenClient();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity-script";
    script.onload = () => {
      initTokenClient();
    };
    document.head.appendChild(script);
  }, [initTokenClient]);


  // חשוב: קריאה זו צריכה להיעשות ישירות מתוך אירוע משתמש (כגון לחיצה)
  const requestAccessToken = () => {
    if (!tokenClientRef.current) {
      initTokenClient();
    }
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    } else {
      console.warn("Token client not ready yet");
    }
  };


  // שאר הפונקציות (למשל pickFromDrive, pickFromPhotos) לא קוראות ל-requestAccessToken בעצמן,
  // אלא מחכות שהטוקן יגיע (מאירוע לחיצה) ואז יקראו אותן.


  // לדוגמה:
  const pickFromDrive = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType contains 'image/' and trashed = false&fields=files(id,name,thumbnailLink)&pageSize=20",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      setGoogleDriveImages(data.files || []);
    } catch (err) {
      console.error("שגיאה בגישה ל־Google Drive:", err);
    }
  };


// const loadPhotosImages = async () => {
//   if (!accessToken) return;


//   // 🔍 בדיקה: אילו הרשאות יש בטוקן?
//   try {
//     const tokenInfoRes = await fetch(
//       "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + accessToken
//     );
//     const tokenInfo = await tokenInfoRes.json();
//     console.log("🔍 Token info:", tokenInfo);
//   } catch (err) {
//     console.error("שגיאה בבדיקת הסקופים של הטוקן:", err);
//   }


//   // 📷 ניסיון לשלוף תמונות מה־Photos API
//   try {
//     const res = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=50", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     const data = await res.json();
//     console.log("Google Photos response:", data);
//     setGooglePhotosImages(data.mediaItems || []);
//   } catch (err) {
//     console.error("שגיאה בטעינת תמונות Google Photos:", err);
//   }
// };
// console.log(accessToken)




  // שאר הקוד נשאר כמו שהבאת


  return {
    selectedFile,
    fileInputRef,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) setSelectedFile(file);
    },
    pickFromComputer: () => fileInputRef.current?.click(),
    pickFromSupabase: async () => {
      setLoadingSupabaseImages(true);
      const { data, error } = await supabase.storage.from("images").list("", { limit: 100 });
      if (error) {
        console.error("שגיאה בשליפת תמונות Supabase:", error);
        setSupabaseImages([]);
      } else {
        const urls = data.map((file) => {
          const { data } = supabase.storage.from("images").getPublicUrl(file.name);
          return data?.publicUrl || "";
        });
        setSupabaseImages(urls);
      }
      setLoadingSupabaseImages(false);
    },
    selectSupabaseImage: async (url: string) => {
      const blob = await fetch(url).then((r) => r.blob());
      const file = new File([blob], "supabase_image.jpg", { type: blob.type });
      setSelectedFile(file);
    },
    pickFromDrive,
    googleDriveImages,
    selectDriveImage: async (id: string, name: string) => {
      try {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const blob = await res.blob();
        const file = new File([blob], name, { type: blob.type });
        setSelectedFile(file);
      } catch (err) {
        console.error("שגיאה בהורדת תמונה מ־Drive:", err);
      }
    },
    requestAccessToken,
    accessToken,
    // googlePhotosImages,
    // loadPhotosImages,
    setSelectedFile,
    // pickFromPhotos: async () => {
    //   if (!accessToken) return;
    //   await loadPhotosImages();
    // },
    loadingSupabaseImages,
    supabaseImages,
  };
};


