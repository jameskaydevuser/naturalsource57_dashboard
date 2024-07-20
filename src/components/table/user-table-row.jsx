import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import Popover from '@mui/material/Popover';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';

import { updateUserSignupStatus } from 'src/firebase/users';
import { Chip, Grid } from '@mui/material';

// ----------------------------------------------------------------------

const roleColor = (role) => {
  return 'primary';
};

export default function UserTableRow({
  displayName,
  avatarUrl,
  email,
  uid,
  isApproved,
  role,
  is_contactable,
  handleDelete,
  handleEdit,
  refreshUsers,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const approveUser = async () => {
    await updateUserSignupStatus(uid, true);
    window.location.reload();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} ml={2}>
            <Avatar alt={displayName} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {displayName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>
          {isApproved ? (
            <Chip label="Approved" color="success" />
          ) : (
            <Button variant="outlined" color="primary" onClick={approveUser}>
              Approve
            </Button>
          )}
        </TableCell>

        {/* <TableCell>{role}</TableCell> */}

        {/* <TableCell>
          {' '}
          <Label color={is_contactable ? 'success' : 'error'}>
            {is_contactable ? 'Yes' : 'No'}
          </Label>
        </TableCell> */}

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <Popover
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
      </Popover> */}
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  displayName: PropTypes.any,
  role: PropTypes.any,
  uid: PropTypes.any,
  isApproved: PropTypes.bool,
  refreshUsers: PropTypes.func.isRequired,
};
