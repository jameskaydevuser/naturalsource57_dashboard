import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { clientTypes } from 'src/config/clientType';

// ----------------------------------------------------------------------

const clientTypeMapper = (clientType) => {
  if (clientType === clientTypes.trainer) return 'primary';
  return 'error';
};

export default function SubscriptionTableRow({ subscription, handleDelete, handleEdit }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell ml={2} style={{ fontWeight: 900, textTransform: 'capitalize' }}>
          {subscription?.moreInfo.type}
        </TableCell>

        <TableCell>
          <Label color={clientTypeMapper(subscription?.moreInfo.clientType)}>
            {subscription?.moreInfo.clientType}
          </Label>
        </TableCell>

        <TableCell>{subscription.display_name || 'Deleted User'}</TableCell>
        <TableCell>{fDate(subscription.startDate?.toDate())}</TableCell>

        <TableCell>{fDate(subscription.endDate?.toDate())}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
            handleEdit();
            handleCloseMenu();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete();
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

SubscriptionTableRow.propTypes = {
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  subscription: PropTypes.any,
};
