import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';
import { Button, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';
import { deleteDocByRef } from 'src/firebase/product';

// import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product, handleEdit }) {
  // const renderStatus = (
  //   <Label
  //     variant="filled"
  //     color={(product.status === 'sale' && 'error') || 'info'}
  //     sx={{
  //       zIndex: 9,
  //       top: 16,
  //       right: 16,
  //       position: 'absolute',
  //       textTransform: 'uppercase',
  //     }}
  //   >
  //     {product.status}
  //   </Label>
  // );

  const renderImg = (
    <Box
      component="img"
      alt={product?.information?.name}
      src={product?.information?.imageUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {/* <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.priceSale && fCurrency(product.priceSale)}
      </Typography>
      &nbsp; */}
      {fCurrency(product.price.price)}
    </Typography>
  );

  const buttonStyle = {
    display: 'inline-block',
    paddingRight: 8,
    paddingLeft: 8,
    minHeight: 0,
    minWidth: 0,
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {product.status && renderStatus} */}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography color="inherit" fontSize={20} underline="hover" variant="subtitle2" noWrap>
          {product?.information?.name}
        </Typography>

        <text style={{color: '#0B6623', margin: 0, fontWeight: 700, fontSize: 14}}>
        {product?.information?.category} ({product?.quantity})
        </text>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={product.colors} /> */}
          {renderPrice}
          <Grid>
          <Button onClick={handleEdit} style={buttonStyle}>
            <Iconify icon="solar:pen-bold" color="#0B6623" />
          </Button>

          <Button onClick={() => deleteDocByRef(product.ref)} style={buttonStyle}>
            <BinIcon />
          </Button>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

const BinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
    <path
      fill="#FF0000"
      d="M301-110q-49.7 0-83.85-34.15Q183-178.3 183-228v-457h-71v-118h249v-71h236v71h251v118h-71v456.566Q777-178 742.85-144T659-110H301Zm358-575H301v457h358v-457ZM366-289h95v-336h-95v336Zm133 0h95v-336h-95v336ZM301-685v457-457Z"
    />
  </svg>
);
