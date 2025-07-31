// // theme.ts
// import { createTheme } from '@mui/material/styles';

// // הרחבת palette להוספת extraColors
// declare module '@mui/material/styles' {
//   interface Palette {
//     extraColors?: {
//       primary800: string;
//     };
//   }
//   interface PaletteOptions {
//     extraColors?: {
//       primary800?: string;
//     };
//   }
// }

// const theme = createTheme({
//   typography: {
//     fontFamily: "'Heebo', sans-serif",
//   },
//   palette: {
//     primary: {
//       main: '#442063',
//     },
//     text: {
//       primary: '#18181b',
//     },
//     extraColors: {
//       primary800: '#d0366d',
//     },
//   },
// });

// export default theme;
import { createTheme } from '@mui/material/styles';

// הרחבת palette להוספת extraColors
declare module '@mui/material/styles' {
  interface Palette {
    extraColors?: {
      primary800: string;
    };
  }
  interface PaletteOptions {
    extraColors?: {
      primary800?: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "'Heebo', sans-serif",
  },
  palette: {
    primary: {
      main: '#442063', // סגול כהה
    },
    text: {
      primary: '#18181b', // טקסט כהה רגיל
    },
    extraColors: {
      primary800: '#442063', // גם הסגול הנוסף תואם
    },
  },
});

export default theme;
