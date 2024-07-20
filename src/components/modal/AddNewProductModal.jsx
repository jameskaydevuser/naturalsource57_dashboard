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
// import { sleepList } from 'src/config/userSleep';
// import { userTypes } from 'src/config/userTypes';
// import { userExperiencesList } from 'src/config/userExperience';
// import { userGoalsList } from 'src/config/userGoal';
// import { userWorkLifeList } from 'src/config/userWorkLife';
// import { createUser, updateUser } from 'src/firebase/users';
import { addNewProduct } from 'src/firebase/product';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { auth, storage } from 'src/firebase';
import { fetchCategoryName } from 'src/firebase/category';

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

export default function AddNewProductModal({ open, setOpen }) {
  const [working, setWorking] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [cat3, setCat3] = useState('');

  useEffect(() => {
    setImageUrl('');
    const fetchCatNames = async () => {
      const cat1name = await fetchCategoryName('xGa0maZtHz6kIwefCQFn');
      setCat1(cat1name);
      const cat2name = await fetchCategoryName('gkF1xs9wzrvhQnlxlM2b');
      setCat2(cat2name);
      const cat3name = await fetchCategoryName('QCsxmPtXtUhQLjIoSIfG');
      setCat3(cat3name);
    };

    fetchCatNames();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const description = formData.get('description');
      const price = formData.get('price');
      const quantity = formData.get('quantity');
      const thc = formData.get('thc');
      const cbd = formData.get('cbd');
      const shipping_fee = formData.get('shipping_fee');

      await addNewProduct({
        name,
        description,
        price,
        quantity,
        shipping_fee,
        thc,
        cbd,
        imageUrl,
        category,
      });

      setOpen(false);
      //   toast.success(`New Product added.`);
    } catch (ex) {
      toast.error(ex.response.data);
    }

    setWorking(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const storageRef = ref(storage, `product-images/${Date.now() + file.name}`);

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
      <DialogTitle>New Product {category}</DialogTitle>
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
            required
          />

          <TextField type="text" label="Name" name="name" required />
          <TextField
            label="Description"
            name="description"
            multiline
            minRows={2}
            maxRows={20}
            required
          />
          <TextField type="number" label="THC %" name="thc" />
          <TextField type="number" label="CBD %" name="cbd" />

          <TextField type="number" label="Price" name="price" required />

          <TextField type="number" label="Quantity (fill empty to set unlimited)" name="quantity" />

          <TextField type="number" label="Shipping Fee" name="shipping_fee" />

          <FormControl fullWidth>
            <InputLabel id="">Category</InputLabel>
            <Select
              labelId=""
              id="select"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value={'xGa0maZtHz6kIwefCQFn'}>{cat1}</MenuItem>
              <MenuItem value={'gkF1xs9wzrvhQnlxlM2b'}>{cat2}</MenuItem>
              <MenuItem value={'QCsxmPtXtUhQLjIoSIfG'}>{cat3}</MenuItem>
            </Select>
          </FormControl>

          <Button
            sx={{ mt: 2 }}
            style={{ width: '100%' }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={working}
          >
            {working ? <CircularProgress color="info" size={22} /> : 'Submit'}
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
          setOpen(false);
        }}
      >
        X
      </Button>
    </Dialog>
  );
}
