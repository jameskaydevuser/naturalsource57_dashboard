import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { palette, spacing } from '@mui/system';
import styled from 'styled-components';
import { planTypesList } from 'src/config/planTypes';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';
import { updatePlanTypeOfSubscription } from 'src/firebase/subscriptions';

const Form = styled.form`
  ${palette}
  ${spacing}
  display: flex;
  padding: 24px;
  gap: 20px;
  flex-wrap: wrap;

  & > * {
    width: 100%;
  }

  & > .row {
    display: flex;
    justify-content: space-between;
  }
`;

export default function UpdateSubscriptionModal({ subscription, open, setOpen }) {
  const [working, setWorking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      const formData = new FormData(e.target); // Access the form data
      await updatePlanTypeOfSubscription(subscription.ref, formData.get('planType'));
      setOpen(false);
      toast.success(`${subscription.display_name} record updated successfully.`);
    } catch (ex) {
      toast.error(ex.message);
    }

    setWorking(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Subscription Record</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit}>
          <TextField
            type="text"
            defaultValue={subscription?.display_name}
            label="Full Name"
            name="fullName"
            inputProps={{ readOnly: true }}
          />
          <TextField
            type="text"
            defaultValue={subscription?.email}
            label="Email"
            name="email"
            inputProps={{ readOnly: true }}
          />

          <FormControl>
            <InputLabel id="plan-type">Plan type</InputLabel>
            <Select
              labelId="plan-type"
              name="planType"
              label="Plan type"
              defaultValue={subscription?.moreInfo?.type}
            >
              {planTypesList.map((item) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField']}>
                <DateField
                  name="startDate"
                  readOnly
                  label="Start Date"
                  defaultValue={dayjs(subscription?.startDate?.toDate())}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField']}>
                <DateField
                  name="endDate"
                  readOnly
                  label="End Date"
                  defaultValue={dayjs(subscription?.endDate?.toDate())}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <Button
            sx={{ mt: 1 }}
            style={{ width: '100%' }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={working}
          >
            {working ? <CircularProgress color="info" size={22} /> : 'Save'}
          </Button>
        </Form>
      </DialogContent>
      <Button
        style={{ position: 'absolute', right: 20, top: 20, padding: '0' }}
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(false)}
      >
        X
      </Button>
    </Dialog>
  );
}
