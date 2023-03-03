import {
  Container,
  Stack,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDoc, doc } from 'firebase/firestore';
import Page from '../components/Page';
import { db, auth } from '../firebase-config';

export const Room = () => {

  const [user] = useAuthState(auth);
  const userUID = user ? user.uid : '';

  const navigate = useNavigate();

  const [formSubmit, setFormSubmit] = useState(false);
  const [roomError, setRoomError] = useState(false);

  const roomSchema = yup.object().shape({
    roomID: yup.string().length(6, "Invalid Room ID").required('Room ID is Required'),
  });


  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const roomID = values.roomID;

    const docRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(docRef);

    // if the document with the roomID exists
    if (docSnap.exists()) {
      alert("Successfully joined Room!");

      navigate('/dashboard/privateroom')

    }
    
    setRoomError(true)

    actions.resetForm();

  }

  const { handleChange, handleBlur, values, handleSubmit, isSubmitting, errors } = useFormik({
    initialValues: {
      roomID: '',
    },
    validationSchema: roomSchema,
    onSubmit,
  });

  const createRoom = async () => {
    alert("your code is 123456")
    navigate('/dashboard/privateroom')
  }


  return (
    <>
      <Page title="Join or Create Room">
        <Container>
          <Grid container spacing={0}>
            <Grid xs={5}>
              <Stack alignItems="left" justifyContent="space-between" sx={{ ml: 2, mr: 5 }}>
                <Typography variant="h4" gutterBottom>
                  Join or Create a Room
                </Typography>
                <Typography mb={3}>
                  Here you can join/create a room. To join a room, please enter the 6 character code 
                  the owner has shared with you! Creating a room will auto-generate this code for you to share.
                </Typography>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Card sx={{ pt: 2, pb: 2, pl: 3, pr: 3}}>
                    <Stack direction={{ xs: 'column', sm: 'col' }} spacing={0} marginBottom={3}>
                      <TextField
                        label="Room ID"
                        variant="outlined"
                        name="roomID"
                        margin="normal"
                        onChange={handleChange}
                        value={values.roomID}
                        onBlur={handleBlur}
                        error={(errors.roomID || roomError) && formSubmit}
                        helperText={
                          (errors.roomID && formSubmit ? errors.roomID : '') ||
                          (roomError && formSubmit ? 'Room does not exist' : '')
                        }
                        sx={{ pb: 1 }}
                      />

                      <LoadingButton
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        onClick={() => setFormSubmit(true)}
                      >
                        Join Room
                      </LoadingButton>
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          OR
                        </Typography>
                      </Divider>
                      <Button
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        onClick={createRoom}
                      >
                        Create Room
                      </Button>
                    </Stack>
                  </Card>
                </form>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Page>





      
    </>

    
)
}