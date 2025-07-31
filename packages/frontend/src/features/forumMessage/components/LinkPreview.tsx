import { useLinkPreview } from "../useLinkPreview";

interface LinkPreviewProps {
  url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const preview = useLinkPreview(url);

  if (!preview) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        marginTop: "5px",
        maxWidth: "400px", 
        width: "100%",     
        maxHeight: "250px",
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
        direction: "rtl",
        textAlign: "right",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {preview.image && (
        <img
          src={preview.image}
          alt="preview"
          style={{
            maxWidth: "100%",
            maxHeight: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "0.5rem",
            display: "block",
          }}
        />
      )}
      <div>
        {preview.title && (
          <strong style={{ display: "block", fontSize: "1rem", marginBottom: "4px" }}>
            {preview.title}
          </strong>
        )}
        {preview.description && (
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: "3.6em",
              lineHeight: "1.2em",
            }}
          >
            {preview.description}
          </p>
        )}
      </div>
    </a>
  );
}
