import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { 
  Typography, 
  Box, 
  Tooltip, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import { 
  CheckCircle, 
  Error, 
  Close,
  FileUpload,
  People
} from "@mui/icons-material";
import { usePapaParse } from "react-papaparse";
import { User } from "../usersTypes";
import { validateUser } from "../components/validateUser";

interface Props {
  onUsersAdded: (users: User[]) => void;
}

interface CsvRow {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
}

export default function ImportCsvButton({ onUsersAdded }: Props) {
  const { readString } = usePapaParse();
  const [report, setReport] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: [],
  });
  const [showReport, setShowReport] = useState(false);
  const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/emails")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.emails)) {
          setExistingEmails(new Set(data.emails.map((e: string) => e.toLowerCase())));
        }
      });
  }, []);

  /**
   * פונקציה המטפלת בטעינת קובץ CSV, מייצרת משתמשים חדשים מהנתונים,
   * בודקת את תקינותם, שולחת אותם לשרת, ומדווחת על הצלחות וכישלונות.
   */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      readString<CsvRow>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          switch (header.trim()) {
            case "שם פרטי":
              return "first_name";
            case "שם משפחה":
              return "last_name";
            case "אימייל":
              return "email";
            case "טלפון":
              return "phone";
            case "תפקיד":
              return "role";
            case "סיסמה":
              return "password";
            default:
              return header;
          }
        },
        complete: async (results) => {
          setLoading(true);
          let successCount = 0;
          let failCount = 0;
          const errorsArr: string[] = [];
          const newUsers: User[] = [];

          for (const row of results.data) {
            const user: User = {
              id: crypto.randomUUID(),
              firstName: row.first_name?.trim() || "",
              lastName: row.last_name?.trim() || "",
              email: (row.email?.trim() || "").toLowerCase(),
              phone: row.phone
                ? String(row.phone).padStart(10, "0").trim()
                : "",
              role: row.role === "manager" ? "manager" : "student",
              createdAt: new Date(),
              password: row.password?.trim() || "NNnn1212!",
            };

            const validationErrors = validateUser({
              user,
              isNewUser: true,
              existingEmails,
            });

            if (Object.keys(validationErrors).length > 0) {
              failCount++;
              errorsArr.push(`שגיאה ב-${user.email}: ${Object.values(validationErrors).join(", ")}`);
              continue;
            }

            try {
              const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
              });

              const data = await res.json();
              if (data.success) {
                successCount++;
                newUsers.push(user);
                existingEmails.add(user.email);
              } else {
                failCount++;
                errorsArr.push(`שגיאה ב-${user.email}: ${data.message || "שגיאה לא ידועה"}`);
              }
            } catch (err) {
              failCount++;
              errorsArr.push(`שגיאה ב-${user.email}: ${String(err)}`);
            }
          }

          setReport({ success: successCount, failed: failCount, errors: errorsArr });
          setShowReport(true);
          onUsersAdded(newUsers);
          setLoading(false);
        },
        error: (err) => {
          setLoading(false);
        },
      });
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  const tooltipText = `קובץ בסיומת csv 
השדות:
שם פרטי: לפחות 2 תווים, רק אותיות ורווח
שם משפחה: לפחות 2 תווים, רק אותיות ורווח
מייל: מייל תקין ויחודי
טלפון: עשר ספרות
תפקיד: מנהל או סטודנט

מייל שקיים במערכת לא יכניס שוב
`;

  return (
    <>
      <input
        id="csv-file-input"
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFile}
        disabled={loading}
      />
      <label htmlFor="csv-file-input">
        <Tooltip title={<Typography style={{ whiteSpace: "pre-line" }}>{tooltipText}</Typography>}>
          <Button 
            variant="outlined" 
            component="span" 
            disabled={loading}
            startIcon={<FileUpload />}
            sx={{ minWidth: 150 }}
          >
         -הכנסת משתמשים     
          </Button>
        </Tooltip>
      </label>

      {loading && (
        <Box display="flex" alignItems="center" mt={2} gap={1}>
          <CircularProgress size={24} />
          <Typography>טעינת המשתמשים...</Typography>
        </Box>
      )}

      {/* Beautiful Popup Dialog */}
      <Dialog 
        open={showReport} 
        onClose={handleCloseReport}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <People color="primary" />
              <Typography variant="h6" component="div">
                דוח יבוא משתמשים
              </Typography>
            </Box>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleCloseReport}
              sx={{ ml: 1 }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box mb={2}>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                icon={<CheckCircle />}
                label={`${report.success} הצלחות`}
                color="success"
                variant="outlined"
                sx={{ 
                  fontSize: '1rem',
                  height: 40,
                  '& .MuiChip-icon': { fontSize: '1.2rem' }
                }}
              />
              <Chip
                icon={<Error />}
                label={`${report.failed} כישלונות`}
                color="error"
                variant="outlined"
                sx={{ 
                  fontSize: '1rem',
                  height: 40,
                  '& .MuiChip-icon': { fontSize: '1.2rem' }
                }}
              />
            </Box>

            {report.success > 0 && (
              <Alert 
                severity="success" 
                sx={{ mb: 2, borderRadius: 2 }}
                icon={<CheckCircle />}
              >
                <Typography variant="body1">
                  {report.success} משתמשים נוספו בהצלחה למערכת!
                </Typography>
              </Alert>
            )}

            {report.failed > 0 && report.errors.length > 0 && (
              <>
                <Alert 
                  severity="error" 
                  sx={{ mb: 2, borderRadius: 2 }}
                  icon={<Error />}
                >
                  <Typography variant="body1" gutterBottom>
                    נמצאו {report.failed} שגיאות:
                  </Typography>
                </Alert>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  פרטי השגיאות:
                </Typography>
                
                <Box
                  sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.300'
                  }}
                >
                  <List dense sx={{ py: 0 }}>
                    {report.errors.map((err, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="body2" 
                              color="error.main"
                              sx={{ 
                                wordBreak: 'break-word',
                                fontSize: '0.875rem'
                              }}
                            >
                              • {err}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseReport} 
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}