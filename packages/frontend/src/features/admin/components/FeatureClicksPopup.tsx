import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { supabase } from '../../../config/supabaseConfig';
import { useGetAllUsersQuery } from 'features/users/usersApi';


type FeatureClickRecord = { feature_name: string; clicks_count: number };
type UserClickRecord = { user_id: string; clicks_count: number };
type DisplayMode = 'features_bar' | 'features_pie' | 'users_bar';
type ClickRecord = { clicks_count: number };

const COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#be185d'];

interface Props {
  open: boolean;
  onClose: () => void;
}

const FeatureClicksPopup = ({ open, onClose }: Props) => {
  const [featureData, setFeatureData] = useState<FeatureClickRecord[]>([]);
  const [userData, setUserData] = useState<UserClickRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('features_bar');

  // שליפת כל המשתמשים
  const { data: users = [] } = useGetAllUsersQuery();

  // פונקציה למציאת שם משתמש לפי id
  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : id;
  };

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      const { data: featureSummary, error: featureError } = await supabase.rpc('feature_clicks_summary');
      const { data: userSummary, error: userError } = await supabase.rpc('feature_clicks_per_user_summary');

      if (featureError) {
        setError(featureError.message);
        return;
      }
      if (userError) {
        setError(userError.message);
        return;
      }

      setFeatureData(featureSummary || []);
      setUserData(userSummary || []);
    };

    fetchData();
  }, [open]);

  const isFeature = displayMode.startsWith('features');
  const isPie = displayMode === 'features_pie';
  const data = isFeature ? featureData : userData;
  const dataKeyName = isFeature ? 'feature_name' : 'user_id';
  const totalClicks = (data as ClickRecord[]).reduce((sum, item) => sum + item.clicks_count, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        ניתוח לחיצות בפיצ'רים
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error ? (
          <Box textAlign="center" py={5}>
            <Typography variant="body1" color="error">
              שגיאה: {error}
            </Typography>
          </Box>
        ) : (
          <>
            {/* KPI Cards */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Card elevation={0} sx={{ flex: 1, minWidth: 120, bgcolor: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Visibility sx={{ color: '#2563eb', fontSize: 20 }} />
                    <Box>
                      <Typography variant="h6">{data.length}</Typography>
                      <Typography variant="caption">פריטים</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ flex: 1, minWidth: 120, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box>
                      <Typography variant="h6">{totalClicks}</Typography>
                      <Typography variant="caption">סה"כ לחיצות</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Mode Switch */}
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
              <Button variant={displayMode === 'features_bar' ? 'contained' : 'outlined'} onClick={() => setDisplayMode('features_bar')}>
                פיצ'רים - עמודות
              </Button>
              <Button variant={displayMode === 'features_pie' ? 'contained' : 'outlined'} onClick={() => setDisplayMode('features_pie')}>
                פיצ'רים - עוגה
              </Button>
              <Button variant={displayMode === 'users_bar' ? 'contained' : 'outlined'} onClick={() => setDisplayMode('users_bar')}>
                משתמשים - עמודות
              </Button>
            </Box>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              {isPie ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="clicks_count"
                    nameKey={isFeature ? 'feature_name' : undefined}
                    label={isFeature ? undefined : (entry) => getUserName(entry.user_id)}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={isFeature ? 'feature_name' : (item) => getUserName(item.user_id)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks_count" name="כמות לחיצות">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* Summary */}
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${isFeature ? (item as any)[dataKeyName] : getUserName((item as any).user_id)}: ${item.clicks_count}`}
                    sx={{
                      bgcolor: COLORS[index % COLORS.length],
                      color: 'white',
                      fontSize: 12,
                    }}
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

export default FeatureClicksPopup;
