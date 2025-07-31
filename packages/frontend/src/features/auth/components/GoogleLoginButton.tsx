import { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { auth, googleProvider, githubProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import { logAuthEvent } from './AuthEvent';

const PROVIDERS = {
  google: googleProvider,
  github: githubProvider,
};

const PROVIDER_LABELS: Record<'google' | 'github', string> = {
  google: 'Google',
  github: 'GitHub',
};

const PROVIDER_COLORS: Record<'google' | 'github', string> = {
  google: '#4285F4',
  github: '#24292e',
};

const PROVIDER_HOVER_COLORS: Record<'google' | 'github', string> = {
  google: '#357ABD',
  github: '#1b1f23',
};

export default function GoogleLoginButton({ disabled = false }) {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProviderLogin = async (providerKey: 'google' | 'github') => {
    setError(null);
    setLoginError(null);
    setLoading(providerKey);
    try {
      const result = await signInWithPopup(auth, PROVIDERS[providerKey]);
      const loggedInUser = result.user;
      const idToken = await loggedInUser.getIdToken();
      const endpoint = providerKey === 'google' ? '/api/auth/google' : '/api/auth/github';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          user: {
            uid: loggedInUser.uid,
            email: loggedInUser.email,
            displayName: loggedInUser.displayName,
            photoURL: loggedInUser.photoURL,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.isNewUser) {
          navigate('/signup', {
            state: {
              googleUser: data.data.user, // for compatibility with signup page
              fromGoogle: providerKey === 'google',
              fromGithub: providerKey === 'github',
            },
          });
        } else {
          dispatch(setCredentials({
            user: {
              ...data.data.user,
              firstName: data.data.user.firstName || data.data.user.displayName || (data.data.user.email ? data.data.user.email.split('@')[0] : 'משתמש')
            },
            token: data.data.token,
          }));
          localStorage.setItem('token', data.data.token);
          await logAuthEvent(data.data.user.id, 'login');

          navigate('/');
        }
      } else {
        setLoginError(data.message || `שגיאה בהתחברות עם ${PROVIDER_LABELS[providerKey]}`);
      }
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setLoginError('כבר קיים חשבון עם אימייל זה. יש להתחבר עם Google או עם הספק המקורי איתו נרשמת.');
      } else {
        setLoginError(`שגיאה בהתחברות עם ${PROVIDER_LABELS[providerKey]}`);
        setError(String(err));
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
    <Button
  fullWidth
  onClick={() => handleProviderLogin('google')}
  disabled={!!loading || disabled}
  sx={{
        backgroundColor: '#6E5494', // סגול כהה

    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    height: '48px',
    px: 2,
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    direction: 'rtl',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#A57CC5', // טיפה כהה יותר בהובר
    },
  }}
>
  <Box
    sx={{
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#fff',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="20" height="20" viewBox="0 0 48 48">
      <g>
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.09 1.53 7.49 2.81l5.54-5.39C33.99 4.09 29.46 2 24 2
          14.82 2 6.98 7.98 3.69 15.44l6.45 5.01C12.13 14.09 17.62 9.5 24 9.5z" />
        <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9.18h12.42c-.54 2.91-2.18 5.38-4.66
          7.04l7.19 5.59C43.98 37.09 46.1 31.36 46.1 24.55z" />
        <path fill="#FBBC05" d="M10.14 28.09a14.5 14.5 0 0 1 0-8.18l-6.45-5.01A23.97 23.97 0 0 0 2
          24c0 3.77.9 7.34 2.49 10.5l6.45-5.01z" />
        <path fill="#EA4335" d="M24 44c6.48 0 11.92-2.15 15.89-5.86l-7.19-5.59c-2 1.41-4.56
          2.25-8.7 2.25-6.38 0-11.87-4.59-13.86-10.75l-6.45 5.01C6.98 40.02 14.82 46 24 46z" />
        <path fill="none" d="M2 2h44v44H2z" />
      </g>
    </svg>
  </Box>

  <Box
    sx={{
      width: '100%',
      textAlign: 'center',
    }}
  >
    התחבר עם Google
  </Box>
</Button>
<br /> <br />
<Button
  onClick={() => handleProviderLogin('github')}
  disabled={!!loading || disabled}
  fullWidth
  sx={{
    backgroundColor: '#B292CC', // סגול בהיר
    color: '#fff',
    borderRadius: '30px',
    height: '48px',
    // px: 2,
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    position: 'relative',
    direction: 'rtl',
    '&:hover': {
      backgroundColor: '#5E4781',
    },
  }}
>
  {/* עיגול עם אייקון מימין */}
  <Box
    sx={{
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#fff',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482
      0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465
      -.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032
      .892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339
      -2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
      -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844
      c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025
      .546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688
      0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852
      0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481
      C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
    </svg>
  </Box>

  התחבר עם GitHub
</Button>


      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      {loginError && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {loginError}
        </Typography>
      )}
    </Box>
  );
}