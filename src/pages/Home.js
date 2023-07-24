import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Checkbox, FormGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from '../helpers/AxiosRequest';

function Home() {
    const navigate = useNavigate();
    const params = useParams();
    const [amount, setAmount] = useState('')
    // const [exchange1, setExchange1] = useState('')
    // const [exchange2, setExchange2] = useState('')
    // const [exchange3, setExchange3] = useState('');
    // const [exchange4, setExchange4] = useState('')
    const [pair, setPair] = useState(`${params.id}/${params.currency}`)
    const [time, setTime] = useState('');
    const [state, setState] = React.useState({
      exchange1: '',
      exchange2: '',
      exchange3: '',
      exchange4: ''
    });

    const handleHistoryClick = (event) => {
      navigate('/history')
    }

    // const handleExchangeChange1 = (event) => {
    //   setExchange1(event.target.value)
    // };

    // const handleExchangeChange2 = (event) => {
    //   setExchange2(event.target.value)
    // };

    // const handleExchangeChange3 = (event) => {
    //   setExchange3(event.target.value)
    // };

    // const handleExchangeChange4 = (event) => {
    //   setExchange4(event.target.value)
    // };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handlePairChange = (event) => {
        setPair(event.target.value);
    };

    const handleChange = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked ? event.target.value : '',
      });
    };

    
    const handleSubmit = async (event) => {
      const { exchange1, exchange2, exchange3, exchange4} = state;
      const selectedCount =  [exchange1, exchange2, exchange3, exchange4].filter((v) => v !== '').length;
      try{
        event.preventDefault();
        const selectedExchanges = Object.values(state).filter((exchange) => exchange !== '');
        const requestObj = {
          amount :amount,
          exchange1 : selectedExchanges && selectedExchanges.length > 0 && selectedExchanges[0],
          exchange2 :  selectedExchanges && selectedExchanges.length > 0 && selectedExchanges[1],
          exchange3 :  selectedExchanges && selectedExchanges.length > 0 && selectedExchanges[2],
          pair: pair,
          time : time
        }
        if(selectedCount > 3 || selectedCount === 2 || selectedCount === 1 || selectedCount === 0){
          toast.error('Please select only 3 exchanges!!!');
        }else{
          const response = await AxiosInstance.post("/user/order", requestObj);
          if(response?.data?.statusCode === 201) {
            toast.success(response?.data?.message)
            setAmount('');
            setState({
              exchange1: '',
              exchange2: '',
              exchange3: '',
              exchange4: ''
            })
            setPair('');
            setTime(''); 
          }
        }
      } catch (err) {
        toast.error(err?.message || 'Something went wrong')
      }
    };
    return (
      <>
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            position: 'relative', 
            width: '80%', 
            margin: '0 auto',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleHistoryClick}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
            History
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
          }}
        >
          <Box
            sx={{
              p: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              width: '40%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                  Arbitrage Form
                 </Typography>
            </Box>
    
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField
                  label="Enter amount to trade"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                  >
                      <FormLabel>Choose Exchanges</FormLabel>
                      <FormGroup  sx={{ flexDirection: 'row' }}>
                        <FormControlLabel
                          control={
                            <Checkbox checked={state.exchange1 !== ''} onChange={handleChange} name="exchange1" value="binance"/>
                          }
                          label="Binance"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox checked={state.exchange2 !== ''} onChange={handleChange} name="exchange2" value="okx"/>
                          }
                          label="Okx"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox checked={state.exchange3 !== ''} onChange={handleChange} name="exchange3" value="kucoin"/>
                          }
                          label="Kucoin"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox checked={state.exchange4 !== ''} onChange={handleChange} name="exchange4" value="bybit"/>
                          }
                          label="Bybit"
                        />
                      </FormGroup>
                  </FormControl>
                </Box>

              {/* <Box>
                <TextField
                    label="Exchange 1"
                    select
                    value={exchange1}
                    onChange={handleExchangeChange1}
                    required
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem disabled={exchange2==="binance" || exchange3==="binance"} value="binance">Binance</MenuItem>
                    <MenuItem disabled={exchange2==="okx" || exchange3==="okx"} value="okx">Okx</MenuItem>
                    <MenuItem disabled={exchange2==="kucoin" || exchange3==="kucoin"} value="kucoin">Kucoin</MenuItem>
                    <MenuItem disabled={exchange2==="bybit" || exchange3==="bybit"} value="bybit">Bybit</MenuItem>
                </TextField>
              </Box>    

              <Box>
                  <TextField
                    label="Exchange 2"
                    select
                    value={exchange2}
                    onChange={handleExchangeChange2}
                    required
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem disabled={exchange1==="binance" || exchange3==="binance"} value="binance">Binance</MenuItem>
                    <MenuItem disabled={exchange1==="okx" || exchange3==="okx"} value="okx">Okx</MenuItem>
                    <MenuItem disabled={exchange1==="kucoin" || exchange3==="kucoin"} value="kucoin">Kucoin</MenuItem>
                    <MenuItem disabled={exchange1==="bybit" || exchange3==="bybit"} value="bybit">Bybit</MenuItem>
              </TextField>
              </Box>    

              <Box>
                  <TextField
                    label="Exchange 3"
                    select
                    value={exchange3}
                    onChange={handleExchangeChange3}
                    required
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem disabled={exchange1==="binance" || exchange2==="binance"} value="binance">Binance</MenuItem>
                    <MenuItem disabled={exchange1==="okx" || exchange2==="okx"} value="okx">Okx</MenuItem>
                    <MenuItem disabled={exchange1==="kucoin" || exchange2==="kucoin"} value="kucoin">Kucoin</MenuItem>
                    <MenuItem disabled={exchange1==="bybit" || exchange2==="bybit"} value="bybit">Bybit</MenuItem>
              </TextField>
              </Box>   */}

              <TextField
                  label="Pair"
                  type="text"
                  value={pair}
                  onChange={handlePairChange}
                  required
                /> 

              {/* <Box>
                  <TextField
                    label="Pair"
                    select
                    value={pair}
                    onChange={handlePairChange}
                    required
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="MKR/USDT">MKR/USDT</MenuItem>
                    <MenuItem value="AAVE/USDT">AAVE/USDT</MenuItem>
                    <MenuItem value="1INCH/USDT">1INCH/USDT</MenuItem>
              </TextField>
              </Box>    */}
    
                <Box>
                  <TextField
                    label="Select time in minutes"
                    type="number"
                    value={time}
                    onChange={handleTimeChange}
                    required
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button variant="contained" type="submit">
                  Submit
                  </Button>
              </Box>
            </form>
          </Box>
        </Box>
        </>
      );
}

export default Home;