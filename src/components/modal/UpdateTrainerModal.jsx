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
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { palette, spacing } from '@mui/system';
import styled from 'styled-components';
import { capitalizeSentence } from 'src/utils/capitalizeSentence';
import { getClientsOfTrainer } from 'src/firebase/users';
import { updateTrainerCertificates } from 'src/firebase/trainers';

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
`;

const CertificatesContainer = styled.div`
  & > .certificates {
    padding-top: 8px;

    & > .certificate {
      display: flex;
      height: 45px;
      border: 1px solid #e1e1e1;
      border-radius: 8px;
      align-items: center;
      padding: 0 8px;
      margin-top: 8px;

      & > .link {
        margin-left: 24px;
      }

      & > .actions {
        margin-left: auto;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          background-color: #e1e1e1;
        }

        & img {
          width: 22px;
          margin-left: auto;
        }
      }
    }
  }
`;

const ClientsContainer = styled.div`
  min-height: 150px;

  & > .row {
    display: flex;
    justify-content: space-between;
  }

  & > .clients {
    padding-top: 8px;

    & > .client {
      display: flex;
      height: 45px;
      border: 1px solid #e1e1e1;
      border-radius: 8px;
      align-items: center;
      padding: 0 8px;
      margin-top: 8px;

      & > * {
        width: 50%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;

export default function UpdateTrainerModal({ trainer, open, setOpen }) {
  const [working, setWorking] = useState(false);
  const [certificates, setCertificates] = useState(trainer?.certificates || []);

  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setCertificates(trainer?.certificates);

    const fetchClients = async () => {
      setLoadingClients(true);

      try {
        const fetchedClients = await getClientsOfTrainer(trainer?.ref);

        setClients(fetchedClients);
      } catch (ex) {
        console.log(ex);
        toast.error('Error in fetching clients: ', ex.message);
      }

      setLoadingClients(false);
    };

    if (trainer?.ref) {
      fetchClients();
    }
  }, [trainer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      await updateTrainerCertificates(trainer.ref, certificates);

      setOpen(false);
      toast.success(`${trainer.display_name} record updated successfully.`);
    } catch (ex) {
      toast.error(ex.message);
    }

    setWorking(false);
  };

  const handleDeleteCertificate = (item) => {
    const newCertificates = certificates.filter((c) => c !== item);
    setCertificates(newCertificates);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Trainer Record</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit}>
          <TextField
            type="text"
            defaultValue={trainer?.display_name}
            label="Full Name"
            name="fullName"
            inputProps={{ readOnly: true }}
          />
          <TextField
            type="text"
            defaultValue={trainer?.moreInfo?.type}
            label="Plan Type"
            name="planType"
            inputProps={{ readOnly: true, style: { textTransform: 'capitalize' } }}
          />
          <TextField
            type="text"
            defaultValue={trainer?.email}
            label="Email"
            name="email"
            inputProps={{ readOnly: true }}
          />

          <CertificatesContainer>
            <Typography variant="h6" mb={-2}>
              Certificates:
            </Typography>

            <div className="certificates">
              {certificates?.length ? (
                certificates.map((item) => (
                  <div key={item.title} className="certificate">
                    <span className="title">
                      <span style={{ color: '#aaa' }}>Title: &nbsp;</span>
                      {capitalizeSentence(item.title)}
                    </span>
                    <span className="link">
                      <a href={item.filePath} target="blank">
                        Certificate File
                      </a>
                    </span>
                    <span className="actions" onClick={() => handleDeleteCertificate(item)}>
                      <img src="./assets/icons/icon-delete.svg" alt="" />
                    </span>
                  </div>
                ))
              ) : (
                <Typography variant="body1" mt={2}>
                  There is no uploaded certificate
                </Typography>
              )}
            </div>
          </CertificatesContainer>

          <ClientsContainer>
            {loadingClients ? (
              <CircularProgress />
            ) : (
              <>
                <div className="row">
                  <Typography variant="h6">Clients:</Typography>
                  <Typography variant="h6">
                    {clients.length} / {trainer?.moreInfo?.capacity}
                  </Typography>
                </div>

                <div className="clients">
                  {clients.map((item) => (
                    <div key={item.uid} className="client">
                      <span className="name">
                        <span style={{ color: '#aaa' }}>Name: &nbsp;</span>
                        {item.display_name}
                      </span>
                      <span className="email" title={item.email}>
                        <span style={{ color: '#aaa' }}>Email: &nbsp;</span>
                        {item.email}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ClientsContainer>

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
