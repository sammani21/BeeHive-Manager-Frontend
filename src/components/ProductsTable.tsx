import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import { styled } from "@mui/material/styles";

// Styled TableCell component for header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#BDBDBD",
  color: theme.palette.common.black,
  fontWeight: '700',
  fontSize: '0.875rem',
  height: '40px',
  textTransform: 'capitalize',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Define the interface for column configuration
interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

// Define the columns for the table
const columns: readonly Column[] = [
  { id: 'productId', label: 'Product ID', minWidth: 170 },
  { id: 'hiveId', label: 'Hive ID', minWidth: 170 },
  { id: 'type', label: 'Type', minWidth: 170 },
  { id: 'quantity', label: 'Quantity', minWidth: 170 },
  { id: 'quality', label: 'Quality', minWidth: 170 },
  { id: 'createdAt', label: 'Created Date', minWidth: 170 },
  { id: 'updatedAt', label: 'Updated Date', minWidth: 170 },
];

// Define the data interface for table rows
interface Data {
  productId: string;
  hiveId: string;
  type: string;
  quantity: number;
  quality: string;
  createdAt: string;
  updatedAt: string;
}

// Define the props interface for the ProductsTable component
interface ProductsTableProps {
  tableRef: React.RefObject<HTMLTableElement>;
  startDate: Date | null;
  endDate: Date | null;
}

// Define the ProductsTable component
const ProductsTable: React.FC<ProductsTableProps> = ({ tableRef, startDate, endDate }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState<Data[]>([]);

  // Fetch product data from the server
  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/api/v1/product")
      .then((response) => setProducts(response.data.data))
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  };

  useEffect(() => {
    fetchProducts();

    // Fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    // Cleanup interval to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  // Filter rows based on the selected date range
  const filteredRows = products.filter((row) => {
    const createdDate = dayjs(row.createdAt); // Convert to Dayjs object for comparison
    return (
      (!startDate || createdDate >= dayjs(startDate)) &&
      (!endDate || createdDate <= dayjs(endDate))
    );
  });

  // Event handler for changing the page
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Event handler for changing the number of rows per page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      date: date.format('YYYY-MM-DD'),
      time: date.format('HH:mm:ss'),
    };
  };

  // Render the ProductsTable component
  return (
    <Paper sx={{ maxWidth: '100%', maxHeight: '100%' }}>
      <TableContainer sx={{ maxHeight: '100%', maxWidth: '100%' }}>
        <Table stickyHeader aria-label="sticky table" ref={tableRef}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{row.productId}</TableCell>
                  <TableCell>{row.hiveId}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.quality}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(row.createdAt).date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(row.updatedAt).date}</Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductsTable;