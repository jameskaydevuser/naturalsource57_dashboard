import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { palette, spacing } from '@mui/system';
import styled from 'styled-components';
import { sleepList } from 'src/config/userSleep';
import { userTypes } from 'src/config/userTypes';
import { userExperiencesList } from 'src/config/userExperience';
import { userGoalsList } from 'src/config/userGoal';
import { userWorkLifeList } from 'src/config/userWorkLife';
import { updateUser } from 'src/firebase/users';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from 'src/firebase';

const Form = styled.form`
  ${palette}
  ${spacing}
  display: flex;
  padding: 24px;
  gap: 24px;
  flex-wrap: wrap;

  & > * {
    width: 100%;
  }

  & > .image-holder {
    width: 180px;
    height: 180px;
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

export default function UpdateUserModal({ user, open, setOpen }) {
  const [working, setWorking] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profile_img);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImageUrl(user?.profile_img);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      const formData = new FormData(e.target); // Access the form data
      const firstname = formData.get('firstname'); // Get the value of the 'firstName' field
      const lastname = formData.get('lastname'); // Get the value of the 'lastName' field
      const job_title = formData.get('job_title'); // Get the value of the 'lastName' field
      const phone_number = formData.get('phone_number'); // Get the value of the 'lastName' field
      const address = formData.get('address'); // Get the value of the 'lastName' field
      const is_contactable = formData.get('is_contactable'); // Get the value of the 'lastName' field

      await updateUser({
        user,
        firstname,
        lastname,
        job_title,
        phone_number,
        address,
        is_contactable,
        profile_img: imageUrl
      });

      setOpen(false);
      toast.success(`${user.display_name} record updated successfully.`);
    } catch (ex) {
      toast.error(ex.message);
    }

    setWorking(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const storageRef = ref(storage, `profile-images/${Date.now() + file.name}`);

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
      <DialogTitle>User Record</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit}>
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

          <TextField
            type="text"
            defaultValue={user?.firstname}
            label="First Name"
            name="firstname"
          />
          <TextField
            defaultValue={user?.lastname}
            label="Last Name"
            name="lastname"
            title="Atleast 3 character"
          />
          <TextField
            value={user?.email}
            label="Email"
            name="email"
            type="email"
            inputProps={{ readOnly: true }}
          />

          <TextField
            type="text"
            label="Job Title"
            name="job_title"
            defaultValue={user?.job_title}
          />
          <TextField type="text" label="Phone Number" name="phone_number" defaultValue={user?.phone_number} />


          <TextField
            type="text"
            defaultValue={user?.address}
            label="Address"
            name="address"
          />

          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={user?.is_contactable}
                name="is_contactable"
              />
            }
            label="Is Contactable"
          />

          <Button
            sx={{ mt: 2 }}
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
        type="submit"
        variant="outlined"
        color="error"
        size="small"
        onClick={() => {
          setOpen(false)
        }}
      >
        X
      </Button>
    </Dialog>
  );
}