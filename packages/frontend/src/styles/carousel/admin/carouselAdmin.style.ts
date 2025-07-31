export const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "row",      // שורה מאוזנת
    justifyContent: "center",  // באמצע
    alignItems: "center",      // ליישור אנכי
    gap: "1rem",               // רווח בין הכפתורים
    flexWrap: "wrap",          // רספונסיבי למסכים קטנים
    marginBottom: "2%",
    marginRight: "3vw",
    marginLeft: "3vw",
  },
  navItems: {
    border: "none",
    minWidth: "180px",
    maxWidth: "220px",
    width: "auto",
    height: "48px",
    whiteSpace: "nowrap",
    boxShadow: " rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"
  },
  navContainer: {
    // backgroundImage: "url(/images/home.png)",
    // backgroundSize: "cover",
    // backgroundPosition: "center center",
    padding: "2rem 1rem",
    borderBottom: "4px solid rgb(204, 204, 204)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingBottom:0,
    paddingRight:0,
    paddingLeft:0
  },
  button: {
    backgroundColor: "#fff",
    color: "#442063",
    border: "1px solid #442063",
    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
      color: '#442063 !important',
      border: '1px solid #442063',
      boxShadow: 'none',
    },
    boxShadow: 'none',
     '&.MuiButton-contained': {
        backgroundColor: '#fff !important',
        color: '#442063 !important',
        border: '1px solid #442063',
        boxShadow: 'none',
      },
     '&.MuiButton-outlined': {
        backgroundColor: '#fff !important',
        color: '#442063 !important',
        border: '1px solid #442063',
        boxShadow: 'none',
      },
    '&.active': {
      backgroundColor: "#e0d3ec !important", // צבע רקע שונה כאשר הכפתור פעיל
    },
  },
};