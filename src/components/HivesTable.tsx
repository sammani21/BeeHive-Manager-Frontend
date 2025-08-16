import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import dayjs from "dayjs";
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

// Define the props interface for the HiveTable component
interface HiveTableProps {
  tableRef: React.RefObject<HTMLTableElement>;
  startDate: Date | null;
  endDate: Date | null;
}

// Define the columns for the table
const columns = [
  { id: "no", label: "Hive ID", minWidth: 170 },
  { id: "type", label: "Owner ID", minWidth: 100 },
  { id: "chassisNo", label: "Location", minWidth: 170 },
  { id: "fuelType", label: "Products", minWidth: 170 },
  { id: "noOfSeats", label: "Population", minWidth: 170 },
  { id: "productionYear", label: "Established Year", minWidth: 170 },
  { id: "acNonAc", label: "Status", minWidth: 170 },
  { id: "availability", label: "Availability", minWidth: 170 },
];

// Define the data interface for table rows
interface Hive {
  _id: string;
  no: string;
  type: string;
  chassisNo: string;
  fuelType: string;
  noOfSeats: number;
  productionYear: number;
  ac: boolean;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the HiveTable component
const HiveTable: React.FC<HiveTableProps> = ({ tableRef, startDate, endDate }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hives, setHives] = useState<Hive[]>([]);

  // Fetch hive data from the server when the component mounts
  useEffect(() => {
    fetchHives();

    // Fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchHives();
    }, 5000);

    // Cleanup interval to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  // Function to fetch hive data from the server
  const fetchHives = () => {
    axios
      .get("http://localhost:3000/api/hives")
      .then((response) => {
        setHives(response.data);
      })
      .catch((err) => {
        console.error("Error fetching hives:", err);
      });
  };

  // Filter rows based on the selected date range
  const filteredRows = hives.filter((row) => {
    const registeredDate = dayjs(row.createdAt);
    return (
      (!startDate || registeredDate >= dayjs(startDate)) &&
      (!endDate || registeredDate <= dayjs(endDate))
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

  // Format the date once during rendering
  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      date: date.format("YYYY-MM-DD"),
      time: date.format("HH:mm:ss"),
    };
  };

  // Render the HiveTable component
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
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
              .map((hive, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{hive.no}</TableCell>
                  <TableCell>{hive.type}</TableCell>
                  <TableCell>{hive.chassisNo}</TableCell>
                  <TableCell>{hive.fuelType}</TableCell>
                  <TableCell>{hive.noOfSeats}</TableCell>
                  <TableCell>{hive.productionYear}</TableCell>
                  <TableCell>{hive.ac ? "Active" : "Inactive"}</TableCell>
                  <TableCell>{hive.availability ? "Yes" : "No"}</TableCell>
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

export default HiveTable;