import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGetResumesByJobIdQuery } from '../../jobs/resumeApi';
import { Resume } from '../../../../../backend/src/models/ResumeModel';

interface ViewApplicantsModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

const ViewApplicantsModal: React.FC<ViewApplicantsModalProps> = ({ open, onClose, jobId, jobTitle }) => {
  const { data: resumes, isLoading, error } = useGetResumesByJobIdQuery(jobId, { skip: !open || !jobId });

  const handleDownloadResume = (filePath: string) => {
    const encodedPath = encodeURIComponent(filePath);
    window.open(`http://localhost:3001/api/resumes/${encodedPath}`, '_blank');
  };

  const handleViewResume = (filePath: string) => {
    const encodedPath = encodeURIComponent(filePath);
    window.open(`http://localhost:3001/api/resumes/view/${encodedPath}`, '_blank');
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '90%' : '800px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="view-applicants-modal-title"
      aria-describedby="view-applicants-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="view-applicants-modal-title"
          variant={isSmallScreen ? 'h6' : 'h5'}
          component="h2"
          sx={{ mb: 2, textAlign: 'center' }}
        >
          מועמדות למשרה: {jobTitle}
        </Typography>

        <Typography id="view-applicants-modal-description" sx={{ mt: 1, textAlign: 'center' }}>
          רשימת קורות החיים שהוגשו למשרה זו.
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>טוען מועמדות...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            שגיאה בטעינת המועמדות: {(error as any).message || 'שגיאה לא ידועה'}
          </Typography>
        ) : !resumes || resumes.length === 0 ? (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            עדיין אין מועמדות למשרה זו.
          </Typography>
        ) : (
          <List sx={{ width: '100%', mt: 3 }}>
            {resumes.map((resume: Resume) => (
              <ListItem
                key={resume.id}
                secondaryAction={
                  <>
                    <Tooltip title="צפייה בקורות חיים">
                      <IconButton edge="end" aria-label="view" onClick={() => handleViewResume(resume.file_path)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הורדת קורות חיים">
                      <IconButton edge="end" aria-label="download" onClick={() => handleDownloadResume(resume.file_path)}>
                        <GetAppIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
                sx={{
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <ListItemText
                  secondary={`הוגש בתאריך: ${new Date(resume.uploaded_at).toLocaleDateString('he-IL')}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default ViewApplicantsModal;
