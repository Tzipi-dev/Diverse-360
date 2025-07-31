import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchProjects, removeProject } from './projectsSlice';
import ProjectCard from './ProjectsCard';
import { Project } from './projectTypes';
import ProjectsCreateForm from './ProjectsCreateForm';
import ProjectsTable from './ProjectsTable';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';

const ProjectsAdmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const validProjects = projects.filter(
    (project): project is Project => !!project && !!project.id
  );

  const totalProjects = validProjects.length;
  const activeProjects = validProjects.filter(p => p.isActive).length;
  const inactiveProjects = totalProjects - activeProjects;


  const handleExpandToggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleDelete = (id: string) => {
    dispatch(removeProject(id));
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: 40,
  };

  const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    padding: 20,
  };

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    
    <div>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1, mb: 1 }}>
        {[
          { label: "סה\"כ", value: totalProjects, color: 'primary' },
          { label: "פעילים", value: activeProjects, color: 'green' },
          { label: "לא פעילים", value: inactiveProjects, color: 'error' }
        ].map((item) => (
          <Paper
            key={item.label}
            sx={{
              px: 1,
              py: 0.5,
              width: 70,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2,
            }}
            elevation={1}
          >
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
              {item.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: item.color === 'green' ? 'green' : item.color
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <ProjectsCreateForm open={showCreateForm} onClose={() => setShowCreateForm(false)} />

      <div style={headerStyle}>
        <Typography variant="h4" gutterBottom>ניהול פרויקטים</Typography>

        <Button
          onClick={() => setShowCreateForm(true)}
          sx={{
            padding: '10px 20px',
            borderRadius: 2,
            backgroundColor: '#0F4FA8',
            color: 'white',
            '&:hover': { backgroundColor: '#0c3d84' },
            marginTop: 2,
          }}
        >
          הוספת פרויקט
        </Button>

        <Box sx={{ mt: 4 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            aria-label="view mode"
          >
            <ToggleButton value="cards" aria-label="Card View">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label="Table View">
              <TableRowsIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </div>

      {viewMode === 'cards' ? (
        <div style={gridStyle}>
          {validProjects.length > 0 ? (
            validProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedId === project.id}
                onExpandToggle={() => handleExpandToggle(project.id)}
              />
            ))
          ) : (
            <p>אין פרויקטים להצגה.</p>
          )}
        </div>
      ) : (
        <ProjectsTable projects={validProjects} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ProjectsAdmin;
