// UsersListMerged.tsx
import React, { useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, Typography, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, CircularProgress, useTheme, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ImportCsvButton from './ImportUsersComponent';
import ExportCsvButton from './ExportUsersComponentProps';
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../usersApi';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'student' | 'manager';
  createdAt: Date;
}

type UserInput = Omit<User, 'id' | 'createdAt'>;

const emptyUserInput: UserInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'student',
  password: '',
};

const BUTTON_COLOR = '#442063';

const UsersListMerged: React.FC = () => {
  const { data: users = [], isLoading, error, refetch } = useGetAllUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<UserInput>(emptyUserInput);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserInput, string>>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validate = (values: UserInput) => {
    const errors: Partial<Record<keyof UserInput, string>> = {};
    if (!values.firstName.trim()) {
      errors.firstName = 'שדה חובה';
    } else if (values.firstName.trim().length < 2) {
      errors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(values.firstName.trim())) {
      errors.firstName = 'שם פרטי יכול להכיל רק אותיות ורווחים';
    }

    if (!values.lastName.trim()) {
      errors.lastName = 'שדה חובה';
    } else if (values.lastName.trim().length < 2) {
      errors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(values.lastName.trim())) {
      errors.lastName = 'שם משפחה יכול להכיל רק אותיות ורווחים';
    }

    if (!values.email.trim()) {
      errors.email = 'שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'כתובת מייל לא תקינה';
    } else if (users.some(u => u.email === values.email && (!editingUser || u.id !== editingUser.id))) {
      errors.email = 'כתובת מייל קיימת במערכת';
    }

    if (values.phone && values.phone.trim()) {
      if (!/^\d{10}$/.test(values.phone.trim())) {
        errors.phone = 'מספר טלפון חייב להכיל בדיוק 10 ספרות';
      }
    }

    if (!editingUser && !values.password.trim()) {
      errors.password = 'שדה חובה';
    } else if (values.password.trim()) {
      if (values.password.length < 8) {
        errors.password = 'סיסמה חייבת להכיל לפחות 8 תווים';
      } else if (!/[A-Z]/.test(values.password)) {
        errors.password = 'סיסמה חייבת להכיל לפחות אות גדולה אחת';
      } else if (!/[a-z]/.test(values.password)) {
        errors.password = 'סיסמה חייבת להכיל לפחות אות קטנה אחת';
      } else if (!/[0-9]/.test(values.password)) {
        errors.password = 'סיסמה חייבת להכיל לפחות ספרה אחת';
      } else if (!/[^A-Za-z0-9]/.test(values.password)) {
        errors.password = 'סיסמה חייבת להכיל לפחות תו מיוחד אחד';
      }
    }

    return errors;
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormValues(emptyUserInput);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('אתה בטוח שברצונך למחוק את המשתמש?')) {
      try {
        await deleteUser(id).unwrap();
      } catch {
        alert('שגיאה במחיקת המשתמש');
      }
    }
  };

  const handleChange = (field: keyof UserInput, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingUser) {
        const userToUpdate: Partial<User> = { ...formValues, id: editingUser.id };
        if (!formValues.password.trim()) delete userToUpdate.password;
        await updateUser(userToUpdate).unwrap();
      } else {
        await createUser(formValues).unwrap();
      }
      setModalOpen(false);
    } catch {
      alert(editingUser ? 'שגיאה בעדכון המשתמש' : 'שגיאה ביצירת המשתמש');
    }
  };

  const handleImportUsers = () => refetch();

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('he-IL');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" mb={2} textAlign="center" sx={{ color: BUTTON_COLOR, fontWeight: 'bold' }}>
        ניהול משתמשים
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <TextField
          placeholder="חפש משתמש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: 'gray', ml: 1 }} /> }}
          sx={{ minWidth: 300, bgcolor: 'white', borderRadius: 1 }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
          '& button': {
            minWidth: '150px',
            fontSize: { xs: '0.75rem', sm: '1rem' }
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          onClick={openAddModal}
          disabled={isCreating}
          sx={{
            bgcolor: BUTTON_COLOR,
            color: 'white',
            textTransform: 'none',
            '&:hover': { bgcolor: '#442063' }
          }}
        >
          הוספת משתמש
        </Button>
        <ImportCsvButton onUsersAdded={handleImportUsers} />
        <ExportCsvButton users={users} />
      </Box>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredUsers.map(user => (
            <Box key={user.id} sx={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              backgroundColor: '#fff'
            }}>
              <Typography fontWeight="bold">{user.firstName} {user.lastName}</Typography>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="body2">{user.phone || 'לא הוזן'}</Typography>
              <Typography variant="body2">
                {user.role === 'manager' ? 'מנהל' : 'סטודנט'}
              </Typography>
              <Typography variant="caption">{formatDate(user.createdAt)}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <IconButton onClick={() => openEditModal(user)} sx={{ color: BUTTON_COLOR }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)} sx={{ color: BUTTON_COLOR }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Table sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">שם פרטי</TableCell>
              <TableCell align="center">שם משפחה</TableCell>
              <TableCell align="center">אימייל</TableCell>
              <TableCell align="center">טלפון</TableCell>
              <TableCell align="center">תפקיד</TableCell>
              <TableCell align="center">תאריך הצטרפות</TableCell>
              <TableCell align="center">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  לא נמצאו משתמשים
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell align="center">{user.firstName}</TableCell>
                  <TableCell align="center">{user.lastName}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.phone || 'לא הוזן'}</TableCell>
                  <TableCell align="center">
                    <Box component="span" sx={{
                      px: 2, py: 0.5, borderRadius: 1,
                      fontSize: '0.75rem', fontWeight: 'bold',
                      bgcolor: user.role === 'manager' ? '#e1d5ff' : '#dbeafe',
                      color: user.role === 'manager' ? '#7c3aed' : '#1d4ed8'
                    }}>
                      {user.role === 'manager' ? 'מנהל' : 'סטודנט'}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton onClick={() => openEditModal(user)} sx={{ color: BUTTON_COLOR }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)} sx={{ color: BUTTON_COLOR }}>
                        {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* דיאלוג הוספה / עריכה */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: BUTTON_COLOR }}>
          {editingUser ? 'עריכת משתמש' : 'הוספת משתמש חדש'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* כל השדות בטופס */}
          <TextField label="שם פרטי" value={formValues.firstName} onChange={e => handleChange('firstName', e.target.value)}
            error={!!formErrors.firstName} helperText={formErrors.firstName || 'לפחות 2 תווים, רק אותיות ורווחים'} required />
          <TextField label="שם משפחה" value={formValues.lastName} onChange={e => handleChange('lastName', e.target.value)}
            error={!!formErrors.lastName} helperText={formErrors.lastName || 'לפחות 2 תווים, רק אותיות ורווחים'} required />
          <TextField label="אימייל" type="email" value={formValues.email} onChange={e => handleChange('email', e.target.value)}
            error={!!formErrors.email} helperText={formErrors.email || 'כתובת מייל תקינה ויחודית'} required />
          <TextField label="טלפון" value={formValues.phone} onChange={e => handleChange('phone', e.target.value)}
            error={!!formErrors.phone} helperText={formErrors.phone || 'אופציונלי - 10 ספרות בלבד'} />
          <TextField label="תפקיד" select value={formValues.role} onChange={e => handleChange('role', e.target.value)}>
            <MenuItem value="student">סטודנט</MenuItem>
            <MenuItem value="manager">מנהל</MenuItem>
          </TextField>
          <TextField label="סיסמה" type="password" value={formValues.password} onChange={e => handleChange('password', e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password || (editingUser ? 'השאר ריק אם לא רוצים לשנות' : '8 תווים, אותיות, מספר ותו מיוחד')}
            required={!editingUser} />
        </DialogContent>
        <DialogActions sx={{ gap: 1, justifyContent: 'flex-start', padding: '16px 24px' }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined"
            sx={{ color: BUTTON_COLOR, borderColor: BUTTON_COLOR, textTransform: 'none',
              '&:hover': { backgroundColor: '#4420630f', color: BUTTON_COLOR } }}>
            בטל
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isCreating || isUpdating}
            startIcon={(isCreating || isUpdating) ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ backgroundColor: BUTTON_COLOR, color: 'white', textTransform: 'none',
              '&:hover': { backgroundColor: '#442063' } }}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersListMerged;


