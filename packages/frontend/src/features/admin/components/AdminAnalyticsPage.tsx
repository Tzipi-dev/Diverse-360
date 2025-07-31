import React, { useState } from 'react';
import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import CompactAnalyticsPopup from './ScreenAnalyticsChart';
import FeatureClicksPopup from './FeatureClicksPopup';
import AuthEventPopup from './AuthEventPopup';

const AdminAnalyticsPage = () => {
  const [openScreenPopup, setOpenScreenPopup] = useState(false);
  const [openFeaturePopup, setOpenFeaturePopup] = useState(false);
console.log('AdminAnalyticsPage rendered base 1');
  const [openAuthPopup, setOpenAuthPopup] = useState(false);
  console.log('AdminAnalyticsPage rendered base 2');



  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: 'white',
          mb: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Assessment sx={{ color: '#3b82f6' }} />
          <Typography variant="h5" fontWeight={600}>
            ניתוחים ואנליטיקות מנהל
          </Typography>
        </Stack>
        <Typography variant="body2" color="gray.300">
          כאן תוכלו לראות נתוני זמן שהייה במסכים ומידע נוסף בהתבסס על פעילות המשתמשים
        </Typography>
      </Paper>

      <Stack spacing={2} direction="row" flexWrap="wrap">
        <Button
          variant="contained"
          onClick={() => setOpenScreenPopup(true)}
          sx={{
            bgcolor: '#2563eb',
            color: 'white',
            '&:hover': {
              bgcolor: '#1d4ed8',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
          }}
        >
          📊 הצג זמן שהייה במסכים
        </Button>

        <Button
          variant="contained"
          onClick={() => setOpenFeaturePopup(true)}
          sx={{
            bgcolor: '#10b981',
            color: 'white',
            '&:hover': {
              bgcolor: '#059669',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
          }}
        >
          📊 הצג לחיצות בפיצ'רים
        </Button>

        <Button
  variant="contained"
  onClick={() => setOpenAuthPopup(true)}
  sx={{
    bgcolor: '#f59e0b',
    color: 'white',
    '&:hover': {
      bgcolor: '#d97706',
    },
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    px: 3,
    py: 1,
  }}
>
  📈 ניתוח התחברויות / התנתקויות
</Button>
      </Stack>

      <CompactAnalyticsPopup open={openScreenPopup} onClose={() => setOpenScreenPopup(false)} />
      <FeatureClicksPopup open={openFeaturePopup} onClose={() => setOpenFeaturePopup(false)} />
   <AuthEventPopup open={openAuthPopup} onClose={() => setOpenAuthPopup(false)} />

    </Box>
  );
};

export default AdminAnalyticsPage;
