import { Box, Typography } from "@mui/material";
import CommonTable from "../Common/Table";
import { useNavigate } from "react-router-dom";

const Currency = () => {
  const navigate = useNavigate();
  const rows = [
    { id: '1', name: 'INR', price: '30'},
    { id: '2', name: 'USD', price: '$2'},
  ];

  const handleNaviagte = () => {
    navigate('/home');
  }

  return(
    <>
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
      <Typography variant="h5" className="typography" sx={{ marginBottom: '20px' }}>
        Currency Table
      </Typography>
      <CommonTable rows={rows} handleNaviagte={handleNaviagte}/>
    </Box>
    </>
  )
}

export default Currency;