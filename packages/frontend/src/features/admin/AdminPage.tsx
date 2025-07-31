import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { navStyle, getLinkStyle } from '../../styles/courses/admin/AdminPage.styles';
import CompactAnalyticsPopup from './components/ScreenAnalyticsChart'; 

const AdminPage = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  // פונקציות לטיפול ב־hover (משמר מהקוד שלך)
  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.currentTarget.classList.contains('active')) {
      e.currentTarget.style.color = '#442063';
      (e.currentTarget.style as any).WebkitTextFillColor = '#442063';
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.textDecoration = 'none';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.currentTarget.classList.contains('active')) {
      e.currentTarget.style.color = '#18181b';
      (e.currentTarget.style as any).WebkitTextFillColor = '#18181b';
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.textDecoration = 'none';
    }
  };

  return (
    <div style={{ marginTop: "80px" }}>
      {/* רקע עם תמונת הניווט */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "65px",
          backgroundImage: "url('/images/nav.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 999,
        }}
      />

      <nav style={navStyle}>
        <NavLink
          to="jobs"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          משרות
        </NavLink>
        <NavLink
          to="courses"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          קורסים
        </NavLink>
        <NavLink
          to="carousels"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          קרוסלות
        </NavLink>

        <NavLink
          to="projectsAdmin"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          פרויקטים
        </NavLink>
        <NavLink
          to="users"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          משתמשים
        </NavLink>
            <NavLink
          to="/admin/analytics"
          style={({ isActive }) => getLinkStyle(isActive)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          אנליטיקות
        </NavLink>
      </nav>

      <Outlet />
   
    </div>
  );
};

export default AdminPage;