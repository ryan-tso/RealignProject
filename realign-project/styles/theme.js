import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5bead0',
      contrastText: '#000000',
    }
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 700,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})