import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import { Button, Chip, ClickAwayListener } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { getProductById } from 'src/firebase/product';
import { fetchUser } from 'src/firebase/users';
import { updateOrderStatus } from 'src/firebase/orders';

import { purple } from '@mui/material/colors';

// ----------------------------------------------------------------------

const roleColor = (role) => {
  return 'primary';
};

export default function OrderTableRow({
  orderid,
  // customer_details,
  products,
  status,
  address,
  total,
  shippingFee,
  description,
  handleDelete,
  handleEdit,
  userid,
}) {
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const currentUser = await fetchUser(userid);
        console.log(currentUser)
        setUser(currentUser);
      } catch (e) {
        console.warn('error fetching user email: ' + e);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        {/* <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} ml={2}>
             <Avatar alt={displayName} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {orderid}
            </Typography>
          </Stack>
        </TableCell> */}

        <TableCell>{user?.email || '@'}</TableCell>

        <TableCell>{address}</TableCell>

        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            rowGap={1}
            spacing={1}
            ml={2}
          >
            {products.map((product, index) => (
              <Chip
                key={index}
                avatar={<Avatar alt="Product Image" src={product?.image} />}
                label={`${product?.title} ×${product?.total}`}
                variant="outlined"
              />
            ))}
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            ${total}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            ${shippingFee}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {description || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={status}
            color={(() => {
              switch (status) {
                case 'processing':
                  return 'primary';
                case 'shipped':
                  return 'primary';
                case 'delivered':
                  return 'success';
                default:
                  return 'secondary';
              }
            })()}
          />
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <Popover
          open={!!open}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 140 },
          }}
        >
          <MenuItem
            onClick={() => {
              updateOrderStatus({ orderId: orderuid, status: 'processing' });
            }}
          >
            Mark as Processing
          </MenuItem>

          <MenuItem
            onClick={() => {
              updateOrderStatus({ orderId: orderuid, status: 'shipped' });
            }}
          >
            Mark as Shipped
          </MenuItem>

          <MenuItem
            onClick={() => {
              updateOrderStatus({ orderId: orderuid, status: 'delivered' });
            }}
          >
            Mark as Delivered
          </MenuItem>
        </Popover>
      </TableRow>
    </>
  );
}

OrderTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  displayName: PropTypes.any,
  role: PropTypes.any,
};

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
  </svg>
);
