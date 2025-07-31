// import React, { useState } from 'react';
// import {
//   Card, CardMedia, CardContent, Typography,
//   Button, CardActions, Collapse, Box
// } from '@mui/material';
// import {
//   ExpandMore as ExpandMoreIcon,
//   Edit as EditIcon,
//   Launch as LaunchIcon
// } from '@mui/icons-material';
// import { Project } from './projectTypes';
// import DeleteProjectButton from './DeleteProjectButton';
// import ProjectEditForm from './ProjectEditForm';

// interface ProjectCardProps {
//   project: Project;
//   isExpanded: boolean;
//   onExpandToggle: () => void;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, isExpanded, onExpandToggle }) => {
//   const [editMode, setEditMode] = useState(false);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Card
//         sx={{
//           width: 340,
//           borderRadius: 4,
//           boxShadow: 6,
//           overflow: 'hidden',
//           position: 'relative',
//           transition: 'transform 0.3s, box-shadow 0.3s',
//           '&:hover': {
//             transform: 'scale(1.015)',
//             boxShadow: 10
//           }
//         }}
//       >
//         <DeleteProjectButton id={project.id} />

//         <CardMedia
//           component="img"
//           height="200"
//           image={project.imageUrl}
//           alt={project.title}
//           sx={{ objectFit: 'cover' }}
//         />

//         <Box
//           sx={{
//             backgroundColor: 'rgba(15, 79, 168, 0.9)',
//             color: '#fff',
//             py: 1,
//             px: 2,
//             textAlign: 'center'
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold" noWrap>
//             {project.title}
//           </Typography>
//         </Box>

//         <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
//           <Button
//             size="small"
//             variant="outlined"
//             color="primary"
//             onClick={onExpandToggle}
//             endIcon={<ExpandMoreIcon />}
//           >
//             {isExpanded ? 'סגור' : 'פרטים'}
//           </Button>
//           <Button
//             size="small"
//             variant="contained"
//             color="primary"
//             onClick={() => setEditMode(true)}
//             startIcon={<EditIcon />}
//           >
//             ערוך
//           </Button>
//         </CardActions>

//         <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//           <CardContent sx={{ bgcolor: '#f9f9f9' }}>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               {project.description}
//             </Typography>
//             <Button
//               href={project.linkUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               endIcon={<LaunchIcon />}
//               color="primary"
//             >
//               לצפייה בפרויקט
//             </Button>
//           </CardContent>
//         </Collapse>
//       </Card>

//       <ProjectEditForm
//         open={editMode}
//         project={project}
//         onClose={() => setEditMode(false)}
//       />
//     </Box>
//   );
// };

// export default ProjectCard;


import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography,
  Button, CardActions, Collapse, Box
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { Project } from './projectTypes';
import DeleteProjectButton from './DeleteProjectButton';
import ProjectEditForm from './ProjectEditForm';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isExpanded, onExpandToggle }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card
        sx={{
          width: 340,
          borderRadius: 4,
          boxShadow: 6,
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.015)',
            boxShadow: 10
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={project.imageUrl}
          alt={project.title}
          sx={{ objectFit: 'cover' }}
        />

        <Box
          sx={{
            backgroundColor: 'rgba(15, 79, 168, 0.9)',
            color: '#fff',
            py: 1,
            px: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold" noWrap>
            {project.title}
          </Typography>
        </Box>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={onExpandToggle}
            endIcon={<ExpandMoreIcon />}
            sx={{ textTransform: 'none' }}
          >
            {isExpanded ? 'סגור' : 'פרטים'}
          </Button>

          <Box>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setEditMode(true)}
              startIcon={<EditIcon />}
              sx={{ textTransform: 'none', mr: 1 }}
            >
              ערוך
            </Button>
            <DeleteProjectButton id={project.id} />
          </Box>
        </CardActions>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ bgcolor: '#f9f9f9' }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {project.description}
            </Typography>
            <Button
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LaunchIcon />}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              לצפייה בפרויקט
            </Button>
          </CardContent>
        </Collapse>
      </Card>

      <ProjectEditForm
        open={editMode}
        project={project}
        onClose={() => setEditMode(false)}
      />
    </Box>
  );
};

export default ProjectCard;
