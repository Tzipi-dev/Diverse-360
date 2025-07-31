import React, { useState } from "react";
import { Tooltip as MUITooltip } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useGetGroupedScreenAnalyticsQuery,
  useGetScreenAnalyticsByUserQuery,
} from "../analyticsApi";
import { useGetAllUsersQuery } from "features/users/usersApi"; 
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  ButtonGroup,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Assessment,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  People,
  Close,
  AccessTime,
  Visibility,
} from "@mui/icons-material";

const SCREEN_NAMES: Record<string, string> = {
  HomePage: "מסך הבית",
  AdminPage: "מסך ניהול",
  CoursesPage: "עמוד קורסים",
  JobPage: "עמוד פרויקטים",
  Dashboard: "דשבורד",
};

const COLORS = [
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#be185d",
];

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

interface ChartItem {
  name: string;
  duration: number;
  color: string;
}

interface CompactAnalyticsPopupProps {
  open: boolean;
  onClose: () => void;
}

const renderCustomizedLabel = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    fill,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 40) * cos;
  const my = cy + (outerRadius + 40) * sin;
  const ex = cx + (outerRadius + 50) * cos;
  const ey = cy + (outerRadius + 50) * sin;

  const textAnchor = cos >= 0 ? "start" : "end";
  const labelName = SCREEN_NAMES[name] || name;
  const displayPercent = percent > 0 ? `${(percent * 100).toFixed(0)}%` : "";

  return (
    <g>
      <polyline
        points={`${sx},${sy} ${mx},${my} ${ex},${ey}`}
        stroke={fill}
        strokeWidth={1.5}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} />
      <text
        x={ex}
        y={ey - 6}
        textAnchor={textAnchor}
        fill="#0f172a"
        fontSize={13}
        fontWeight={600}
      >
        {labelName}
      </text>
      <text
        x={ex}
        y={ey + 10}
        textAnchor={textAnchor}
        fill="#64748b"
        fontSize={12}
      >
        {displayPercent}
      </text>
    </g>
  );
};

const CompactAnalyticsPopup: React.FC<CompactAnalyticsPopupProps> = ({ open, onClose }) => {
  const [view, setView] = useState<"bar" | "pie" | "user">("bar");

  const { data: screenData, isLoading: loadingScreens, isError: errorScreens } =
    useGetGroupedScreenAnalyticsQuery();
  const { data: userData, isLoading: loadingUsers, isError: errorUsers } =
    useGetScreenAnalyticsByUserQuery(undefined, { skip: view !== "user" });

  const { data: users = [] } = useGetAllUsersQuery(); // ✅ שליפת כל המשתמשים

  // ✅ מחזיר שם מלא לפי userId
  const getUserName = (id: string): string => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "";
  };

  const isLoading = loadingScreens || (view === "user" && loadingUsers);
  const isError = errorScreens || (view === "user" && errorUsers);

  const screenChartData: ChartItem[] = screenData
    ? Object.entries(screenData).map(([path, duration], index) => ({
      name: SCREEN_NAMES[path] || path,
      duration,
      color: COLORS[index % COLORS.length],
    }))
    : [];

const userChartData: ChartItem[] = userData
  ? Object.entries(userData)
      .filter(([userId]) => {
        const user = users.find((u) => u.id === userId);
        return user && user.role !== "manager"; 
      })
      .map(([userId, duration], index) => ({
        name: getUserName(userId),
        duration,
        color: COLORS[index % COLORS.length],
      }))
  : [];

  const currentChartData: ChartItem[] = view === "user" ? userChartData : screenChartData;
  const totalDuration = currentChartData.reduce((sum, item) => sum + item.duration, 0);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200}>
            <CircularProgress size={40} thickness={4} sx={{ color: '#2563eb', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">טוען נתונים...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" color="error.main" gutterBottom>שגיאה בטעינת נתונים</Typography>
            <Typography variant="body2" color="text.secondary">אנא נסה שוב מאוחר יותר</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>סגור</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Assessment sx={{ color: '#2563eb' }} />
            <Typography variant="h6" fontWeight={600}>דוח אנליטיקה</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Card elevation={0} sx={{ flex: 1, minWidth: 120, bgcolor: '#f0f9ff', border: '1px solid #e0f2fe' }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Visibility sx={{ color: '#2563eb', fontSize: 20 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>{currentChartData.length}</Typography>
                  <Typography variant="caption" color="text.secondary">פריטים</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ flex: 1, minWidth: 120, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTime sx={{ color: '#059669', fontSize: 20 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>{formatDuration(totalDuration)}</Typography>
                  <Typography variant="caption" color="text.secondary">זמן כולל</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box mb={3}>
          <ButtonGroup variant="outlined" size="small" fullWidth>
            <Button startIcon={<BarChartIcon />} onClick={() => setView("bar")} variant={view === "bar" ? "contained" : "outlined"}>עמודות</Button>
            <Button startIcon={<PieChartIcon />} onClick={() => setView("pie")} variant={view === "pie" ? "contained" : "outlined"}>עוגה</Button>
            <Button startIcon={<People />} onClick={() => setView("user")} variant={view === "user" ? "contained" : "outlined"}>משתמשים</Button>
          </ButtonGroup>
        </Box>

        {/* Chart */}
        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2 }}>
          {view !== "pie" ? (
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentChartData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    height={100}  
                    interval={0}
                    tick={({ x, y, payload }) => {
                      const maxChars = 12;
                      const truncate = (str: string, n: number) =>
                        str.length > n ? str.slice(0, n - 1) + "…" : str;

                      const displayName = truncate(payload.value, maxChars);

                      return (
                        <g transform={`translate(${x},${y + 50})`}>  {/* הזזה חזקה למטה */}
                          <MUITooltip title={payload.value} arrow placement="top">
                            <text
                              x={0}
                              y={0}
                              dy={0}
                              textAnchor="end"
                              fill="#334155"
                              fontSize={13}
                              fontWeight={500}
                              fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                              style={{ cursor: "default", userSelect: "none" }}
                              transform="rotate(-45)"
                            >
                              {displayName}
                            </text>
                          </MUITooltip>
                        </g>
                      );
                    }}
                  />


                  <YAxis tickFormatter={(v) => `${Math.floor(v / 1000)}s`} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip
                    formatter={(value: number) => [formatDuration(value), 'זמן שהייה']}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="duration" radius={[2, 2, 0, 0]}>
                    {currentChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={screenChartData}
                    dataKey="duration"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={30}
                    labelLine={true}
                    label={renderCustomizedLabel}
                  >
                    {screenChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatDuration(value), 'זמן שהייה']}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>

        {/* Data Summary */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {currentChartData.map((item, index) => (
              <Chip
                key={index}
                label={`${item.name}: ${formatDuration(item.duration)}`}
                size="small"
                sx={{
                  bgcolor: item.color,
                  color: 'white',
                  fontSize: 11,
                  mb: 1,
                }}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompactAnalyticsPopup;
