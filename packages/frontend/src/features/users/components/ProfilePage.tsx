import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
        {user?.firstName ? user.firstName[0] : user?.email?.[0] || '?'}
      </Avatar>
      <h2>שלום ל: {user?.firstName || user?.email || 'משתמש'}</h2>
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
        התנתק
      </Button>
    </div>
  );
};

export default ProfilePage; 