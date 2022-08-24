import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortSwap from "./pages/ShortSwap";
import LongSwap from "./pages/LongSwap";
import AddLiquidity from "./components/AddLiquidity";
import "./App.css";
import { web3Modal } from "./utils/providerOptions";
import { ethers, BigNumber, utils, providers } from "ethers";
import { useState, useEffect, useContext } from "react";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "./utils/getAmount";
import { swapTokens, getAmountOfTokensReceivedFromSwap } from "./utils/swap";
import { MAX_UINT256 } from "./constants";
import { toHex, truncateAddress } from "./utils";
import AllProviders, { ShortSwapContext } from "./providers";
import { placeLongTermOrder } from "./utils/longSwap";

function App() {
  const [provider, setProvider] = useState();
  const [web3provider, setweb3provider] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [isWallletConnceted, setWalletConnected] = useState(false);



  const { srcAddress, destAddress, swapAmount, setError } = useContext(ShortSwapContext);

  const connectWallet = async () => {
    try {
      await getProvider();
      // setWalletConnected(true);
      console.log("Wallet Connected Info", isWallletConnceted);

    } catch (err) {
      console.error(err);
    }
  };

  const getProvider = async (needSigner = false) => {
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      setweb3provider(web3Provider);
      setProvider(provider);

      console.log(accounts);
      const walletBalance = await web3Provider.getBalance(accounts[0]);
      const ethBalance = ethers.utils.formatEther(walletBalance);
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      setBalance(humanFriendlyBalance);
      if (accounts) {
        setAccount(accounts[0]);
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      if (provider) {
        setWalletConnected(true);
      }
      return web3Provider;
    } catch (err) {
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
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const swapAmountWei = ethers.utils.parseEther(swapAmount);
      console.log(swapAmountWei);

      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (swapAmountWei > 0) {
        const signer = await getProvider(true);
        console.log(signer);
        setLoading(true);
        const assetIn = srcAddress;
        const assetOut = destAddress;
        const walletAddress = account;
        // Call the swapTokens function from the `utils` folder
        await swapTokens(signer, swapAmountWei, assetIn, assetOut, walletAddress);
        setLoading(false);
        // Get all the updated amounts after the swap
        await getAmounts();
        // setSwapAmount("");
      }
    } catch (err) {
      console.error(err);
      setError("Transaction Cancelled");
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
      await placeLongTermOrder(tokenInIndex, tokenOutIndex, amountIn, numberOfBlockIntervals, signer);

    }
    catch (err) {
      console.error(err);
      setError("Transaction Cancelled");
    }
  }


  async function ShortSwapButtonClick() {
    console.log("I am Being Clicked");
    console.log("Wallet Connection", isWallletConnceted);
    try {
      if (!isWallletConnceted) {
        await connectWallet();;
      }
      else {
        await _swapTokens();

      }
    } catch (err) {
      console.error(err);
    }
  }

  async function LongSwapButtonClick() {
    console.log("I am Being Clicked");
    console.log("Wallet Connection", isWallletConnceted);
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
      address:
        account == null ? (
          <p>Wallet Address</p>
        ) : (
          <>
            <p>{truncateAddress(account)}</p>
          </>
        ),
      balance:
        account == null ? (
          <p>Wallet balance</p>
        ) : (
          <>
            <p>{balance}</p>
          </>
        ),
    },
  };

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
      {/* <Swap onChange={primaryAmount} /> */}
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
            />
          }
        />

        <Route path="/liquidity" element={<AddLiquidity />} />
      </Routes>
    </div>
  );
}

export default App;
