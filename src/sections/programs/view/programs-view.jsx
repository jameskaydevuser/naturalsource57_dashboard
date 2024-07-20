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
import { emptyRows, applyFilterExercise, getComparator } from '../utils';
import { CircularProgress } from '@mui/material';
import DeletionModal from 'src/components/modal/DeletionModal';
import { ProgramsContext } from 'src/contexts/Programs';
import ProgramTableToolbar from 'src/components/table/programs-table-toolbar';
import ProgramTableRow from 'src/components/table/program-table-row';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ProgramsPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { programs, loading } = useContext(ProgramsContext);

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

  const dataFiltered = applyFilterExercise({
    inputData: programs,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Programs</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Programs...</p>
        </>
      ) : (
        <Card>
          <ProgramTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={programs.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'name', label: 'Title' },
                    { id: 'price', label: 'Price' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((program) => {
                      return (
                        <ProgramTableRow
                          key={program.name}
                          program={program}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(program.name);
                            setDeletionRef(program.ref);
                          }}
                          handleEdit={() => navigate(`/program-form/${program.ref.id}`)}
                        />
                      );
                    })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, programs.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={programs.length}
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
    </Container>
  );
}
