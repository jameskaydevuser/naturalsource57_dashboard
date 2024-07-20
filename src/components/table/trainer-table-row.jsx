import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { planAvailableClients } from 'src/config/planInfo';

// ----------------------------------------------------------------------

export default function TrainerTableRow({ trainer, handleDelete, handleEdit }) {
  const [open, setOpen] = useState(null);

  console.log('TrainerRow : ', trainer);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} ml={2}>
            <Avatar alt={trainer?.display_name} src={trainer?.profile_avatar_url} />
            <Typography variant="subtitle2" noWrap>
              {trainer?.display_name || 'Deleted User'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{trainer?.email || 'Deleted User'}</TableCell>

        <TableCell style={{ fontWeight: 900, textTransform: 'capitalize' }}>
          {trainer?.moreInfo?.type}
        </TableCell>

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

TrainerTableRow.propTypes = {
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  trainer: PropTypes.any,
};
