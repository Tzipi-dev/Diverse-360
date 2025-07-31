import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogInForm from './components/LogInForm';
import {
  auth,
  googleProvider,
  githubProvider,
} from "./components/firebase";
import { signInWithPopup } from "firebase/auth";
import { useLoginMutation, useRegisterMutation } from './authApi';
import { setCredentials, logout } from './authSlice';
import { LogInValues } from './authTypes';
import { RootState } from '../../app/store';
import { Box } from '@mui/material';
import { logAuthEvent } from './components/AuthEvent';

export default function LogInPage() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const extractFirstName = (user: any) =>
    user.first_name ||
    user.firstName ||
    user.displayName ||
    (user.email ? user.email.split('@')[0] : 'משתמש');

  const handleLogIn = async (data: LogInValues) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials({
        user: {
          ...response.data.user,
          firstName: extractFirstName(response.data.user),
        },
        token: response.data.token,
      }));
     
      await logAuthEvent(response.data.user.id, 'login');
      
  
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error?.data?.message || 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.';
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogIn = async () => {
    setLoading(true);
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      const idToken = await loggedInUser.getIdToken();

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          user: {
            uid: loggedInUser.uid,
            email: loggedInUser.email,
            displayName: loggedInUser.displayName,
            photoURL: loggedInUser.photoURL
          }
        }),
      });
      const data = await response.json();

      if (data.success) {
        if (data.isNewUser) {
          navigate('/signup', {
            state: {
              googleUser: data.data.user,
              fromGoogle: true
            }
          });
        } else {
          dispatch(setCredentials({
            user: {
              ...data.data.user,
              firstName: extractFirstName(data.data.user),
            },
            token: data.data.token,
          }));
          localStorage.setItem('token', data.data.token);
          navigate('/');
        }
      } else {
        setLoginError(data.message || 'שגיאה בהתחברות עם Google');
      }
    } catch (error) {
      setLoginError('שגיאה בהתחברות עם Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogIn = async () => {
    setLoading(true);
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const loggedInUser = result.user;
      const idToken = await loggedInUser.getIdToken();

      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          user: {
            uid: loggedInUser.uid,
            email: loggedInUser.email,
            displayName: loggedInUser.displayName,
            photoURL: loggedInUser.photoURL
          }
        }),
      });
      const data = await response.json();

      if (data.success) {
        if (data.isNewUser) {
          navigate('/signup', {
            state: {
              googleUser: data.data.user,
              fromGoogle: false,
              fromGithub: true
            }
          });
        } else {
          dispatch(setCredentials({
            user: {
              ...data.data.user,
              firstName: extractFirstName(data.data.user),
            },
            token: data.data.token,
          }));
          localStorage.setItem('token', data.data.token);
          navigate('/');
        }
      } else {
        setLoginError(data.message || 'שגיאה בהתחברות עם GitHub');
      }
    } catch (error) {
      setLoginError('שגיאה בהתחברות עם GitHub');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string): Promise<string> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.message || 'אם כתובת המייל קיימת, נשלח קישור לאיפוס סיסמה';
    } catch (e) {
      return 'שגיאה בשליחת קישור איפוס סיסמה';
    }
  };

  return (
    <Box>
      <LogInForm
        onSubmit={handleLogIn}
        isLoading={loading}
        errorMessage={loginError}
        onForgotPassword={handleForgotPassword}
      />
    </Box>
  );
}
