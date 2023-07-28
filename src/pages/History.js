import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { Box,Typography, Table, TableContainer, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import AxiosInstance from '../helpers/AxiosRequest';

function History() {
    const params = useParams()
    const [histories, setHistories] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [limit,] = useState(10);
    const [type, setType] = useState(`${params.type}`)
    const [totalPage, setTotalPage] = useState(0);
    let [totalHistoryData, setTotalHistoryData] = useState([]) 

    const getHistoryData = async () => {
        try {
            console.log("Type", type)
            const response = type === 'fake' ?
                             await AxiosInstance.get(`/user/getHistories`) : 
                             await AxiosInstance.get('/user/getRealHistories')

            if (response?.data?.statusCode === 200) {
                setTotalHistoryData(response?.data?.data?.result)
                setHistories(response?.data?.data?.result.slice(0, limit))
                setTotalPage(Math.ceil(response?.data?.data?.count / (limit)))  
            } else {
                toast.error(response?.response?.data?.message || 'Fetching history failed')
            }
        } catch (err) {
            toast.error(err?.message || 'Something went wrong')
        }
    }

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        let startIndex = newPage * limit;
        let endIndex = startIndex + limit
        setHistories(totalHistoryData.slice(startIndex, endIndex))
    };

    useEffect(() => { 
        getHistoryData();
    }, []);

    return (
      <>
      {type === 'fake' ? 
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          borderRadius: '4px',
          overflow: 'hidden',
          width: '100%', 
          margin: '0 auto', 
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        History Table
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell align="center">Order Id</TableCell>
                <TableCell align="center">Pair</TableCell>
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
                    <TableCell align="center">{history?.orderId?.pair || '-'}</TableCell>
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

        <TablePagination
        component="div"
        count={totalHistoryData.length}
        page={currentPage}
        rowsPerPage={limit}
        onPageChange={handleChangePage}
      />
       </Box> :
      
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%', 
        margin: '0 auto', 
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
      History Table
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell align="center">Buy Order Id</TableCell>
              <TableCell align="center">Sell Order Id</TableCell>
              <TableCell align="center">Pair</TableCell>
              <TableCell align="center">Make</TableCell>
              <TableCell align="center">Percentage</TableCell>
              <TableCell align="center">Traded Amount</TableCell>
              <TableCell align="center">Profit/Loss Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Buy</TableCell>
              <TableCell align="center">Sell</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
              {histories.map((history) => (
                  <TableRow>
                  <TableCell align="center">{history?.buyOrderId?._id || '-'}</TableCell>
                  <TableCell align="center">{history?.sellOrderId?._id || '-'}</TableCell>
                  <TableCell align="center">{history?.buyOrderId?.pair || '-'}</TableCell>
                  <TableCell align="center">{history?.make || '-'}</TableCell>
                  <TableCell align="center">{history?.percentage || '-'}</TableCell>
                  <TableCell align="center">{history?.buyOrderId?.tradeAmount || '-'}</TableCell>
                  <TableCell align="center">{history?.amount || '-'}</TableCell>
                  <TableCell align="center">{history?.status || 'pending'}</TableCell>
                  <TableCell align="center">{history?.buyOrderId ? 'YES' : 'NO'}</TableCell>
                  <TableCell align="center">{history?.sellOrderId ? 'YES' : 'NO'}</TableCell>
              </TableRow>
              ))}
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
      component="div"
      count={totalHistoryData.length}
      page={currentPage}
      rowsPerPage={limit}
      onPageChange={handleChangePage}
    />
     </Box>
      
      }
     </>
    );
}
export default History