import React, { useState } from 'react'
import { Course } from '../../../types/coursesTypes';
import { Link } from 'react-router-dom';
import { CSSProperties, useMediaQuery, useTheme } from '@mui/material';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [hover, setHover] = useState(false);
  
  // רספונסיביות
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      direction: "rtl" as const,
      fontFamily: "sans-serif",
      position: "relative" as const,
      width: isMobile ? "100%" : "20vw",
      height: isMobile ? "auto" : "30vh",
      marginTop: isMobile ? "2vh" : "8vh",
      marginBottom: isMobile ? "2vh" : "15vh"
    },
    header: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: "0.5vh"
    },
    title: {
      margin: 0,
      fontSize: isMobile ? "18px" : "20px",
      color: "#333",
      textAlign: "right",
      marginBottom: "0.5vh"
    },
    description: {
      margin: 0,
      fontSize: isMobile ? "14px" : "15px",
      color: "#333",
      textAlign: "right",
      marginBottom: "0.5vh",
    },
    menuWrapper: {
      position: "relative" as const,
    },
    menuButton: {
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
    dropdown: {
      position: "absolute" as const,
      top: "100%",
      left: 0,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      zIndex: 10,
    },
    dropdownItem: {
      padding: "8px 12px",
      display: "block",
      width: "100%",
      background: "none",
      border: "none",
      textAlign: "right" as const,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
    },
  };
const certificateTagStyles: CSSProperties = {
  // Box model - size and spacing
  display: 'inlineBlock', // CamelCase for CSS properties in JS objects
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1px 16px', // String for combined values
  width: "auto",
  // Shape and background
  backgroundColor: '#ffffff',
  borderRadius: '25px',
  border: '1px solid #e0e0e0',
  marginBottom: "0.5vh",
  textAlign: "center",

  // Text styling
  color: '#333333',
  fontFamily: "'Heebo', sans-serif", 
  fontSize: isMobile ? '14px' : '16px',
  fontWeight: '600', // Number or string for font weight
  direction: 'ltr',

  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
};
const certificateTagStyles2: CSSProperties = {
  // Box model - size and spacing
  display: 'inlineBlock', // CamelCase for CSS properties in JS objects
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1px 16px', // String for combined values
  width: "auto",
  // Shape and background
  backgroundColor: '#e6e6e6',
  borderRadius: '25px',
  border: '1px solid #e0e0e0',
  marginBottom: "0.5vh",
  textAlign: "center",
  marginTop: "1vh",
  // Text styling
 
  fontFamily: "'Heebo', sans-serif", 
  fontSize: isMobile ? '14px' : '16px',
  fontWeight: '600', // Number or string for font weight
  direction: 'ltr',

  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
};
const certificateTagHoverStyles = {
  backgroundColor: '#f5f5f5',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
};
  return (
    <div >
      <Link
        to={`/courses/${course.title}`}
        state={{ course }}
      >
        <div style={styles.card}>
          <img
            src={course.imageUrl}
            alt={course.title}
            style={{
              width: isMobile ? "100%" : "20vw",
              height: isMobile ? "200px" : "25vh",
              borderRadius: "10px",
              transition: "box-shadow 0.3s ease",
              boxShadow: hover ? "0 4px 10px rgba(0,0,0,0.3)" : "none",
              objectFit: "cover"
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
          <div style={styles.header}>
            <h3 style={styles.title}>{course.title}</h3>
          </div>
          <h3 style={styles.description}>{course.description}</h3>
          <div style={certificateTagStyles}>{course.subject}</div>
            <div style={certificateTagStyles2}>{course.lecturer}</div>
        </div>
      </Link>
    </div>
  )
}

export default CourseCard;