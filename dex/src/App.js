import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortSwap from "./pages/ShortSwap";
import LongSwap from "./pages/LongSwap";
import AddLiquidity from "./components/AddLiquidity";
import "./App.css";
import { web3Modal } from "./connectors/ProviderOptions";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

function App() {
  const initialText = "Connect Wallet";
  const [provider, setProvider] = useState();
  const [web3Provider, setWeb3Provider] = useState();
  const [account, setAccount] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [buttonText, setButtonText] = useState(initialText);
  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const addressWallet = await library.provider.selectedAddress;
      const walletBalance = await library.getBalance(addressWallet);
      const ethBalance = ethers.utils.formatEther(walletBalance);
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      console.log(accounts);
      console.log(library);
      setProvider(provider);
      setWeb3Provider(library);
      if (accounts) {
        setAccount(accounts[0]);
      }
      setEthBalance(humanFriendlyBalance);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    setEthBalance("");
    setAccount("");
    await web3Modal.clearCachedProvider();
  };

  const handleButtonClick = async () => {
    if (!web3Provider) {
      await connectWallet().finally(() => setButtonText("Disconnect"));
    } else {
      await disconnect();
    }
  };

  const data = {
    token: {
      name: "Ethereum",
      symbol: "ETH",
      image: "/ethereum.png",
    },
    wallet: {
      address:
        account == null ? (
          <p>Wallet Address</p>
        ) : (
          <>
            <p>{web3Provider.provider.selectedAddress}</p>
          </>
        ),
      balance:
        account == null ? (
          <p>Wallet balance</p>
        ) : (
          <>
            <p>{ethBalance}</p>
          </>
        ),
    },
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);
  return (
    <div className="App">
      <Navbar
        tokenName={data.token.name}
        tokenImage={data.token.image}
        walletBalance={data.wallet.balance}
        walletAddress={data.wallet.address}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ShortSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
              connectWallet={handleButtonClick}
              buttonText={buttonText}
            />
          }
        />

        <Route
          path="/longterm"
          element={
            <LongSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
            />
          }
        />

        <Route path="/liquidity" element={<AddLiquidity />} />
      </Routes>
    </div>
  );
}

export default App;
