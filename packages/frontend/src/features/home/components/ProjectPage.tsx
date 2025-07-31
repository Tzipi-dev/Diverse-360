// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography } from '@mui/material';

// const ProjectPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         פרויקט: {id}
//       </Typography>
//       <Typography>
//         כאן יופיעו פרטים על הפרויקט עם מזהה <strong>{id}</strong>.
//       </Typography>
//     </Box>
//   );
// };

// export default ProjectPage;
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useGetLogoCarouselByIdQuery } from '../logoCarouselApi';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // קריאה ל-Hook תמיד, גם אם id undefined - נעביר מחרוזת ריקה ונשתמש ב-skip
  const { data: logo, isLoading, error } = useGetLogoCarouselByIdQuery(id ?? '', {
    skip: !id,
  });

  // טיפול במקרה שאין id
  if (!id) {
    return <Typography color="error">לא נמצא מזהה פרויקט</Typography>;
  }

  if (isLoading) return <Typography>טוען...</Typography>;
  if (error || !logo) return <Typography color="error">שגיאה בטעינת הפרויקט</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        פרויקט: {logo.name}
      </Typography>
      <Typography>
        כאן יופיעו פרטים על הפרויקט עם מזהה <strong>{id}</strong>.
      </Typography>
    </Box>
  );
};

export default ProjectPage;
