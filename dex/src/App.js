import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortSwap from "./pages/ShortSwap";
import LongSwap from "./pages/LongSwap";
import AddLiquidity from "./components/AddLiquidity";
import "./App.css";
import { web3Modal } from "./utils/providerOptions";
import { ethers, providers } from "ethers";
import { useState, useContext, useEffect } from "react";
import { getEtherBalance } from "./utils/getAmount";
import { swapTokens } from "./utils/swap";
import { truncateAddress } from "./utils";
import { ShortSwapContext } from "./providers";
import { placeLongTermOrder } from "./utils/longSwap";
import { ethLogs } from "./utils/get_ethLogs";

function App() {
  const [provider, setProvider] = useState();
  const [web3provider, setweb3provider] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [isWallletConnceted, setWalletConnected] = useState(false);
  const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState(false);

  const {
    srcAddress,
    destAddress,
    swapAmount,
    error,
    setError,
    loading,
    setLoading,
    setSuccess,
  } = useContext(ShortSwapContext);

  const connectWallet = async () => {
    try {
      await getProvider();
      console.log("Wallet Connected Info", isWallletConnceted);
    } catch (err) {
      console.error(err);
      setError("Wallet Connection Rejected");
    }
  };

  const getProvider = async (needSigner = false) => {
    setLoading(true);
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();

      localStorage.setItem("account", accounts);

      setweb3provider(web3Provider);
      setProvider(provider);

      const walletBalance = await web3Provider.getBalance(accounts[0]);
      const ethBalance = ethers.utils.formatEther(walletBalance);
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

      localStorage.setItem("balance", humanFriendlyBalance);

      setBalance(humanFriendlyBalance);

      if (accounts) setAccount(accounts[0]);
      if (needSigner) return web3Provider.getSigner();
      if (provider) setWalletConnected(true);

      setSuccess("Wallet Connected");
      setLoading(false);
      return web3Provider;
    } catch (err) {
      setLoading(false);
      setError("Wallet Connection Rejected");
    }
  };

  const disconnect = async () => {
    setEthBalance("");
    setAccount("");
    await web3Modal.clearCachedProvider();
  };

  const getAmounts = async () => {
    const provider = await connectWallet();
    const signer = await connectWallet();
    const address = await signer.getAddress();
    // get the amount of eth in the user's account
    const _ethBalance = await getEtherBalance(provider, address);
    setEthBalance(_ethBalance);
  };

  //  Swap Token
  const _swapTokens = async () => {
    setLoading(true);
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const swapAmountWei = ethers.utils.parseEther(swapAmount);
      console.log(swapAmountWei);

      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (swapAmountWei > 0) {
        const signer = await getProvider(true);
        console.log(signer);
        const assetIn = srcAddress;
        const assetOut = destAddress;
        const walletAddress = account;
        // Call the swapTokens function from the `utils` folder
        await swapTokens(
          signer,
          swapAmountWei,
          assetIn,
          assetOut,
          walletAddress
        ).catch((err) => {
          console.error(err);
          setError("Transaction Error");
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Transaction Cancelled");
      setLoading(false);
      // setSwapAmount("");
    }
  };

  const _placeLongTermOrders = async () => {
    try {
      const tokenInIndex = "0";
      const tokenOutIndex = "0";
      const amountIn = "100000";
      const numberOfBlockIntervals = "0";
      const signer = await getProvider(true);
      // Call the PlaceLongTermOrders function from the `utils` folder*
      await placeLongTermOrder(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer
      );
      setIsPlacedLongTermOrder(true);
    } catch (err) {
      console.error(err);
      setError("Transaction Cancelled");
    }
  };

  async function ShortSwapButtonClick() {
    try {
      if (!isWallletConnceted) {
        await connectWallet();
      } else {
        await _swapTokens();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function LongSwapButtonClick() {
    if (!isWallletConnceted) {
      await connectWallet();
    } else {
      await _placeLongTermOrders();
    }
  }

  const data = {
    token: {
      name: "Ethereum",
      symbol: "ETH",
      image: "/ethereum.png",
    },
    wallet: {
      address: account === null ? "Wallet Address" : truncateAddress(account),
      balance: account === null ? "Wallet Balance" : balance,
    },
  };

  useEffect(() => {
    const account = localStorage.getItem("account");
    const balance = localStorage.getItem("balance");
    if (account && balance) {
      setAccount(account);
      setWalletConnected(true);
      setBalance(balance);
    }
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setError();
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [loading, error]);

  useEffect(() => {
    console.log("Swap Amount", swapAmount);
  }, [swapAmount]);

  useEffect(() => {
    console.log("Source Address", srcAddress);
  }, [srcAddress]);

  useEffect(() => {
    console.log("Destination Address", destAddress);
  }, [destAddress]);

  return (
    <div className="App">
      <Navbar
        tokenName={data.token.name}
        tokenImage={data.token.image}
        walletBalance={data.wallet.balance}
        walletAddress={data.wallet.address}
        accountStatus={isWallletConnceted ? true : false}
        connectWallet={ShortSwapButtonClick}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ShortSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
              connectWallet={ShortSwapButtonClick}
              buttonText={!isWallletConnceted ? "Connect Wallet" : "Swap"}
            />
          }
        />

        <Route
          path="/longterm"
          element={
            <LongSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
              buttonText={!isWallletConnceted ? "Connect Wallet" : "Swap"}
              connectWallet={LongSwapButtonClick}
              isPlacedLongTermOrder={isPlacedLongTermOrder}
            />
          }
        />

        <Route path="/liquidity" element={<AddLiquidity />} />
      </Routes>
    </div>
  );
}

export default App;
