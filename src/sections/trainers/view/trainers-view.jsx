import { useContext, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../../../components/table/table-no-data';
import TableEmptyRows from '../../../components/table/table-empty-rows';
import UserTableToolbar from '../../../components/table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { UsersContext } from 'src/contexts/Users';
import TrainerTableRow from 'src/components/table/trainer-table-row';
import { TrainersContext } from 'src/contexts/Trainers';
import { CircularProgress } from '@mui/material';
import UserTableHead from 'src/components/table/user-table-head';
import { SubscriptionsContext } from 'src/contexts/Subscriptions';
import DeletionModal from 'src/components/modal/DeletionModal';
import UpdateTrainerModal from 'src/components/modal/UpdateTrainerModal';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();

  const [openEdition, setOpenEdition] = useState(false);
  const [trainerOnEdition, setTrainerOnEdition] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { users } = useContext(UsersContext);
  const { trainers, loading } = useContext(TrainersContext);
  const { subscriptions } = useContext(SubscriptionsContext);

  const filteredUsers = users.filter((user) => user.user_type === 'trainer');

  for (let i = 0; i < trainers.length; i++) {
    const trainer = trainers[i];
    const index = filteredUsers.findIndex((user) => user.uid === trainer?.ref.id.toString());
    if (index >= 0) {
      trainers[i] = { ...filteredUsers[index], ...trainer };
    }
  }

  for (let i = 0; i < trainers.length; i++) {
    const trainer = trainers[i];
    const index = subscriptions.findIndex(
      (sub) => sub.ref.id.toString() === trainer?.subscriptionPlanRef?.id.toString()
    );
    if (index >= 0) {
      trainers[i] = { ...subscriptions[index], ...trainer };
    }
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: trainers,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Trainers</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Trainers...</p>
        </>
      ) : (
        <Card>
          <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={filteredUsers.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'display_name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'planType', label: 'Plan type' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((trainer) => {
                      return (
                        <TrainerTableRow
                          key={trainer?.uid}
                          trainer={trainer}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(trainer?.display_name || 'Deleted User');
                            setDeletionRef(trainer?.ref);
                          }}
                          handleEdit={() => {
                            setTrainerOnEdition(trainer);
                            setOpenEdition(true);
                          }}
                        />
                      );
                    })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, filteredUsers.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
      <DeletionModal
        open={openDeletion}
        setOpen={setOpenDeletion}
        docTitle={deletionTitle}
        docRef={deletionRef}
      />
      <UpdateTrainerModal open={openEdition} trainer={trainerOnEdition} setOpen={setOpenEdition} />
    </Container>
  );
}
