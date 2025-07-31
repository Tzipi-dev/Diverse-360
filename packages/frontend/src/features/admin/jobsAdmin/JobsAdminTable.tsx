
import React, { useState } from 'react';
import { IconButton, Tooltip, Chip, Dialog, DialogContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGetJobsQuery } from './adminJobsApi';
import { Job } from '../../../types/jobsTypes';
import EditJobModal from './EditJobModal';
import Card from '../../../globalComponents/ui/Card';
import DeleteJobDialog from './DeleteJobDialog';
import ViewApplicantsModal from './ViewApplicantsModal';
import SmartMatchingResults from '../SmartMatchingResults';

const JobsAdminCards: React.FC = () => {
  const {
    data: jobs = [],
    isLoading,
    error
  } = useGetJobsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 3000
  });

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<Job | null>(null);

  const handleOpenDeleteDialog = (jobId: string) => {
    setJobIdToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setJobIdToDelete(null);
    setDeleteDialogOpen(false);
  };

  const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  const handleOpenViewApplicantsModal = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setIsViewApplicantsModalOpen(true);
  };

  const handleCloseViewApplicantsModal = () => {
    setIsViewApplicantsModalOpen(false);
    setSelectedJobId(null);
    setSelectedJobTitle('');
  };

  if (isLoading) return <p>טוען משרות...</p>;
  if (error) return <p>שגיאה בטעינת המשרות</p>;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '24px',
          justifyContent: 'center'
        }}
      >
        {jobs.map((job: Job) => (
          <div
            key={job.id}
            style={{
              flex: '1 1 300px',
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              borderRadius: 'var(--border-radius)',
              backgroundColor: 'white',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: 'auto',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
            }}
          >
            <Card
              title={job.title}
              description=""
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  flexGrow: 1,
                  padding: '10px',
                }}
              >
                <p><strong>מיקום:</strong> {job.location?.slice(0, 50)}</p>
                <p><strong>תיאור:</strong> {job.description?.slice(0, 50)}...</p>
                <p><strong>דרישות:</strong> {job.requirements?.slice(0, 50)}...</p>

                <div>
                  <strong>סטטוס:</strong>{' '}
                  {job.isActive ? (
                    <Chip label="פעילה" color="success" size="small" />
                  ) : (
                    <Chip label="לא פעילה" color="default" size="small" />
                  )}
                </div>

                <p>
                  <strong>סוג משרה:</strong>{' '}
                  {job.workMode || "לא צוין"}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '4px'
                }}
              >
                <Tooltip title="עריכה">
                  <IconButton
                    onClick={() => setEditingJob(job)}
                    style={{
                      color: '#6c757d',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="מחיקה">
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(job.id)}
                    style={{
                      color: '#6c757d',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="צפייה במועמדות">
                  <IconButton
                    onClick={() => handleOpenViewApplicantsModal(job.id, job.title)} // <-- זהו המיקום הנכון היחיד של הקריאה לפונקציה זו!
                    style={{
                      color: '#6c757d',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="התאמה חכמה עם AI">
                  <IconButton
                    onClick={() => setSelectedJobForMatch(job)}
                    style={{
                      color: '#6c757d',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                    }}
                  >
                    🤖
                  </IconButton>
                </Tooltip>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {editingJob && (
        <EditJobModal
          open={true}
          job={editingJob}
          onCancel={() => setEditingJob(null)}
          onSave={() => setEditingJob(null)}
        />
      )}

      <DeleteJobDialog
        open={deleteDialogOpen}
        jobId={jobIdToDelete}
        onClose={handleCloseDeleteDialog}
        afterDelete={() => { }}
      />

      {/* מודל צפייה במועמדות */}
      {isViewApplicantsModalOpen && selectedJobId && (
        <ViewApplicantsModal
          open={isViewApplicantsModalOpen}
          onClose={handleCloseViewApplicantsModal}
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
        />
      )}

      {/* תוצאות התאמה חכמה - דיאלוג מעוצב */}
      {selectedJobForMatch && (
        <Dialog
          open={Boolean(selectedJobForMatch)}
          onClose={() => setSelectedJobForMatch(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{ style: { borderRadius: 12, padding: 16 } }}
        >
          <DialogContent style={{ padding: 0 }}>
            <SmartMatchingResults
              jobId={selectedJobForMatch.id}
              onClose={() => setSelectedJobForMatch(null)}
            />
          </DialogContent>
        </Dialog>
      )}

    </>
  );
};
export default JobsAdminCards;
