import React,{useState, useEffect} from 'react';
import { 
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Select,
  Grid,
  Typography
} from '@mui/material';


const Swap = () => {
  const [primary, setPrimary] = useState("Ethereum");
  const [secondary, setSecondary] = useState("");

  const [swapAmount, setSwapAmount] = useState(0); 
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
  const handleSwapAmount = (event) => {
    event.target.value > 0 && setSwapAmount(event.target.value) 
  }
  return (
    <div>
      <TextField sx={{ m: 1, minWidth: 300 }}
        id="outlined-number"
        value={swapAmount}
        label="Enter Amount to Swap"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleSwapAmount}
      />
      <FormControl sx={{ m: 1, minWidth: 300 }}>
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

      <Typography>Connect Your Wallet</Typography>
    </div>
  )
}

export default Swap;
