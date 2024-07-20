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
import UserTableRow from '../../../components/table/user-table-row';
import UserTableHead from '../../../components/table/user-table-head';
import TableEmptyRows from '../../../components/table/table-empty-rows';
import UserTableToolbar from '../../../components/table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { UsersContext } from 'src/contexts/Users';
import { CircularProgress } from '@mui/material';
import DeletionModal from 'src/components/modal/DeletionModal';
import UpdateUserModal from 'src/components/modal/UpdateUserModal';
 
// ----------------------------------------------------------------------

export default function UserPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();

  const [openEdition, setOpenEdition] = useState(false);
  const [userOnEdition, setUserOnEdition] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { users, loading } = useContext(UsersContext);

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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Users...</p>
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
                    { id: 'display_name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'status', label: 'Status' },
                    // { id: 'job_title', label: 'Job Title' },
                    // { id: 'is_contactable', label: 'Contactable' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => {
                      console.log('PPPPPPPPPPPPPPPPP');
                      console.log(user);
                      console.log('PPPPPPPPPPPPPPPPP');
                      return (
                        <UserTableRow
                          key={user.uid}
                          displayName={user.display_name}
                          role={user.job_title}
                          uid={user.ref.id}
                          isApproved={user.isApproved}
                          email={user.email}
                          avatarUrl={user.profile_img}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(user.display_name);
                            setDeletionRef(user.ref);
                          }}
                          handleEdit={() => {
                            setOpenEdition(true);
                            setUserOnEdition(user);
                          }}
                          is_contactable={user.is_contactable}
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

          {/* <TablePagination
            page={page}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
      )}

      {/* <DeletionModal
        open={openDeletion}
        setOpen={setOpenDeletion}
        docTitle={deletionTitle}
        docRef={deletionRef}
      /> */}
      {/* <UpdateUserModal open={openEdition} setOpen={setOpenEdition} user={userOnEdition} /> */}
    </Container>
  );
}
