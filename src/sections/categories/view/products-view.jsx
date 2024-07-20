// import { useState } from 'react';

// import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Toolbar } from '@mui/material';
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
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openEdition, setOpenEdition] = useState(false);
  const [productOnEdition, setProductOnEdition] = useState(false);

  const [openAddNewModal, setOpenAddNewModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [openFilter, setOpenFilter] = useState(false);

  // const handleOpenFilter = () => {
  //   setOpenFilter(true);
  // };

  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const prods = await fetchAllProducts();
      console.log(prods);
      setProducts(prods);
      setIsLoading(false);
    }

    fetchProducts();
  }, [])

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
          Products
        </Typography>

        <Button variant="outlined" onClick={() => setOpenAddNewModal(true)} style={{marginLeft: 20}}>
          Add New
        </Button>
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
