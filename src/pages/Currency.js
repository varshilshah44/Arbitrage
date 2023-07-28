import { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CommonTable from "../Common/Table";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socket";

const Currency = () => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const [cryptoName, setCryptoName] = useState([
    { name: 'KAVA', price: '' },
    { name: 'CAKE', price: '' },
    { name: '1INCH', price: '' },
    { name: 'AAVE', price: '' },
    { name: 'MKR', price: '' },
  ]);

  useEffect(() => {
    const cryptoNames = cryptoName && cryptoName.map((crypto) => crypto?.name).join(',');
    if (socket) {
      socket.emit('getCryptoData', cryptoNames);
      socket.on("UpdatedCurrencyPrice", async (data) => {
        if (data) {
          const updatedData = cryptoName.map((item) => {
            const currency = item.name.toLowerCase();
            return { ...item, price: `${data?.[currency]?.usd}` };
          });
          setCryptoName(updatedData);
          await new Promise((r) => setTimeout(r, 2000));
          const cryptoNames = updatedData && updatedData.map(({ name }) => name).join(',');
          socket.emit('getCryptoData', cryptoNames);
        }
      });
    }
  },[socket]);

  const handleNaviagte = (currencyName) => {
    navigate(`/home/${currencyName}`);
  }

  return (
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
        <CommonTable rows={cryptoName} handleNaviagte={handleNaviagte} currencySymbol={"/USDT"}/>
      </Box>
    </>
  )
}

export default Currency;