import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { logout } from './features/auth/authSlice';
import EmailIcon from '@mui/icons-material/Email';
import './App.css';
import AdminAnalyticsPage from './features/admin/components/AdminAnalyticsPage';
import SignUpPage from './features/auth/SignUpPage';
import LogInPage from './features/auth/LoginPage';
import CoursesPage from './features/courses/CoursesPage';
import ForumDetailsPage from './features/forum/components/ForumDetailsPage';
import ForumPage from './features/forum/components/forumPage';
import HomePage from './features/home/HomePage';
import JobPage from './features/jobs/JobPage';
import ProjectsAdmin from './features/admin/ProjectsAdmin/ProjectsAdmin';
import ProjectsCreateForm from './features/admin/ProjectsAdmin/ProjectsCreateForm';
import CreateForumPage from './features/forum/components/forumPage';
import AdminPage from './features/admin/AdminPage';
import JobsAdminPage from './features/admin/jobsAdmin/JobsAdminPage';
import VideoReveal from './features/courses/components/fileActions';
import CoursesAdmin from './features/admin/components/AdminCourses/CoursesAdmin';
import CarouselAdmin from './features/admin/components/CarouselAdmin';
import ProjectPage from './features/home/components/ProjectPage';
import AboutPage from './features/about/AboutPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './globalComponents/ui/muiTheme';
import JobWebsite from 'features/jobs/components/JobWebsite';
import { ToastContainer } from 'react-toastify';
import Modal from './globalComponents/ui/Modal';
import ForumSocket from './features/forum/forumSocket';
// import SavedJobsProvider from './features/jobs/components/SavedJobsProvider';      
import { SavedJobsProvider } from 'features/jobs/components/addJobFicher/SavedJobsContext';
import ProfileMenu from 'features/auth/ProfileMenu';
import ProfilePage from './features/users/components/ProfilePage';
import Avatar from '@mui/material/Avatar';
import UsersList from 'features/users/components/UsersList';
import ForumMessageSocket from 'features/forumMessage/forumMessageSocket';
import { logFeatureClick } from 'features/admin/components/logFeatureClick';



import JobDetailsPage from 'features/jobs/components/JobDetailsPage';
import { ErrorModal } from 'rateLimiter/ErrorModal';
import { logAuthEvent } from 'features/auth/components/AuthEvent';


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isNavHidden, setIsNavHidden] = React.useState(false);
  const lastScrollTop = React.useRef(0);

  const isLoginModal = location.pathname === '/login';
  const isSignupModal = location.pathname === '/signup';

  // פונקציה לזיהוי גלילה
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 65); // 65px הוא גובה הניווט
      
      // הסתרת/הצגת הנאב לפי כיוון הגלילה
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        // גלילה למטה - הסתר את הנאב
        setIsNavHidden(true);
      } else if (scrollTop < lastScrollTop.current) {
        // גלילה למעלה - הצג את הנאב
        setIsNavHidden(false);
      }
      
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userId = user?.id || "guest_user";

  return (
    <>
      <nav className={
        (location.pathname === '/about'
          ? 'main-nav about-nav'
          : location.pathname.startsWith('/admin')
            ? 'main-nav admin-nav'
            : location.pathname.startsWith('/courses/') && location.pathname !== '/courses'
              ? 'main-nav white-nav'
              : ['/jobs', '/ForumPage', '/'].includes(location.pathname)
                ? `main-nav transparent${isScrolled ? ' scrolled' : ''}`
                : `main-nav${isScrolled ? ' scrolled' : ''}`) + (isNavHidden ? ' hidden' : '')
      }>
        <div className="nav-top-row">
          <Link to="/" style={{ position: 'absolute', right: 40, top: 3, zIndex: 1000 }}>
            <img src="/logo.png" alt="Logo" style={{ height: 60 }} />
          </Link>
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ position: 'absolute', left: 20, top: 12, zIndex: 1000, color: "white", fontSize: "0.9rem" }}>התנתק</button>
          )}
          {isLoggedIn && (
            <div style={{ position: 'absolute', left: 85, top: 3, zIndex: 1000 }}>
              <ProfileMenu />
            </div>
          )}
        </div>
        <div className="nav-bottom-row">
          {isLoggedIn ? (
            <>
              <Link to="/" onClick={() => logFeatureClick({ userId, featureName: 'home', screen: 'navbar' })}>דף הבית</Link>
              <span>    </span>  <span>    </span>
              <Link to="/about" onClick={() => logFeatureClick({ userId, featureName: 'about', screen: 'navbar' })}>אודות</Link>
              <span>    </span>  <span>    </span>
              <Link to="/ForumPage" onClick={() => logFeatureClick({ userId, featureName: 'forums', screen: 'navbar' })}>פורומים</Link>
              <span>    </span>  <span>    </span>
              <Link to="/courses" onClick={() => logFeatureClick({ userId, featureName: 'courses', screen: 'navbar' })}>קורסים</Link>
              <span>    </span>  <span>    </span>
              <Link to="/jobs" onClick={() => logFeatureClick({ userId, featureName: 'jobs', screen: 'navbar' })}>משרות</Link>
              {user?.role === 'manager' && (
                <>
                  <span>   </span>  <span>    </span>
                  <Link to="/admin">ניהול</Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login">התחברות</Link>
              <span>    </span>
              <Link to="/">דף הבית</Link>
              <span>    </span>
              <Link to="/about">אודות</Link>
            </>
          )}
        </div>
        <span>    </span>

      </nav>
      <main style={{ width: '100vw', minHeight: '80vh', padding: 0, margin: 0 }}>
        <ForumSocket />
        <ForumMessageSocket />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={null} />
          <Route path="/login" element={null} />
          <Route path="/ForumPage" element={<CreateForumPage />} />
          <Route path="/forums/:id" element={<ForumDetailsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:title" element={<VideoReveal />} />
          <Route path="/jobs" element={<SavedJobsProvider userId={userId}> <JobPage /> </SavedJobsProvider>} />
          <Route path="/jobs/:jobId" element={
            <SavedJobsProvider userId={userId}>
              <JobDetailsPage />
            </SavedJobsProvider>
          } />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {user?.role === "manager" && (
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<div></div>} />
              <Route path="jobs" element={<JobsAdminPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="carousels" element={<CarouselAdmin />} />
              <Route path="projectsAdmin" element={<ProjectsAdmin />} />
              <Route path="users" element={<UsersList />} />
            </Route>
          )}
        </Routes>
      </main>
      <Modal title="" isOpen={isLoginModal} onClose={() => navigate('/')}> <LogInPage /> </Modal>
      <Modal title="" isOpen={isSignupModal} onClose={() => navigate('/')}> <SignUpPage /> </Modal>
      {/* פוטר מוצג רק אם לא בדף פורומים ולא בדף קורס בודד */}
      {!((
        location.pathname === '/ForumPage' ||
        location.pathname.startsWith('/ForumPage/') ||
        location.pathname.startsWith('/forums') ||
        (location.pathname.startsWith('/courses/') && location.pathname !== '/courses')
      )) && (
        <footer>
          <EmailIcon style={{ verticalAlign: 'middle' }} /> avigail@diversitech.org.il | DiversiTech אביגיל מיכלסון - מנכ"לית
        </footer>
      )}
      <ToastContainer />
      <ErrorModal />
    </>

  );
}

export default App;