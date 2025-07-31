// import React, { useState } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Button, Typography, Stack
// } from '@mui/material';
// import { Launch } from '@mui/icons-material';
// import { Project } from './projectTypes';
// import ProjectEditForm from './ProjectEditForm';
// import DeleteProjectButton from './DeleteProjectButton';

// interface Props {
//   projects: Project[];
//   onDelete: (id: string) => void; // לא בשימוש, נשאר רק בשביל התאמה
// }

// const ProjectsTable: React.FC<Props> = ({ projects }) => {
//   const [editProject, setEditProject] = useState<Project | null>(null);

//   return (
//     <>
//       <TableContainer component={Paper} sx={{ mt: 4, mx: 'auto', maxWidth: 1200, borderRadius: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ bgcolor: '#f0f4fa' }}>
//               <TableCell align="right"><strong>תמונה</strong></TableCell>
//               <TableCell align="right"><strong>כותרת</strong></TableCell>
//               <TableCell align="right"><strong>תיאור</strong></TableCell>
//               <TableCell align="right"><strong>קישור</strong></TableCell>
//               <TableCell align="right"><strong>פעולות</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {projects.map(project => (
//               <TableRow key={project.id} hover>
//                 <TableCell align="right">
//                   <img
//                     src={project.imageUrl}
//                     alt={project.title}
//                     style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }}
//                   />
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography fontWeight="bold">{project.title}</Typography>
//                 </TableCell>
//                 <TableCell align="right" sx={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
//                   <Typography variant="body2" textAlign="right">
//                     {project.description}
//                   </Typography>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Button
//                     href={project.linkUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     variant="outlined"
//                     endIcon={<Launch />}
//                     size="small"
//                   >
//                     לצפייה
//                   </Button>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Stack direction="row" spacing={1} justifyContent="flex-end">
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => setEditProject(project)}
//                     >
//                       ערוך
//                     </Button>
//                     <DeleteProjectButton id={project.id} />
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {editProject && (
//         <ProjectEditForm
//           open={true}
//           project={editProject}
//           onClose={() => setEditProject(null)}
//         />
//       )}
//     </>
//   );
// };

// export default ProjectsTable;



import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography, Stack, Box
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import { Project } from './projectTypes';
import ProjectEditForm from './ProjectEditForm';
import DeleteProjectButton from './DeleteProjectButton';

interface Props {
  projects: Project[];
  onDelete: (id: string) => void; // לא בשימוש כרגע
}

const ProjectsTable: React.FC<Props> = ({ projects }) => {
  const [editProject, setEditProject] = useState<Project | null>(null);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          mx: 'auto',
          maxWidth: 1200,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#e8f0fe' }}>
              <TableCell align="right"><Typography fontWeight="bold">תמונה</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">כותרת</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">תיאור</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">קישור</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">פעולות</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                hover
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell align="right">
                  <Box
                    component="img"
                    src={project.imageUrl}
                    alt={project.title}
                    sx={{
                      width: 100,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #ddd',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight={500}>
                    {project.title}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {project.description}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    href={project.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    endIcon={<Launch />}
                    size="small"
                    sx={{ textTransform: 'none', fontSize: '0.85rem' }}
                  >
                    לצפייה
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditProject(project)}
                      sx={{ textTransform: 'none', fontSize: '0.85rem' }}
                    >
                      ערוך
                    </Button>
                    <DeleteProjectButton id={project.id} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editProject && (
        <ProjectEditForm
          open={true}
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}
    </>
  );
};

export default ProjectsTable;
