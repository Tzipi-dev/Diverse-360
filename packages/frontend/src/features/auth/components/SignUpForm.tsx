import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignUpFormValues } from '../authTypes';
import { useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  Button,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const signUpSchema = z.object({
  firstName: z
  .string()
  .min(2, 'שם פרטי חובה')
  .regex(/^[A-Za-zא-ת\s]+$/, 'שם פרטי חייב להכיל אותיות ורווחים בלבד'),

lastName: z
  .string()
  .min(2, 'שם משפחה חובה')
  .regex(/^[A-Za-zא-ת\s]+$/, 'שם משפחה חייב להכיל אותיות ורווחים בלבד'),

  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string()
    .min(8, 'הסיסמה חייבת להיות לפחות 8 תווים')
    .regex(/[A-Z]/, 'הסיסמה חייבת לכלול לפחות אות גדולה אחת')
    .regex(/[a-z]/, 'הסיסמה חייבת לכלול לפחות אות קטנה אחת')
    .regex(/[0-9]/, 'הסיסמה חייבת לכלול לפחות ספרה אחת')
    .regex(/[\W_]/, 'הסיסמה חייבת לכלול לפחות תו מיוחד אחד'),
  phone: z.string().regex(/^\d{10}$/, 'מספר טלפון חייב להכיל 10 ספרות בדיוק'),
});

interface SignUpProps {
  onSubmit: (data: SignUpFormValues) => void;
  isLoading?: boolean;
  googleUser?: any;
}

const outlinedInputSx = {
  textAlign: 'right',
  borderRadius: '20px',
  height: '48px',
  fontSize: '1rem',
  paddingRight: '14px', // קצת רווח מהצד
  display: 'flex',
  alignItems: 'center',
  '& .MuiOutlinedInput-input': { // מיישר גם את הטקסט בתוך ה input
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



export default function SignUp({ onSubmit, isLoading = false, googleUser }: SignUpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (googleUser) {
      setValue('firstName', googleUser.first_name || '');
      setValue('lastName', googleUser.last_name || '');
      setValue('email', googleUser.email || '');
    }
  }, [googleUser, setValue]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      
      maxWidth: '350px',
      margin: '0 auto'
    }}>
      <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  sx={{
    height: "100px", 
    marginBottom: 1,  
  }}
>
  <img
    src="/logo3.png"
    alt="לוגו Diverse360"
    style={{
      maxHeight: "210%", 
      objectFit: "contain",
    }}
  />
</Box>

      <Typography variant="h4" component="h1" gutterBottom>
        הרשמה
      </Typography>

      {googleUser && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          התחברת עם Google. אנא השלם את הפרטים החסרים:
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" error={!!errors.firstName}>
          <OutlinedInput
            id="firstName"
            type="text"
            {...register('firstName')}
            placeholder="שם פרטי"
            disabled={isLoading}
            sx={outlinedInputSx}
          />
          {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
        </FormControl>

        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" error={!!errors.lastName}>
          <OutlinedInput
            id="lastName"
            type="text"
            {...register('lastName')}
            placeholder="שם משפחה"
            disabled={isLoading}
            sx={outlinedInputSx}
          />
          {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
        </FormControl>

        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" error={!!errors.email}>
          <OutlinedInput
            id="email"
            type="text"
            {...register('email')}
            placeholder="דואר אלקטרוני"
            disabled={isLoading}
            sx={outlinedInputSx}
          />
          {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
        </FormControl>

        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" error={!!errors.password}>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="סיסמה"
            disabled={isLoading}
            sx={outlinedInputSx}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="הצג/הסתר סיסמה"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
        </FormControl>

        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" error={!!errors.phone} >
          <OutlinedInput
            id="phone"
            type="text"
            {...register('phone')}
            placeholder="טלפון"
            disabled={isLoading}
            sx={outlinedInputSx}
          />
        </FormControl>
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
    borderRadius: '30px',
    '&:hover': {
      bgcolor: '#442063',
    },
  }}
>
  {isLoading ? <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} /> : 'התחבר'}
</Button>

      </form>
    </Box>
  );
}
