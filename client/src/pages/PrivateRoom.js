import io from 'socket.io-client';
import {
  Container,
  Stack,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListItemText
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Page from '../components/Page';


export const PrivateRoom = () => {

  const socket = io.connect('http://localhost:3001')
  const [tasks, setTasks] = useState([]);

  const onSubmit = (values, actions) => {
    socket.emit('send_message', `${values.task}`)

    actions.resetForm()
  }

  useEffect(() => {
    socket.on('receive_message', (task) => {
      setTasks([task, ...tasks])
    })
  }, [socket])

  const [formSubmit, setFormSubmit] = useState(false);

  const taskSchema = yup.object().shape({
    task: yup.string().required("Cannot add empty task"),
  });

  const { handleChange, handleBlur, values, handleSubmit, isSubmitting, errors } = useFormik({
    initialValues: {
      task: ''
    },
    validationSchema: taskSchema,
    onSubmit,
  });

  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };



  return (
    <>
      <Page title="Private Room">
        <Container>
          <Grid container spacing={0}>
            <Grid xs={6}>
              <Stack alignItems="left" justifyContent="space-between">
                <Typography variant="h4" gutterBottom>
                  Chores
                </Typography>
                <form onSubmit={handleSubmit} autoComplete="off">

                  <TextField
                    sx={{ width: '35ch' }}
                    variant="outlined"
                    name="task"
                    placeholder='enter task to complete'
                    onChange={handleChange}
                    value={values.task}
                    onBlur={handleBlur}
                    error={errors.task && formSubmit}
                    helperText={errors.task && formSubmit ? errors.task : ''}
                    />

                  <LoadingButton 
                      sx={{ml: 2}}
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      onClick={() => setFormSubmit(true)}
                      onSubmit={handleSubmit}>
                    Add Task
                  </LoadingButton>
                </form>

                <List>
                  {tasks.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;
                    return (
                    
                    <ListItem key={index} disablePadding>
                      <ListItemButton role={undefined} onClick={handleToggle(index)}>
                        <Checkbox 
                          edge='start'
                          checked={checked.indexOf(index) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }} />
                        <ListItemText id={labelId} primary={value} />
                      </ListItemButton>
                    </ListItem>
                )})}
                </List>


              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>

    
)
}