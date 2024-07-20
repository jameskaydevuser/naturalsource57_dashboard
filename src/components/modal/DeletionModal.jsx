import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteDocByRef } from 'src/firebase/users';

export default function DeletionModal({ docRef, docTitle, open, setOpen }) {
  const [working, setWorking] = useState(false);

  const handleDelete = async () => {
    setWorking(true);
    try {
      await deleteDocByRef(docRef);

      setOpen(false);
      toast.success(`${docTitle} record deleted successfully.`);
    } catch (ex) {
      toast.error(ex.message);
    }

    setWorking(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle color="error">Delete Record</DialogTitle>
      <DialogContent>
        <p>Are you sure want to delete this record?</p>
        <p>
          <b>{docTitle}</b>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button disabled={working} color="error" variant="contained" onClick={handleDelete}>
          {working ? <CircularProgress size={22} color="error" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
