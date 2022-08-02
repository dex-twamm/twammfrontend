import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Swap from './components/Swap';
import LongTermSwap from './components/LongTermSwap';
import AddLiquidity from './components/AddLiquidity';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" 
          element={
            <Swap/>
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
