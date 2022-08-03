import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Swap from './components/Swap';
import LongTermSwap from './components/LongTermSwap';
import AddLiquidity from './components/AddLiquidity';

function App() {
  const data = {
    token:{
      name: 'Ethereum',
      symbol:'ETH',
      image : '/ethereum.png',
    },
    wallet:{
      balance:'.69 rETH',
      address:'0x51bc...xc'
    }
  }
  return (
    <div className="App">
      <Navbar 
        tokenName={data.token.name}
        tokenImage={data.token.image}
        walletBalance={data.wallet.balance}
        walletAddress={data.wallet.address}
      />
      <Routes>
        <Route path="/" 
          element={
            <Swap 
            tokenSymbol={data.token.symbol}
            tokenImage={data.token.image}
            />
          }
        /> 

        <Route path="/longterm" 
          element={
            <LongTermSwap/>
          }
        /> 

        <Route path="/liquidity" 
          element={
            <AddLiquidity/>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
