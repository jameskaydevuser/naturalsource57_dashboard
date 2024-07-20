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
import { emptyRows, applyFilterExercise, getComparator } from '../utils';
import { ExercisesContext } from 'src/contexts/Exercises';
import { CircularProgress } from '@mui/material';
import DeletionModal from 'src/components/modal/DeletionModal';
import ExerciseTableRow from 'src/components/table/exercise-table-row';
import UpdateExerciseModal from 'src/components/modal/UpdateExerciseModal';
import ExerciseTableToolbar from 'src/components/table/exercise-table-toolbar';

// ----------------------------------------------------------------------

export default function ExercisesPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();

  const [openEdition, setOpenEdition] = useState(false);
  const [exerciseOnEdition, setExerciseOnEdition] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { exercises, loading } = useContext(ExercisesContext);

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
    inputData: exercises,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Exercises</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Exercises...</p>
        </>
      ) : (
        <Card>
          {/* <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
          <ExerciseTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={exercises.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'name', label: 'Title' },
                    { id: 'type', label: 'Type' },
                    { id: 'targetMuscle', label: 'Target muscle' },
                    { id: 'implement', label: 'Implement' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((exercise) => {
                      return (
                        <ExerciseTableRow
                          key={exercise.name}
                          exercise={exercise}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(exercise.name);
                            setDeletionRef(exercise.ref);
                          }}
                          handleEdit={() => {
                            setOpenEdition(true);
                            setExerciseOnEdition(exercise);
                          }}
                        />
                      );
                    })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, exercises.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={exercises.length}
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

      <UpdateExerciseModal
        exercise={exerciseOnEdition}
        open={openEdition}
        setOpen={setOpenEdition}
      />
    </Container>
  );
}
