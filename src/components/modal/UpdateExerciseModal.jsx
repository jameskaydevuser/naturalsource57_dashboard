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
  Typography
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { palette, spacing } from '@mui/system';
import styled from 'styled-components';
import { exerciseTypesList } from 'src/config/exerciseTypes';
import { updateExercise } from 'src/firebase/exercises';
import { implement_s, muscles } from 'src/config/exerciseFilters';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from 'src/firebase';
import { useEffect } from 'react';

const Form = styled.form`
  ${palette}
  ${spacing}
  display: flex;
  padding: 24px;
  gap: 20px;
  flex-wrap: wrap;

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
`;

export default function UpdateExerciseModal({ exercise, open, setOpen }) {
  const [working, setWorking] = useState(false);
  const [imageUrl, setImageUrl] = useState(exercise?.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [descriptionsList, setDescriptionsList] = useState(exercise?.description || []);
  const [descriptionInput, setDescriptionInput] = useState('');

  useEffect(() => {
    setDescriptionsList(exercise?.description || []);
  }, [exercise])

  useEffect(() => {
    setImageUrl(exercise?.imageUrl);
  }, [exercise?.imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      const formData = new FormData(e.target);

      await updateExercise(
        exercise.ref,
        formData.get('name'),
        descriptionsList,
        formData.get('type'),
        formData.get('videoUrl'),
        formData.get('targetMuscle'),
        formData.get('implement'),
        imageUrl
      );

      setDescriptionsList([]);

      setOpen(false);
      toast.success(`${exercise.name} record updated successfully.`);
    } catch (ex) {
      toast.error(ex.message);
    }

    setWorking(false);
  };

  const addNewDescriptionItem = () => {
    if (descriptionInput.trim() !== '') {
      setDescriptionsList([...descriptionsList, descriptionInput]);
    }
    setDescriptionInput('');
  }

  const handleDeleteDescriptionItem = index => {
    const clonedDescriptions = [...descriptionsList];

    if (index >= 0 && index < clonedDescriptions.length) {
      clonedDescriptions.splice(index, 1);

      setDescriptionsList(clonedDescriptions);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const storageRef = ref(storage, `exercise-images/${Date.now() + file.name}`);

      setUploading(true);
      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            setImageUrl(url);
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

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Exercise Record</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit}>
          <TextField type="text" defaultValue={exercise?.name} label="Name" name="name" />

          <FormControl>
            <InputLabel id="exercise-type">Exercise Type:</InputLabel>
            <Select
              labelId="exercise-type"
              name="type"
              label="Exercise type"
              defaultValue={exercise?.type}
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
              defaultValue={exercise?.targetMuscle}
              labelId="exercise-muscle"
              name="targetMuscle"
              label="Target muscle"
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
              defaultValue={exercise?.implement}
              labelId="exercise-implement"
              name="implement"
              label="Implement"
            >
              {implement_s.map((item) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="text"
            value={descriptionInput}
            label="Description"
            name="description"
            multiline
            minRows={4}
            onChange={e => setDescriptionInput(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={addNewDescriptionItem} >
            Add
          </Button>

          <List dense={true}>
            {descriptionsList.map((item, index) =>
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

          <TextField
            type="text"
            defaultValue={exercise?.videoUrl}
            label="Youtube Video URL"
            name="videoUrl"
          />

          <div className="image-holder">
            Select Image
            <label htmlFor="exercise-image"></label>
            {imageUrl && <img src={imageUrl} alt="" className="exercise-img" />}
          </div>
          {uploading && <CircularProgress />}

          <input
            type="file"
            id="exercise-image"
            name="imageUrl"
            style={{ display: 'none' }}
            accept="image/*" // Specify that only image files are allowed
            onChange={handleImageChange}
          />

          <Button
            sx={{ mt: 1 }}
            style={{ width: '100%' }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={working}
          >
            {working ? <CircularProgress color="info" size={22} /> : 'Save'}
          </Button>
        </Form>
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
