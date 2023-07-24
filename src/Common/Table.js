import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const CommonTable = ({ rows, handleNaviagte, currencySymbol }) => {
  return(
    <>
      <TableContainer className='table-container' sx={{ marginTop: '20px'}}>
      <Table aria-label="customized table">
        <TableHead className='table-head'>
          <TableRow>
            <TableCell>Currency Name</TableCell>
            <TableCell >Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}{currencySymbol}
              </TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell onClick={() => handleNaviagte(`${row.name}${currencySymbol}`)} className='cursor-pointer'>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3.4V9C10 9.6 10.4 10 11 10C11.6 10 12 9.6 12 9V1C12 0.4 11.6 0 11 0H3C2.4 0 2 0.4 2 1C2 1.6 2.4 2 3 2H8.6L0.3 10.3C-0.0999994 10.7 -0.0999994 11.3 0.3 11.7C0.7 12.1 1.3 12.1 1.7 11.7L10 3.4Z" fill={`rgba(0, 0, 0, 0.87)`}/>
                </svg>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default CommonTable;