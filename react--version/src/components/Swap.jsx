import React,{useState} from 'react';
import { 
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Select,
  Stack,
  Grid,
  Box,
  Typography
} from '@mui/material';


const Swap = () => {
  const [primary, setPrimary] = useState("Ethereum");
  const [secondary, setSecondary] = useState("");

  const [primarySwapAmount, setPrimarySwapAmount] = useState(0);
  const [secondarySwapAmount, setSecondarySwapAmount] = useState(0); 
  const data = ["Ethereum", "Bitcoin", "DAO"];
  const cryptoList = data.map((crypto)=>{
    return (
      <MenuItem 
      key ={crypto} 
      value={crypto}
      >
      {crypto}
      </MenuItem>
    );
  })

  const handlePrimary = (event) => {
    setPrimary(event.target.value)
  }
  const handleSecondary = (event) => {
    setSecondary(event.target.value)
  }
  const handlePrimarySwapAmount = (event) => {
    event.target.value >= 0 && setPrimarySwapAmount(event.target.value) 
  }
  const handleSecondarySwapAmount = (event) => {
    event.target.value >= 0 && setSecondarySwapAmount(event.target.value) 
  }
  return (
    <Grid>
    <Box
      sx={{
        m:'auto',
        width: 500,
        height: 700,
        display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        alignItems:'center',
      }}
      >
      <Stack direction="row" spacing={5}>
        <TextField sx={{ minWidth: 300 }}
          id="outlined-number"
          value={primarySwapAmount}
          label="Enter Amount to Swap"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handlePrimarySwapAmount}
        />
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="demo-simple-select-helper-label">From</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={primary}
            label="From"
            onChange={handlePrimary}
          >
          {cryptoList}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={5}>
        <TextField sx={{ minWidth: 300 }}
          id="outlined-number"
          value={secondarySwapAmount}
          label="Enter Amount to Swap"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleSecondarySwapAmount}
        />
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="demo-simple-select-helper-label">Select a Token</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={secondary}
            label="Select a Token"
            onChange={handleSecondary}
          >
          {cryptoList}
          </Select>
        </FormControl>
      </Stack>
      <Typography>Connect Your Wallet</Typography>
            
    </Box>
    </Grid>
  )
}

export default Swap;
