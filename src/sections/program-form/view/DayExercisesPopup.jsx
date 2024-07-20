import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Box
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { palette, spacing } from '@mui/system';
import styled from 'styled-components';
import { exerciseTypesList } from 'src/config/exerciseTypes';
import { implement_s, muscles } from 'src/config/exerciseFilters';
import { storage } from 'src/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getDayExercises } from '../utils';
import { ExercisesContext } from 'src/contexts/Exercises';
import Autocomplete from '@mui/material/Autocomplete';

const Form = styled.div`
  ${palette}
  ${spacing}
  display: flex;
  padding: 24px;
  gap: 20px;
  flex-wrap: wrap;
  border: 1px solid #2222ff33;
  margin-bottom: 16px;
  border-radius: 8px;
  flex-direction: column;

  & > * {
    width: 100%;
  }

  & > .row {
    display: flex;
    justify-content: space-between;
  }

  & > .image-holder {
    width: 286px;
    height: 216px;
    position: relative;
    margin: 0 auto;
    padding: 3px;
    border: 2px solid gray;
    display: flex;
    align-items: center;
    justify-content: center;

    & > .exercise-img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    & > label {
      cursor: pointer;
      position: absolute;
      inset: 0;
      z-index: 2;
    }
  }

  & > .remove-btn {
    width: 150px;
    font-size: 12px;
    padding: 4px 8px;
  }
`;

export default function DayExercisesPopup({
  open,
  setOpen,
  originExercises,
  setOriginExercises,
  day,
}) {
  const [uploading, setUploading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const { exercises: predefinedExercises, loading } = useContext(ExercisesContext);

  useEffect(() => {
    setExercises(getDayExercises(originExercises, day));
  }, [open]);

  const handleImageChange = (target, index) => {
    const file = target.files[0];

    if (file && file.type.startsWith('image/')) {
      const storageRef = ref(storage, `exercise-images/${Date.now() + file.name}`);

      setUploading(true);
      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            setExercises((prev) => {
              const prevClone = [...prev];
              prevClone[index]['imageUrl'] = url;
              return prevClone;
            });
          });
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      alert('Invalid file type or no image selected.');
    }
  };

  const handleChangeField = (index, field, value) => {
    setExercises((prev) => {
      const prevClone = [...prev];
      prevClone[index][field] = value;
      return prevClone;
    });
  };

  const addNewExercise = () => {
    setExercises((prev) => {
      return [
        {
          name: '',
          type: '',
          targetMuscle: '',
          description: [],
          implement: '',
          imageUrl: '',
          videoUrl: '',
          sets: 0,
          reps: 0,
        },
        ...prev,
      ];
    });
  };

  const handleDeleteExercise = (index) => {
    setExercises((prev) => {
      return prev.filter((item, indx) => indx !== index);
    });
  };

  const handleSaveChanges = () => {
    setOriginExercises((prev) => {
      const prevClone = [...prev];

      const index = prevClone.findIndex((item) => item.dayOfWeek === day);

      if (index !== -1) {
        prevClone[index].exercises = exercises;
      } else {
        prevClone.push({ dayOfWeek: day, exercises });
      }

      return prevClone;
    });
    setOpen(false);
  };

  const handleAddDescriptionItem = (e, exercise) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (formData.get('description').trim() !== '') {
      const clonedExercises = [...exercises];
      const indexOfExercise = clonedExercises.indexOf(exercise);
      const clonedDescriptionsList = [...clonedExercises[indexOfExercise].description, formData.get('description')];
      clonedExercises[indexOfExercise].description = clonedDescriptionsList;

      setExercises(clonedExercises);
    }

    e.target.reset();
  }

  const handleDeleteDescriptionItem = (exercise, index) => {
    const clonedExercises = [...exercises];
    const indexOfExercise = clonedExercises.indexOf(exercise);
    const clonedDescriptionsList = [...clonedExercises[indexOfExercise].description];
    clonedExercises[indexOfExercise].description = clonedDescriptionsList;

    if (index >= 0 && index < clonedDescriptionsList.length) {
      clonedDescriptionsList.splice(index, 1);

      clonedExercises[indexOfExercise].description = clonedDescriptionsList;
      setExercises(clonedExercises);
    }
  }

  predefinedExercises.forEach(item => {
    item.label = item.name;
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>

      <DialogTitle style={{ textTransform: 'capitalize' }}>{day} Exercises</DialogTitle>
      <DialogContent style={{ minWidth: 600 }}>
        <Button variant="outlined" style={{ marginBottom: 20 }} onClick={addNewExercise}>
          Add New Exercise
        </Button>

        {exercises.map((exercise, index) => (
          <Form key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1 // This adds space between the elements
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={predefinedExercises}
                sx={{ flex: 1 }}
                renderInput={(params) => <TextField {...params} label="Predefined Exercise" />}
                onChange={(e, value) => setSelectedExercise(value)}
              />
              <Button variant="contained" disabled={selectedExercise === null} onClick={() => {
                handleChangeField(index, 'name', selectedExercise.name);
                handleChangeField(index, 'type', selectedExercise.type);
                handleChangeField(index, 'targetMuscle', selectedExercise.targetMuscle);
                handleChangeField(index, 'implement', selectedExercise.implement);
                handleChangeField(index, 'videoUrl', selectedExercise.videoUrl);
                handleChangeField(index, 'imageUrl', selectedExercise.imageUrl);

              }}>Populate</Button>
            </Box>
            <TextField
              type="text"
              InputProps={{
                title: 'Enter at least 3 characters',
              }}
              label="Ttile"
              name="name"
              value={exercise.name}
              onChange={(e) => handleChangeField(index, 'name', e.target.value)}
              required
            />

            <FormControl required>
              <InputLabel id="exercise-type">Exercise Type:</InputLabel>
              <Select
                defaultValue={exerciseTypesList[0].value}
                labelId="exercise-type"
                name="type"
                label="Exercise type"
                value={exercise.type}
                onChange={(e) => handleChangeField(index, 'type', e.target.value)}
              >
                {exerciseTypesList.map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <InputLabel id="exercise-muscle">Target Muscle:</InputLabel>
              <Select
                defaultValue={muscles[0].value}
                labelId="exercise-muscle"
                name="targetMuscle"
                label="Target muscle"
                value={exercise.targetMuscle}
                onChange={(e) => handleChangeField(index, 'targetMuscle', e.target.value)}
              >
                {muscles.map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <InputLabel id="exercise-implement">Implement:</InputLabel>
              <Select
                defaultValue={implement_s[0].value}
                labelId="exercise-implement"
                name="implement"
                label="Implement"
                value={exercise.implement}
                onChange={(e) => handleChangeField(index, 'implement', e.target.value)}
              >
                {implement_s.map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={1} >
              <Grid item xs={3}>
                <TextField
                  type="number"
                  InputProps={{
                    title: 'Enter at number',
                  }}
                  label="Sets"
                  name="sets"
                  defaultValue={exercise.sets}
                  onChange={(e) => handleChangeField(index, 'sets', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  InputProps={{
                    title: 'Enter at number',
                  }}
                  label="Reps"
                  name="reps"
                  defaultValue={exercise.reps}
                  onChange={(e) => handleChangeField(index, 'reps', parseInt(e.target.value))}
                  required
                />            </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  InputProps={{
                    title: 'Enter at number',
                  }}
                  label="Duration"
                  name="duration"
                  defaultValue={exercise.duration || ''}
                  onChange={(e) => handleChangeField(index, 'duration', parseInt(e.target.value))}


                />            </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  InputProps={{
                    title: 'Enter at number',
                  }}
                  label="Rest"
                  name="duration"
                  defaultValue={exercise.rest || ''}
                  onChange={(e) => handleChangeField(index, 'rest', parseInt(e.target.value))}
                />            </Grid>
            </Grid>

            <form style={{ display: "flex", flexDirection: "column" }} onSubmit={e => handleAddDescriptionItem(e, exercise)}>
              <TextField
                type="text"
                label="Description"
                name="description"
                multiline
                minRows={4}
              />
              <Button type='submit' variant="contained" color="primary" sx={{ mt: 1 }}  >
                Add
              </Button>
            </form>

            <List dense={true}>
              {exercise.description.map((item, index) =>
                <ListItem
                  key={item}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDescriptionItem(exercise, index)}>
                      <Typography color='error'>X</Typography>
                    </IconButton>
                  }
                >
                  <ListItemText
                    secondary={item}
                  />
                </ListItem>)}
            </List>

            <TextField
              type="text"
              label="Youtube Video URL"
              name="videoUrl"
              required
              value={exercise.videoUrl}
              onChange={(e) => handleChangeField(index, 'videoUrl', e.target.value)}
            />

            <div className="image-holder">
              Select Image
              <label htmlFor={`exercise-image-${index}`}></label>
              {exercise.imageUrl && <img src={exercise.imageUrl} alt="" className="exercise-img" />}
            </div>
            {uploading && <CircularProgress />}

            <input
              type="file"
              id={`exercise-image-${index}`}
              name="imageUrl"
              style={{ display: 'none' }}
              accept="image/*" // Specify that only image files are allowed
              onChange={(e) => handleImageChange(e.target, index)}
            />

            <Button
              className="remove-btn"
              variant="outlined"
              color="error"
              onClick={() => handleDeleteExercise(index)}
            >
              Remove Exercise
            </Button>
          </Form>
        ))}

        <Button
          sx={{ mt: 1 }}
          style={{ width: '100%' }}
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
        >
          Save
        </Button>
      </DialogContent>
      <Button
        style={{ position: 'absolute', right: 20, top: 20, padding: '0' }}
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(false)}
      >
        X
      </Button>
    </Dialog>
  );
}
