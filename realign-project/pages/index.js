import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Box, Typography} from "@mui/material";
import ComparisonTable from '../components/ComparisonTable';

const pageStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  pt: '2vh',
  pl: {xs: 0, sm: '10%'},
  pr: {xs: 0, sm: '10%'},
}

const pageTitleStyle = {
  display: 'flex',
  flexDirection: 'column',
  ml: {xs: '2%', sm: 0},
  mr: {xs: '2%', sm: 0},
}

const titleStyle = {
  fontSize: {xs: '3rem', sm: '3.5rem'},
  fontWeight: 700,
  textAlign: {xs: 'center', sm: 'left'}
}

const subtitleStyle = {
  fontSize: {xs: '1.25rem', sm: '1.5rem'},
  color: 'rgba(0, 0, 0, 0.7)',
  textAlign: {xs: 'center', sm: 'left'}
}

const TITLE = "Product Compare"
const SUBTITLE = "Need help deciding? Compare our products and subscribe to be notified when it releases!"

export default function Home() {
  return (
    <Box sx={pageStyle}>
      <Head>
        <title>Compare Product</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={pageTitleStyle}>
        <Typography sx={titleStyle}> {TITLE} </Typography>
        <Typography sx={subtitleStyle}> {SUBTITLE} </Typography>
      </Box>


    </Box>
  )
}
