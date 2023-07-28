import React, { useState } from 'react';
import { Typography, Link, TextField, Button, Box, Checkbox, FormGroup, FormControl, FormControlLabel, FormLabel, CircularProgress } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from '../helpers/AxiosRequest';

function Home() {
    const navigate = useNavigate();
    const params = useParams();
    const [amount, setAmount] = useState('')
    const [buyExchange, setBuyExchange] = useState('')
    const [sellExchange, setSellExchange] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isLoading1, setIsLoading1 ] = useState(false)
    const [pair, setPair] = useState(`${params.id}/${params.currency}`)
    const [time, setTime] = useState('');
    const [showRealTrade, setShowRealTrade] = useState(false);
    const [state, setState] = React.useState({
      exchange1: '',
      exchange2: '',
      exchange3: '',
      exchange4: ''
    });

    const handleFakeHistoryClick = (event) => {
      navigate('/history/fake')
    }

    const handleRealHistoryClick = (event) => {
      navigate('/history/real')
    }

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleBuyExchangeChange = (event) => {
      setBuyExchange(event.target.value);
    };

    const handleSellExchangeChange = (event) => {
      setSellExchange(event.target.value);
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

    const handleRealTradeClick = (event) => {
      setShowRealTrade(true)
    }

    const handleBackClick = (event) => {
      setShowRealTrade(false)
    }

    
    const handleSubmit = async (event) => {
      setIsLoading1(true)
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
            setPair(`${params.id}/${params.currency}`);
            setTime(''); 
            setIsLoading1(false)
          } else {
            toast.error(response?.response?.data?.message || 'Order failed')
            setIsLoading1(false)
          }
        }
      } catch (err) {
        toast.error(err?.message || 'Something went wrong')
        setIsLoading1(false)
      }
    };

    const handleRealTradeSubmit = async (event) => {
      try {
        setIsLoading(true)
        event.preventDefault();
        const requestObj = {
          amount: amount, 
          pair: pair,
          symbol: params.id,
          exchangeToBuy: buyExchange.toLowerCase(),
          exchangeToSell: sellExchange.toLowerCase()  
        }

        const response = await AxiosInstance.post("/user/actualOrder", requestObj);
        if(response?.data?.statusCode === 201) {
          toast.success(response?.data?.message)
          setAmount('');
          setPair(`${params.id}/${params.currency}`);
          setBuyExchange('');
          setSellExchange('');
          setIsLoading(false)
        } else {
          toast.error(response?.response?.data?.message || 'Order failed')
          setIsLoading(false)
        }
      } catch (err) {
        toast.error(err?.message || 'Something went wrong')
        setIsLoading(false)
      }
    }

    return (
      <>
      {!showRealTrade ? 
        <Box showRealTrade>
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
            onClick={handleFakeHistoryClick}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
            Fake History
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
                  Fake Arbitrage Bot
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
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: '5px;' }}>
                  <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                  >
                      <FormLabel>Choose Exchanges</FormLabel>
                      <FormGroup  sx={{ flexDirection: 'row', gap: '4rem' }}>
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

              <TextField
                  disabled
                  label="Pair"
                  type="text"
                  value={pair}
                  onChange={handlePairChange}
                  required
                /> 
    
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
                 {!isLoading1 ? 
                  <Button variant="contained" type="submit">
                  Submit
                  </Button> :
                  <CircularProgress color="primary" /> 
                 }         
              </Box>
            </form>
              <Typography sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }} variant="body1">
              Start Real Trading Now&nbsp;
                  <Link onClick={handleRealTradeClick} href="#" target="" rel="noopener">
                    Click here
                  </Link>
              </Typography>
          </Box>
        </Box>
        </Box> : 
        <Box>
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
          onClick={handleRealHistoryClick}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
        >
          Real History
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
                Real Arbitrage Bot
              </Typography>
          </Box>

          <form onSubmit={handleRealTradeSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TextField
                label="Enter amount to trade"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                required
              />
        
            <TextField
                disabled
                label="Pair"
                type="text"
                value={pair}
                onChange={handlePairChange}
                required
              /> 

            <TextField
                label="Enter exchange to buy"
                type="string"
                value={buyExchange}
                onChange={handleBuyExchangeChange}
                required
              />

            <TextField
                label="Enter exchange to sell"
                type="string"
                value={sellExchange}
                onChange={handleSellExchangeChange}
                required
              />    

            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                { !isLoading ? 
                  <Button variant="contained" type="submit">
                  Submit
                  </Button> : 
                  <CircularProgress color="primary" />
                }
                <Button onClick={handleBackClick} sx={{marginLeft: '1rem'}} variant="contained" type="submit">
                Back
                </Button>
            </Box>
          </form>
        </Box>
      </Box>
      </Box>
      }
    </>
      );
}

export default Home;