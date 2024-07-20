import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { Button } from '@mui/material';
import AddNewExerciseModal from '../modal/AddNewExerciseModal';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ExerciseTableToolbar({ filterName, onFilterName }) {
  const [openAddNewModal, setOpenAddNewModal] = useState(false);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Search title..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      <Button variant="outlined" onClick={() => setOpenAddNewModal(true)}>
        Add New
      </Button>
      <AddNewExerciseModal open={openAddNewModal} setOpen={setOpenAddNewModal} />
    </Toolbar>
  );
}

ExerciseTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
