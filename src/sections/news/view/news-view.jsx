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
import NewsTableToolbar from 'src/components/table/news-table-toolbar';
import { NewsContext } from 'src/contexts/News';
import NewsTableHead from 'src/components/table/news-table-head';
import NewsTableRow from 'src/components/table/news-table-row';

// ----------------------------------------------------------------------

export default function NewsPage() {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [deletionTitle, setDeletionTitle] = useState('');
  const [deletionRef, setDeletionRef] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { news, loading } = useContext(NewsContext);

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
    inputData: news,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  console.log('news', news)
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">News</Typography>
      </Stack>

      {loading ? (
        <>
          <CircularProgress /> <p>Loading Users...</p>
        </>
      ) : (
        <Card>
          <NewsTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <NewsTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={news.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'title', label: 'Title' },
                    { id: 'author', label: 'Author' },
                    { id: 'publish_date', label: 'Publish Date' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((newsRecord) => {
                      return (
                        <NewsTableRow
                          key={newsRecord.publish_date + newsRecord.title}
                          newsRecord={newsRecord}
                          handleDelete={() => {
                            setOpenDeletion(true);
                            setDeletionTitle(newsRecord.title);
                            setDeletionRef(newsRecord.ref);
                          }}
                        />

                      );
                    })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, news.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={news.length}
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
