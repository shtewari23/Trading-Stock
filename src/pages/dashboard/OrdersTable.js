import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import Dot from 'components/@extended/Dot';

function createData(trackingNo, name, fat, carbs, protein) {
  return { trackingNo, name, fat, carbs, protein };
}

const rows = [
  createData(84564564, 'Reliance', 40, 2, 40570),
  createData(98764564, 'Bajaj-Auto', 300, 0, 180139),
  createData(98756325, 'Maruti', 355, 1, 90989),
  createData(98652366, 'NTPC Ltd', 50, 1, 10239),
  createData(13286564, 'Maruti', 100, 1, 83348),
  createData(86739658, 'Reliance', 99, 0, 410780),
  createData(13256498, 'Asian Paints Ltd', 125, 2, 70999),
  createData(98753263, 'HDFC Banks Ltd', 89, 2, 10570),
  createData(98753275, 'Maruti', 185, 1, 98063),
  createData(98753291, 'Axis Bank Ltd', 100, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'trackingNo', align: 'left', disablePadding: false, label: 'Tracking No.' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Stocks' },
  { id: 'fat', align: 'right', disablePadding: false, label: 'Total Order' },
  { id: 'carbs', align: 'left', disablePadding: false, label: 'Status' },
  { id: 'protein', align: 'right', disablePadding: false, label: 'Total Amount' },
  { id: 'actions', align: 'right', disablePadding: false, label: 'Actions' }
];

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedTotalOrder, setEditedTotalOrder] = useState('');
  const [editedTotalAmount, setEditedTotalAmount] = useState('');

  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    setOpenEditDialog(true);
    setEditedTotalOrder(row.fat.toString());
    setEditedTotalAmount(row.protein.toString());
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenModifyDialog = (row) => {
    setSelectedRow(row);
    setOpenModifyDialog(true);
    setEditedTotalOrder(row.fat.toString());
    setEditedTotalAmount(row.protein.toString());
  };

  const handleCloseModifyDialog = () => {
    setOpenModifyDialog(false);
  };

  const handleUpdateEditDialog = () => {
    // Perform update action
    handleCloseEditDialog();
  };

  const handleUpdateModifyDialog = () => {
    // Perform update action
    handleCloseModifyDialog();
  };

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.trackingNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.trackingNo}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.trackingNo}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                  <TableCell align="right">
                    {row.carbs === 2 && (
                      <Button variant="contained" sx={{ backgroundColor: 'error.main', color: 'white' }} onClick={() => handleOpenEditDialog(row)}>Edit</Button>
                    )}
                    {row.carbs === 0 && (
                      <Button variant="contained" sx={{ backgroundColor: 'warning.main', color: 'white' }} onClick={() => handleOpenModifyDialog(row)}>Modify</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Stock Information</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          {selectedRow && (
            <>
              <TextField
                margin="normal"
                label="Total Order"
                value={editedTotalOrder}
                onChange={(e) => setEditedTotalOrder(e.target.value)}
                fullWidth
              />
              <TextField
                margin="normal"
                label="Total Amount"
                value={editedTotalAmount}
                onChange={(e) => setEditedTotalAmount(e.target.value)}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateEditDialog} color="primary">Place Order</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModifyDialog} onClose={handleCloseModifyDialog}>
        <DialogTitle>Modify Stock Information</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          {selectedRow && (
            <>
              <DialogContentText>Modify the stock information below:</DialogContentText>
              <TextField
                margin="normal"
                label="Total Order"
                value={editedTotalOrder}
                onChange={(e) => setEditedTotalOrder(e.target.value)}
                fullWidth
              />
              <TextField
                margin="normal"
                label="Total Amount"
                value={editedTotalAmount}
                onChange={(e) => setEditedTotalAmount(e.target.value)}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModifyDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateModifyDialog} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
