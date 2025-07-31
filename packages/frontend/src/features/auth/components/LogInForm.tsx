import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormControl, InputLabel, InputAdornment, IconButton, OutlinedInput, FormHelperText, Typography, Box, CircularProgress, Link } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleLoginButton from './GoogleLoginButton';
import '../../../App.css';
import { LogInValues } from '../authTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Link as RouterLink } from 'react-router-dom';

const loginSchema = z.object({
  userName: z.string().email('כתובת אימייל לא תקינה').min(2, 'כתובת אימייל חובה'),
  password: z.string().min(8, 'הסיסמה חייבת להיות לפחות 8 תווים'),
});

const outlinedInputSx = {
  textAlign: 'right',
  borderRadius: '20px',
  height: '48px',
  fontSize: '1rem',
  paddingRight: '14px',
  display: 'flex',
  alignItems: 'center',
  '& .MuiOutlinedInput-input': {
    padding: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#442063',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#442063',
    borderWidth: 2,
  },
};

type LogInFormProps = {
  onSubmit: (data: LogInValues) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onForgotPassword?: (email: string) => Promise<string>;
};

const LogInForm: React.FC<LogInFormProps> = ({ onSubmit, isLoading = false, errorMessage, onForgotPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInValues>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return null;
  }

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      padding: 3,
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        התחברות
      </Typography>
      <form className="loginForm" onSubmit={handleSubmit(onSubmit)} noValidate>

        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" error={!!errors.userName}>
          <OutlinedInput
            id="username"
            type="text"
            {...register('userName')}
            placeholder="אימייל"
            disabled={isLoading}

         

            sx={{ ...outlinedInputSx }}
          />
          {errors.userName && <FormHelperText>{errors.userName.message}</FormHelperText>}
        </FormControl>


        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" error={!!errors.password}>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  disabled={isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            placeholder="סיסמה"
            disabled={isLoading}

            sx={{
              ...outlinedInputSx
            }}

           

          />
          {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
        </FormControl>

        {errorMessage && (
          <Typography color="error" sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
            {errorMessage}
          </Typography>
        )}


        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            bgcolor: '#442063',
            mt: 2,
            mb: 2,
            height: '48px',
            fontSize: '1.1rem',
            position: 'relative',
            borderRadius: '30px', // זה ייתן מראה כפתור מעוגל יפה
            '&:hover': {
              bgcolor: '#442063',
            },
          }}
        >

          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{
                bgcolor: '#442063',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )
            :
            (
              'התחבר'
            )}
        </Button>
        <GoogleLoginButton disabled={isLoading} />

        {/* SIGN UP LINK */}
        <Typography component="span" variant="body2" align="center" sx={{ mt: 2 }}>
          אין לך חשבון במערכת?{' '}
          <Link
            component={RouterLink}
            to="/signup"
            sx={{
              color: '#442063',
              fontWeight: 'bold',
              '&:hover': {
                color: '#442063',  // צבע סגול כהה גם בהובר
                textDecoration: 'underline', // אם רוצה להוסיף הדגשה בהובר, אופציונלי
              },
            }}
          >
            להרשמה
          </Link>
        </Typography>

        {/* Forgot Password Section */}
        <Button
          type="button"
          variant="text"
          fullWidth
          sx={{ mt: 1, color: '#442063', fontWeight: 'bold' }}
          onClick={() => setShowForgotPassword((prev) => !prev)}
        >
          שכחתי סיסמה
        </Button>
        {showForgotPassword && (
          <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <OutlinedInput
              type="email"
              placeholder="הכנס כתובת מייל"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              sx={{ ...outlinedInputSx, width: '95%', mb: 1 }}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="contained"
              sx={{ bgcolor: '#442063', borderRadius: '30px', width: '95%' }}
              disabled={isLoading || !forgotEmail}
              onClick={async () => {
                if (onForgotPassword && forgotEmail) {
                  setForgotMessage('');
                  const msg = await onForgotPassword(forgotEmail);
                  setForgotMessage(msg);
                }
              }}
            >
              שלח קישור איפוס
            </Button>
            {forgotMessage && <Typography color="primary" sx={{ mt: 1 }}>{forgotMessage}</Typography>}
          </Box>
        )}


      </form>
    </Box>
  );


};

export default LogInForm;
