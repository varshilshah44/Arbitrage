import React, {useState, useEffect} from 'react';
import { toast } from "react-toastify";
import { Box,Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import AxiosInstance from '../helpers/AxiosRequest';

function History() {
    const [histories, setHistories] = useState([])

    const getHistoryData = async () => {
        try {
            const response = await AxiosInstance.get('/user/getHistories')
            if (response?.data?.statusCode === 200) {
                setHistories(response?.data?.data)
            } else {
                toast.error(response?.response?.data?.message || 'Fetching history failed')
            }
        } catch (err) {
            toast.error(err?.message || 'Something went wrong')
        }
    }

    useEffect(() => { 
        getHistoryData();
    }, []);

    console.log("histories", histories)
    return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          width: '80%', // Adjust the width value as needed
          margin: '0 auto', // Centers the box horizontally on the page
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        History Table
        </Typography>
        <TableContainer sx={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell align="center">Order Id</TableCell>
                <TableCell align="center">Make</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell align="center">Traded Amount</TableCell>
                <TableCell align="center">Profit/Loss Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {histories.map((history) => (
                    <TableRow>
                    <TableCell align="center">{history?.orderId?._id || '-'}</TableCell>
                    <TableCell align="center">{history?.make || '-'}</TableCell>
                    <TableCell align="center">{history?.percentage || '-'}</TableCell>
                    <TableCell align="center">{history?.orderId?.amount || '-'}</TableCell>
                    <TableCell align="center">{history?.amount || '-'}</TableCell>
                    <TableCell align="center">{history?.status || 'pending'}</TableCell>
                </TableRow>
                ))}
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </TableContainer>
       </Box>
      );
}
export default History