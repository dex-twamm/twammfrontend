import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShortSwap from './pages/ShortSwap';
import LongSwap from './pages/LongSwap';
import AddLiquidity from './components/AddLiquidity';
import './App.css';

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
            <ShortSwap
            tokenSymbol={data.token.symbol}
            tokenImage={data.token.image}
            />
          }
        /> 

        <Route path="/longterm" 
          element={
            <LongSwap
            tokenSymbol={data.token.symbol}
            tokenImage={data.token.image}
            />
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
