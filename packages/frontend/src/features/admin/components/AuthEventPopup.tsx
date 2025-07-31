import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle, IconButton, Button,
  Card, CardContent, Stack, Box, Typography, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell
} from 'recharts';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

const COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#be185d'];

type AuthEvent = {
  user_id: string;
  event_type: 'login' | 'logout';
  created_at: string;
};

type Mode = 'logins' | 'logouts' | 'sessions';

interface Props {
  open: boolean;
  onClose: () => void;
}

const toIsraelTime = (utc: string) =>
  new Date(utc).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

const AuthEventPopup = ({ open, onClose }: Props) => {
  
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [mode, setMode] = useState<Mode>('logins');
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('auth_events')
        .select('user_id, event_type, created_at');
         console.log('Fetched auth_events:', data); 

      if (error) {
        setError(error.message);
        return;
      }

      setEvents(data as AuthEvent[]);
    };

    fetchData();
  }, [open]);

  // Prepare data
  const loginsPerUser: Record<string, number> = {};
  const logoutsPerUser: Record<string, number> = {};
  const sessionsPerUser: Record<string, number> = {};

  const grouped: Record<string, AuthEvent[]> = {};
  events.forEach((e) => {
    if (!grouped[e.user_id]) grouped[e.user_id] = [];
    grouped[e.user_id].push(e);

    if (e.event_type === 'login') loginsPerUser[e.user_id] = (loginsPerUser[e.user_id] || 0) + 1;
    if (e.event_type === 'logout') logoutsPerUser[e.user_id] = (logoutsPerUser[e.user_id] || 0) + 1;
  });

  // Compute session durations
  for (const [user_id, userEvents] of Object.entries(grouped)) {
    const sorted = userEvents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let total = 0;
    let loginTime: string | null = null;

    for (const event of sorted) {
      if (event.event_type === 'login') {
        loginTime = event.created_at;
      } else if (event.event_type === 'logout' && loginTime) {
        const loginDate = new Date(loginTime);
        const logoutDate = new Date(event.created_at);
        const diff = (logoutDate.getTime() - loginDate.getTime()) / 1000; // in seconds
        if (diff > 0 && diff < 86400) total += diff;
        loginTime = null;
      }
    }

    sessionsPerUser[user_id] = total;
  }

  // Select data for current mode
  const chartData =
    mode === 'logins'
      ? Object.entries(loginsPerUser).map(([user_id, count]) => ({ user_id, count }))
      : mode === 'logouts'
      ? Object.entries(logoutsPerUser).map(([user_id, count]) => ({ user_id, count }))
      : Object.entries(sessionsPerUser)
          .map(([user_id, seconds]) => ({ user_id, count: Math.round(seconds / 60) })) // in minutes
          .sort((a, b) => b.count - a.count);

  const total =
    mode === 'logins'
      ? Object.values(loginsPerUser).reduce((a, b) => a + b, 0)
      : mode === 'logouts'
      ? Object.values(logoutsPerUser).reduce((a, b) => a + b, 0)
      : Object.values(sessionsPerUser).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        ניתוח התחברויות וניתוקים
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        {error ? (
          <Box textAlign="center" py={5}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            {/* KPIs */}
            <Box display="flex" gap={2} mb={3}>
              <Card elevation={0} sx={{ flex: 1, bgcolor: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {mode === 'logins' ? <LoginIcon /> : mode === 'logouts' ? <LogoutIcon /> : <TimerIcon />}
                    <Box>
                      <Typography variant="h6">{chartData.length}</Typography>
                      <Typography variant="caption">משתמשים</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ flex: 1, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <CardContent>
                  <Typography variant="h6">
                    {mode === 'sessions' ? `${Math.round(total / 60)} דקות` : total}
                  </Typography>
                  <Typography variant="caption">
                    {mode === 'logins' ? 'סה"כ כניסות' : mode === 'logouts' ? 'סה"כ יציאות' : 'סה"כ זמן מחובר'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Mode Switch */}
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
              <Button variant={mode === 'logins' ? 'contained' : 'outlined'} onClick={() => setMode('logins')}>
                כניסות
              </Button>
              <Button variant={mode === 'logouts' ? 'contained' : 'outlined'} onClick={() => setMode('logouts')}>
                יציאות
              </Button>
              <Button variant={mode === 'sessions' ? 'contained' : 'outlined'} onClick={() => setMode('sessions')}>
                זמן שימוש
              </Button>
            </Box>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user_id" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name={
                  mode === 'logins' ? 'כניסות' : mode === 'logouts' ? 'יציאות' : 'דקות מחובר'
                }>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Summary Chips */}
            <Box mt={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {chartData.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.user_id}: ${item.count}`}
                    sx={{ bgcolor: COLORS[index % COLORS.length], color: 'white', fontSize: 12 }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthEventPopup;
