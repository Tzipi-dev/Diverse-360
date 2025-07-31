// import { SxProps, Theme } from "@mui/material";

// export const styles: Record<string, SxProps<Theme>> = {
//   mainContainer: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//     gap: 2,
//     p: 2,
//     mb: 3,
//   },

//   itemImage: {
//     width: "100%",
//     height: "200px",
//     objectFit: "cover",
//     borderRadius: 2,
//     boxShadow: 1,
//     transition: "transform 0.3s ease",
//     "&:hover": {
//       transform: "scale(1.05)",
//     },
//   },
//   title:{
//     margin:0
//   },
//   description:{
//     fontSize: "0.9rem",
//     color: "#666" 
//   },

//   imageWrapper: {
//     position: 'relative',
//   },

//   iconOverlay: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     display: 'flex',
//     gap: 1,
//     zIndex: 2,
//   },
// };
// carouselTable.style.ts
import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  mainContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 2,
    p: 2,
    mb: 3,
    marginBottom:0,
  },
  itemImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: 2,
    boxShadow: 1,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  title: {
    fontWeight: 600,
    textAlign: "center",
    mb: 1,
  },
  iconOverlay: {
    display: "flex",
    justifyContent: "center",
    gap: 1,
    mt: 1,
  },
  imageWrapper: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    p: 1,
  },
  addButton:{
    position:"absolute",
    left:"2px",
    alignSelf: "anchor-center",
    marginLeft:"3%",
    boxShadow: " rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"

  },
  displayOptions:{
    display:"flex",
    gap: "1%",
    justifyContent: "center"
  },
  searchBar:{
    marginTop: 2,
    marginBottom: 2,
    width: '100%',
    maxWidth: 400,
    right:"2px",
    alignSelf: 'flex-start', // שינוי כאן מ-center ל-flex-end
    borderRadius: 2,
    boxShadow: "rgba(196, 205, 215, 0.4) 0px 0px 0px 2px, rgba(255, 255, 255, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;",
    '& .MuiOutlinedInput-root': {
      borderRadius: 2, },
    '& .MuiOutlinedInput-input': { color: '#251b43' },
   },
  tableContainer:{
     mt: 4,
     mx: 'auto',
     maxWidth: 1200,
     borderRadius: 3,
     boxShadow: 3,
  },
  container:{
    display: "flex",
    flexDirection: "column",
    gap: "20%",
    width: "minContent",
    justifyContent:"flex-end"
  },
  sortingOption:{
    width: "fitContent",
    color:"#251b43",
    maxWidth:"max-content",
    boxShadow: "rgba(196, 205, 215, 0.4) 0px 0px 0px 2px, rgba(255, 255, 255, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;",
  },
  sortingOptionsBox:{
    display: "flex",
    gap: "2%",
    marginBottom: "2%",
    color:"#251b43",
  },
};
