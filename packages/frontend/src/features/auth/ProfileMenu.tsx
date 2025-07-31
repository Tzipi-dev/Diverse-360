import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout } from './authSlice';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../App.css';

const ProfileMenu: React.FC = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const goToProfile = () => {
    handleClose();
    navigate('/profile');
  };

  // const goToLogin = () => {
  //   handleClose();
  //   navigate('/login');
  // };
console.log('user.first_name:', user?.firstName);
console.log('user:', user);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {isLoggedIn && user?.firstName ? (
  <Avatar 
    className="profile-avatar" 
    sx={{ 
      bgcolor: 'white', 
      color: '#4a148c', 
      fontWeight: 'bold',
      border: '2px solid #4a148c',
      fontFamily: "'Heebo', sans-serif",
      width: 45,
      height: 45,
      fontSize: '1.5rem'
    }}
  >
    {user.firstName.charAt(0)}
  </Avatar>
) : (
  <AccountCircleIcon fontSize="medium" />
)}

      </IconButton>

      <>
  {isLoggedIn && (
    <Menu
      anchorEl={anchorEl}
      id="profile-menu"
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {/* <MenuItem onClick={goToProfile}>עריכת פרטים</MenuItem> */}
      <MenuItem onClick={handleLogout}>התנתקות</MenuItem>
    </Menu>
  )}
</>

    </>
  );
};

export default ProfileMenu;
