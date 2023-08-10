import '../styles/globals.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../styles/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
