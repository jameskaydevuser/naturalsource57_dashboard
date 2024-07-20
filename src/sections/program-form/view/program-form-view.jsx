import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DayExercisesPopup from './DayExercisesPopup';
import { addNewProgram, getProgramById, updateProgram } from 'src/firebase/programs';
import { CircularProgress } from '@mui/material';


// ----------------------------------------------------------------------

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
`;

export default function ProgramFormPage() {
  const { param } = useParams();

  const navigate = useNavigate();

  const [loadingProgram, setLoadingProgram] = useState(false);
  const [submiting, setSubmiting] = useState(false);

  const [activeDays, setActiveDays] = useState([
    { dayOfWeek: 'monday', exercises: [] },
    { dayOfWeek: 'tuesday', exercises: [] },
    { dayOfWeek: 'wednesday', exercises: [] },
    { dayOfWeek: 'thursday', exercises: [] },
    { dayOfWeek: 'friday', exercises: [] },
    { dayOfWeek: 'saturday', exercises: [] },
    { dayOfWeek: 'sunday', exercises: [] },
  ]);

  const [open, setOpen] = useState(false);
  const [day, setDay] = useState('monday');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    videoUrl: '',
    description: [],
  });

  const [descriptionInput, setDescriptionInput] = useState('');


  useEffect(() => {
    if (param !== 'new') {
      setLoadingProgram(true);
      getProgramById(param).then((program) => {
        setActiveDays(program.activeDays);
        setFormData({
          name: program.name,
          price: program.price,
          videoUrl: program.videoUrl,
          description: program.description,
        });
        setLoadingProgram(false);
      });
    }
  }, [param]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);

    if (param === 'new') {
      await addNewProgram({
        ...formData,
        activeDays,
      });
    } else {
      await updateProgram({
        programId: param,
        activeDays,
        ...formData,
      });
    }

    navigate(-1);
    setSubmiting(false);
  };

  const addNewDescriptionItem = () => {
    if (descriptionInput.trim() !== '') {
      const clonedFormData = { ...formData };
      const clonedDescriptions = clonedFormData.description;

      clonedDescriptions.push(descriptionInput);

      setFormData({ ...clonedFormData, description: clonedDescriptions });
    }
    setDescriptionInput('');
  }

  const handleDeleteDescriptionItem = index => {
    const clonedFormData = { ...formData };

    const clonedDescriptions = [...clonedFormData.description];

    if (index >= 0 && index < clonedDescriptions.length) {
      clonedDescriptions.splice(index, 1);

      clonedFormData.description = clonedDescriptions;

      setFormData({ ...clonedFormData });
    }
  }

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Program Form</Typography>
        </Stack>
        <Card sx={{ p: 3 }}>
          {loadingProgram ? (
            <CircularProgress />
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Product Information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="price"
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="videoUrl"
                    label="Video URL"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={descriptionInput}
                    onChange={e => setDescriptionInput(e.target.value)}
                  />

                  <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={addNewDescriptionItem} >
                    Add
                  </Button>

                  <List dense={true}>
                    {formData.description.map((item, index) =>
                      <ListItem
                        key={item}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDescriptionItem(index)}>
                            <Typography color='error'>X</Typography>
                          </IconButton>
                        }
                      >
                        <ListItemText
                          secondary={item}
                        />
                      </ListItem>)}
                  </List>

                </Grid>
              </Grid>
              <ButtonsContainer>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('monday');
                    setOpen(true);
                  }}
                >
                  Monday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('tuesday');
                    setOpen(true);
                  }}
                >
                  Tuesday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('wednesday');
                    setOpen(true);
                  }}
                >
                  Wednesday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('thursday');
                    setOpen(true);
                  }}
                >
                  Thursday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('friday');
                    setOpen(true);
                  }}
                >
                  Friday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('saturday');
                    setOpen(true);
                  }}
                >
                  Saturday
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setDay('sunday');
                    setOpen(true);
                  }}
                >
                  Sunday
                </Button>
              </ButtonsContainer>
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                {submiting ? <CircularProgress color="warning" size={25} /> : 'Submit'}
              </Button>
            </form>
          )}
        </Card>
      </Container>
      <DayExercisesPopup
        open={open}
        setOpen={setOpen}
        originExercises={activeDays}
        setOriginExercises={setActiveDays}
        day={day}
      />
    </>
  );
}
