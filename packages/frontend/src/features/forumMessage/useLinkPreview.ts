import { useEffect, useState } from "react";

interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

export function useLinkPreview(url: string | null) {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchPreview = async () => {
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (!res.ok) return;
        const data = await res.json();
        setPreview(data);
      } catch (e) {
        console.error("שגיאה בשליפת preview", e);
      } 
    };

    fetchPreview();
  }, [url]);

  return preview;
}
