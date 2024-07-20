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
import UserTableHead from '../../../components/table/user-table-head';
import TableEmptyRows from '../../../components/table/table-empty-rows';
import UserTableToolbar from '../../../components/table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { UsersContext } from 'src/contexts/Users';
import { SubscriptionsContext } from 'src/contexts/Subscriptions';
import SubscriptionTableRow from 'src/components/table/subscription-table-row';
import DeletionModal from 'src/components/modal/DeletionModal';
import UpdateSubscriptionModal from 'src/components/modal/UpdateSubscriptionModal';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();

  const [subscriptionOnEdit, setSubscriptionOnEdit] = useState();
  const [openEdition, setOpenEdition] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { users } = useContext(UsersContext);

  const { subscriptions, loading } = useContext(SubscriptionsContext);

  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const index = users.findIndex((user) => user.uid === subscription?.userRef?.id.toString());
    if (index >= 0) {
      subscriptions[i] = { ...users[index], ...subscription };
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
    inputData: subscriptions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Subscriptions</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Subscriptions...</p>
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
                  rowCount={users.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'planType', label: 'Plan type' },
                    { id: 'clientType', label: 'Client type' },
                    { id: 'display_name', label: 'Client name' },
                    { id: 'startDate', label: 'Start date' },
                    { id: 'endDate', label: 'End date' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((subscriptionRow) => {
                      console.log('Subscription Row: ', subscriptionRow);
                      return (
                        <SubscriptionTableRow
                          key={subscriptionRow.uid + subscriptionRow.startDate}
                          subscription={subscriptionRow}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(subscriptionRow.display_name || 'Deleted User');
                            setDeletionRef(subscriptionRow.ref);
                          }}
                          handleEdit={() => {
                            setSubscriptionOnEdit(subscriptionRow);
                            setOpenEdition(true);
                          }}
                        />
                      );
                    })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={subscriptions.length}
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

      <UpdateSubscriptionModal
        subscription={subscriptionOnEdit}
        open={openEdition}
        setOpen={setOpenEdition}
      />
    </Container>
  );
}
