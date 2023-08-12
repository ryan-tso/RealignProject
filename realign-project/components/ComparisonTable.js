import {Box, Checkbox, Divider, Grid, Stack, TextField, Typography, useTheme} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import * as Yup from 'yup';
import {useEffect, useState} from "react";
import {Form, FormikProvider, useFormik} from "formik";
import axios from "axios";
import {useRouter} from 'next/router';

const FORM_BACKGROUND_COLOR = '#000000'
const SPEC_BACKGROUND_COLOR = 'rgba(0,0,0,0.6)'
const SPEC_WIDTH = '16%'
const PRODUCT_WIDTH = '42%'

const productTitleTextStyle = {
  fontSize: '2rem',
  fontWeight: 700,
  width: '100%',
}

const specTextStyle = {
  fontSize: '1.2rem',
  fontWeight: 500
}

const productDetailTextStyle = {
  fontSize: '1.1rem',
  fontWeight: 300,
}

const specContainerStyle = {
  display: 'flex',
  width: SPEC_WIDTH,
  minHeight: '100px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: SPEC_BACKGROUND_COLOR,
  color: 'white'
}

const productDetailContainerStyle = {
  display: 'flex',
  width: PRODUCT_WIDTH,
  minHeight: '100px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
}

const textFieldStyle = {
  backgroundColor: 'white',
  borderRadius: 1,
  '& .MuiInputBase-input.Mui-disabled': {WebkitTextFillColor: 'black'}
}

const submitButtonStyle = {
  width: '20%',
  minWidth: '100px',
  height: '35px',
  mt: '15px',
  ml: 'auto',
  borderRadius: 10
}


export default function ComparisonTable({products}) {
  const theme = useTheme();
  const router = useRouter();
  const [checked, setChecked] = useState({});
  const [error, setError] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: '',
    phone: '',
  })

  // Check if UTM visit and log it
  useEffect(() => {
    if (!router.isReady) return;
    const params = router.query;
    console.log(JSON.stringify(params));

    let isUTM = false;
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach((property) => {
      if (params.hasOwnProperty(property)) isUTM = true;
    })

    if (isUTM) {
      axios.post(`/api/utms/`, params)
        .then((response) => {
          if (response.status === 200) {
            console.log("UTM visit logged");
          }
        }).catch((err) => {
        console.log(`Error in logging UTM ${JSON.stringify(err)}`);
      })
    }
  }, [router.isReady, router.query])

  // Initialize check boxes
  useEffect(() => {
    let initialChecked = {}
    for (let product of products) {
      initialChecked[product.id] = false;
    }
    setChecked(initialChecked);
  }, [])


  const inputTextStyle = {
    input: {color: 'black'}
  }

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const SubscriptionFormSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Must be a valid email address').max(254, 'Too long!'),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: SubscriptionFormSchema,
    validateOnChange: false,
    validateOnBlur: true,

    onSubmit: (values) => {
      setError(false);
      const remainingValues = Object.assign({}, values);

      // // remove blank or unchanged values
      // Object.keys(remainingValues).forEach(key => {
      //   if (remainingValues[key] === '' || remainingValues[key] === initialValues[`${key}`]) delete remainingValues[key];
      // })

      return axios.post(
        `/api/subscriptions/`,
        {...remainingValues, checkedProducts: checked},
        {headers: {'Content-Type': 'application/json'}}
      ).then((response) => {                      // Response Object -> [productId, productId, ...,]
        if (response.status === 200) {
          console.log('Successfully subscribed!');
          setInitialValues({email: '', phone: ''});

          // Trigger GTM tag for every subscription
          window.dataLayer = window.dataLayer || [];
            for (let newSub of response.data) {
              dataLayer.push({
                event: `button${newSub}-click`,
                conversionValue: 25
              })
            }
        }
      }).catch((err) => {
        setError(true);
        console.log(`Error in subscribing with error ${JSON.stringify(err)}`);
      })
    }
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    resetForm,
    setFieldValue
  } = formik;


  return (
    <Box>
      <Stack direction='column' divider={<Divider orientation="horizontal" flexItem/>}>

        <Stack direction='row' divider={<Divider orientation="vertical" flexItem/>}>
          <Box sx={{...specContainerStyle, backgroundColor: ''}}/>
          {
            products.map((product) => (
              <Stack spacing={3} direction='column'
                     sx={{...productDetailContainerStyle, height: '100%', justifyContent: 'flex-start', mb: '20px'}}>
                <Typography align='center' sx={{...productTitleTextStyle, backgroundColor: theme.palette.primary.main}}>
                  {product.name}
                </Typography>
                <Box component="img" sx={{height: '75px', width: '75px'}} src={product.picture}/>
              </Stack>
            ))
          }
        </Stack>
        {
          products[0].specifications.map((item, index) => (
            <Stack direction='row' divider={<Divider orientation="vertical" flexItem/>}>
              <Box sx={specContainerStyle}>
                <Typography align='center' sx={specTextStyle}>
                  {item.spec}
                </Typography>
              </Box>
              {
                products.map((product) => (
                  <Box sx={productDetailContainerStyle}>
                    <Typography align='center' sx={productDetailTextStyle}>
                      {product.specifications[index].description}
                    </Typography>
                  </Box>
                ))
              }
            </Stack>
          ))}

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction='row' sx={{backgroundColor: FORM_BACKGROUND_COLOR}}>
              <Box
                sx={{...specContainerStyle, minHeight: 0, alignItems: 'flex-start', justifyContent: 'flex-end', mt: 1}}>
                <Typography align='right' sx={{fontSize: '1.5rem', fontWeight: 700, color: 'white'}}>
                  Notify Me
                </Typography>
              </Box>
              <Stack direction="column" sx={{width: '84%'}}>
                <Stack direction="row">
                  {
                    products.map((product) => (
                      <Box sx={{
                        ...productDetailContainerStyle,
                        minHeight: 0,
                        width: '100%',
                        backgroundColor: FORM_BACKGROUND_COLOR
                      }}>
                        <Checkbox
                          checked={checked[product.id]}
                          onChange={(e) => setChecked({...checked, [product.id]: e.target.checked})}
                          sx={{color: 'white'}}
                        />
                      </Box>
                    ))
                  }
                </Stack>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '90%', mt: 2, ml: '5%', mr: '5%', mb: 5}}>
                  <Typography sx={{color: 'white'}}>Email</Typography>
                  <TextField
                    required
                    variant='outlined'
                    sx={{...inputTextStyle, ...textFieldStyle}}
                    fullWidth
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    // helperText={touched.email && errors.email}
                    onChange={(event) => {
                      event.preventDefault();
                      const {value} = event.target;
                      setFieldValue("email", value);
                    }}
                  />
                  {touched.email && <Box sx={{color: 'red'}}> {errors.email} </Box>}

                  <Typography sx={{color: 'white', mt: '10px'}}>Phone</Typography>
                  <TextField
                    variant='outlined'
                    sx={{...inputTextStyle, ...textFieldStyle}}
                    fullWidth
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    // helperText={touched.phone && errors.phone}
                    onChange={(event) => {
                      event.preventDefault();
                      const {value} = event.target;
                      setFieldValue("phone", value);
                    }}
                  />
                  {touched.email && <Box sx={{color: 'red'}}> {errors.phone} </Box>}
                  <LoadingButton
                    sx={submitButtonStyle}
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={!formik.dirty}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Stack>
            </Stack>
          </Form>
        </FormikProvider>

      </Stack>
    </Box>
  )
}