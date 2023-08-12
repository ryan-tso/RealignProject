import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Box, Typography} from "@mui/material";
import ComparisonTable from '../components/ComparisonTable';

const TITLE = "Product Compare"
const SUBTITLE = "Need help deciding? Compare our products and subscribe to be notified when it releases!"

const PRODUCTS = [
  {
    id: '1',
    name: 'Product 1',
    picture: 'https://career-files.s3.us-west-1.amazonaws.com/ProductIcon.png',
    specifications: [
      {spec: 'Spec 1', description: 'Some details'},
      {spec: 'Spec 2', description: 'Some more details'},
      {spec: 'Spec 3', description: 'N/A'},
      {spec: 'Spec 4', description: '3'}
    ]
  },
  {
    id: '2',
    name: 'Product 2',
    picture: 'https://career-files.s3.us-west-1.amazonaws.com/ProductIcon.png',
    specifications: [
      {spec: 'Spec 1', description: 'Some details'},
      {spec: 'Spec 2', description: 'Some more details'},
      {spec: 'Spec 3', description: 'N/A'},
      {spec: 'Spec 4', description: '3'}
    ]
  },
]

const pageStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  pt: '2vh',
  pl: {xs: 0, sm: '10%'},
  pr: {xs: 0, sm: '10%'},
  backgroundColor: 'rgba(0,0,0,0.02)'
}

const pageTitleStyle = {
  display: 'flex',
  flexDirection: 'column',
  ml: {xs: '2%', sm: 0},
  mr: {xs: '2%', sm: 0},
  mb: '100px'
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

      <ComparisonTable products={PRODUCTS}/>


    </Box>
  )
}
