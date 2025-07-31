import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { useGetMatchingCandidatesQuery } from "../admin/jobsAdmin/adminJobsApi";

interface Props {
  jobId: string;
  onClose: () => void;
}

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";

const SmartMatchingResults: React.FC<Props> = ({ jobId, onClose }) => {
  const { data, isLoading, error } = useGetMatchingCandidatesQuery(jobId);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const handleDownload = async (url: string, filename: string, id: string) => {
    try {
      setDownloadingId(id);
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("ההורדה נכשלה. נסה שוב מאוחר יותר.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      hideBackdrop // מסיר רקע שחור
      PaperProps={{
        style: {
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Typography variant="h6" component="div" sx={{ textAlign: "center" }}>
            מועמדים מתאימים למשרה
          </Typography>
          {/* כפתור סגירה ימני */}
          <IconButton
            onClick={onClose}
            aria-label="סגור"
            sx={{ position: "absolute", right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">שגיאה בטעינת התאמות</Alert>}

        {!isLoading && data && data.length === 0 && (
          <Typography color="textSecondary" align="center">
            לא נמצאו מועמדים תואמים
          </Typography>
        )}

        {data && data.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">ציון התאמה</TableCell>
                <TableCell align="right">קובץ קורות חיים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((match) => {
                const resumeUrl = match.resumeUrl || "";
                const decodedPath = decodeURIComponent(resumeUrl);
                const cleanedPath = decodedPath
                  .replace("/api/resumes/", "")
                  .replace(/^\/+/, "");

                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/user-files-uploads/${cleanedPath}`;

                return (
                  <TableRow key={match.id}>
                    <TableCell align="right">
                      {(match.score * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() =>
                          handleDownload(
                            publicUrl,
                            `resume_${match.id}.docx`,
                            match.id
                          )
                        }
                        disabled={downloadingId === match.id}
                        variant="text"
                        sx={{
                          color: "#5E00B8",
                          textTransform: "none",
                          textDecoration: "underline",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                          "&:hover": {
                            backgroundColor: "transparent", 
                          },
                        }}
                        startIcon={
                          downloadingId === match.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DownloadIcon />
                          )
                        }
                      >
                        {downloadingId === match.id ? "מוריד..." : "הורד קובץ"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartMatchingResults;
