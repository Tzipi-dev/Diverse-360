import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import { SignUpFormValues } from './authTypes';
import { useRegisterMutation, useLoginMutation } from './authApi';
import { setCredentials } from './authSlice';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    if (location.state?.googleUser && location.state?.fromGoogle) {
      setGoogleUser(location.state.googleUser);
      console.log('🆕 Google user data received:', location.state.googleUser);
    }
  }, [location.state]);

  const openPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleRegister = async (data: SignUpFormValues) => {
  setIsLoading(true);
  try {
    await register(data).unwrap();

   const loginResponse = await login({
  userName: data.email,
  password: data.password,
}).unwrap();

dispatch(setCredentials({
  user: {
    ...loginResponse.data.user,
    firstName:
      loginResponse.data.user.firstName ||
      loginResponse.data.user.displayName ||
      (loginResponse.data.user.email ? loginResponse.data.user.email.split('@')[0] : 'משתמש'),
  },
  token: loginResponse.data.token,
}));



    openPopup('🎉 נוספה בהצלחה');
    setTimeout(() => navigate('/'), 2000);

  } catch (error: any) {
    const message = error?.data?.message || 'שגיאה לא צפויה בהרשמה או התחברות';
    openPopup(message);
    console.error('❌ Registration failed:', error); // כאן זה בתוך ה־catch ולכן חוקי
  } finally {
    setIsLoading(false);
  }
};


  // עיצוב inline של הפופאפ
  const popupOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  };

  const popupContentStyle: React.CSSProperties = {
    background: 'white',
    padding: '2rem 3rem',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    animation: 'popupScaleIn 0.3s ease forwards',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'transparent',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#777',
  };

  return (
    <>
      {showPopup && (
        <div style={popupOverlayStyle} onClick={closePopup}>
          <div style={popupContentStyle} onClick={e => e.stopPropagation()}>
            <button onClick={closePopup} style={closeButtonStyle}>
              &times;
            </button>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}

      <SignUpForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        googleUser={googleUser}
      />

      <ToastContainer />
    </>
  );
}
