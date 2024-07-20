// import { useState } from 'react';
import { useLocation } from 'react-router-dom';

// import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { Button, FormControl, FormGroup, FormLabel, TextField, Toolbar } from '@mui/material';
import { useState, useEffect } from 'react';
// import AddNewUserModal from '../modal/AddNewUserModal';
import AddNewProductModal from 'src/components/modal/AddNewProductModal';

import { fetchAllProducts } from 'src/firebase/product';
// import { products } from 'src/_mock/products';

import ProductCard from '../product-card';
// import ProductSort from '../product-sort';
// import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';
import UpdateProductModal from 'src/components/modal/UpdateProductModal';
import { fetchCategory, updateCategory } from 'src/firebase/category';
import { uploadImage } from 'src/firebase/category';
import { toast } from 'react-toastify';
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openEdition, setOpenEdition] = useState(false);
  const [productOnEdition, setProductOnEdition] = useState(false);

  const [openAddNewModal, setOpenAddNewModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [background, setBackground] = useState('');

  const [iconFile, setIconFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  // Use useLocation to get the current URL
  const location = useLocation();

  // Function to parse query string
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();
  const cat = query.get('cat');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const prods = await fetchAllProducts(cat);
      setProducts(prods);
      setIsLoading(false);
    };

    fetchProducts();
  }, [cat]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const categoryData = await fetchCategory(cat);
      setCategory(categoryData);
      setDescription(categoryData.description);
      setIcon(categoryData.icon);
      setName(categoryData.name);
      setBackground(categoryData.background);
    };

    fetchCategoryData();
  }, [cat]);

  const handleIconChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Event handler for background file input change
  const handleBackgroundChange = (e) => {
    setBackgroundFile(e.target.files[0]);
  };

  // Event handler for description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const updateCategoryDetails = async () => {
    let iconUrl = icon;
    let backgroundUrl = background;
    let catname = name;

    if (iconFile) {
      iconUrl = await uploadImage(iconFile, 'category-icons');
    }

    if (backgroundFile) {
      backgroundUrl = await uploadImage(backgroundFile, 'category-backgrounds');
    }

    await updateCategory(cat, {
      description,
      name: catname,
      icon: iconUrl,
      background: backgroundUrl,
    });

    toast.success('Category details edited !');
  };

  return (
    <Container>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          p: (theme) => theme.spacing(0, 1, 0, 3),
        }}
      >
        <Typography variant="h4" sx={{ mb: 5 }} style={{ paddingTop: 40 }}>
          {name}
        </Typography>

        <AddNewProductModal open={openAddNewModal} setOpen={setOpenAddNewModal} />
      </Toolbar>

      {/* <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack> */}

      <Grid direction="column">
        <FormGroup>
          <FormControl>
            <TextField label="Name" value={name} onChange={handleNameChange} />
            <Input type="text" onChange={handleIconChange} accept="image/*" color="primary" />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <FormLabel>Icon</FormLabel>
            {icon && <img src={icon} width="200" />}
            <Input type="file" onChange={handleIconChange} accept="image/*" color="primary" />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Background</FormLabel>
            {background && <img src={background} width="200" />}
            <Input
              type="file"
              onChange={handleBackgroundChange}
              accept="image/*"
              color="secondary"
            />
          </FormControl>
          <br />
          <TextField
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          />
          <Button
            onClick={updateCategoryDetails}
            color="success"
            variant="contained"
            sx={{ mt: 1 }}
          >
            Save Changes
          </Button>
        </FormGroup>
      </Grid>

      <Grid direction="row" sx={{ mb: 3, mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }} style={{ paddingTop: 40, display: 'inline' }}>
          Products
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenAddNewModal(true)}
          style={{ marginLeft: 20, display: 'inline' }}
        >
          Add New
        </Button>
      </Grid>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard
              product={product}
              handleEdit={() => {
                setOpenEdition(true);
                setProductOnEdition(product);
              }}
            />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
      <UpdateProductModal open={openEdition} setOpen={setOpenEdition} product={productOnEdition} />
    </Container>
  );
}
