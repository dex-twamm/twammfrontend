import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortSwap from "./pages/ShortSwap";
import LongSwap from "./pages/LongSwap";
import AddLiquidity from "./components/AddLiquidity";
import "./App.css";
import { web3Modal } from "./utils/providerOptions";
import { BigNumber, ethers, providers } from "ethers";
import { useState, useContext, useEffect } from "react";
import { getEtherBalance, getLPTokensBalance } from "./utils/getAmount";
import { swapTokens } from "./utils/swap";
import { joinPool, exitPool, getPoolBalance } from "./utils/addLiquidity";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, toHex, truncateAddress } from "./utils";
import { LongSwapContext, ShortSwapContext } from "./providers";
import { placeLongTermOrder } from "./utils/longSwap";
import { ethLogs } from "./utils/get_ethLogs";
import PopupModal from "./components/alerts/PopupModal";
import { chipClasses } from "@mui/material";

function App() {
  const [provider, setProvider] = useState();
  const [web3provider, setweb3provider] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [nonce, setNonce] = useState();
  const [isWallletConnceted, setWalletConnected] = useState(false);
  const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState(false);


  const {
    srcAddress,
    destAddress,
    swapAmount,
    setError,
    setLoading,
    setSuccess,
    setTokenBalances,
    setTransactionHash,
    ethBalance,
    setPoolCash, poolCash

  } = useContext(ShortSwapContext);
  const { tokenA, tokenB } = useContext(LongSwapContext);
  // console.log("TOKENS", tokenA, tokenB);
  // console.log("Select Token", selectToken);
  // console.log("Select Token From App", selectToken);
  // console.log("ETH Balances", ethBalance);
  // //  Connect Wallet
  const connectWallet = async () => {
    try {
      await getProvider();
      console.log("Wallet Connected Info", isWallletConnceted);
    } catch (err) {
      console.error(err);
      setError("Wallet Connection Rejected");
    }
  };

  //  Get Provider 
  const getProvider = async (needSigner = false) => {
    setLoading(true);
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      console.log("accounts", accounts);
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

  // const disconnect = async () => {
  //   try {
  //     await web3Modal.clearCachedProvider();
  //     setAccount("");
  //     setNetworkId("");
  //     setLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  //  Swap Token
  const _swapTokens = async () => {
    setLoading(true);
    const walletBalanceWei = ethers.utils.parseUnits(ethBalance, "ether");
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
    if (swapAmountWei.lte(walletBalanceWei) && swapAmountWei.lte(poolCash)) {
      try {
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
        ).then((res) => setTransactionHash(res)).catch((err) => {
          console.error(err);
          setError("Transaction Error");
        });
        setLoading(false);

      } catch (err) {
        console.error(err);
        setLoading(false);
        setError("Transaction Cancelled");
      }
    } else {
      setLoading(false);
      setError("Insufficient Balance")
    }
  };

  //  Long Term Swap
  const _placeLongTermOrders = async () => {
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
    console.log("swapAmountWei", swapAmountWei);
    try {
      const tokenInIndex = "0";
      const tokenOutIndex = "1";
      const amountIn = swapAmountWei;
      console.log("amountIn", amountIn);
      const numberOfBlockIntervals = "3";
      const signer = await getProvider(true);
      const walletAddress = account;
      // Call the PlaceLongTermOrders function from the `utils` folder*
      await placeLongTermOrder(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer,
        walletAddress
      );
      setIsPlacedLongTermOrder(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Transaction Cancelled");
    }
  };
  //   Calling Swap 
  async function ShortSwapButtonClick() {
    try {
      const signer = await getProvider(true);
      await ethLogs(signer);
      if (!isWallletConnceted) {
        await connectWallet();
      } else {
        await _swapTokens();
      }
    } catch (err) {
      console.error(err);
    }
  }

  //  Calling LongTermSwap
  async function LongSwapButtonClick() {
    if (!isWallletConnceted) {
      await connectWallet();
    } else {
      await _placeLongTermOrders();

    }
  }

  //  JoinPool
  const _joinPool = async () => {
    try {
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWallletConnceted) {
        await connectWallet();
      }
      await joinPool(walletAddress, signer);

    } catch (e) {
      console.log(e);
    }
  }

  //  ExitPool
  const _exitPool = async () => {
    try {
      const bptAmountIn = ethers.utils.parseUnits("0.001", "ether");
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWallletConnceted) {
        await connectWallet();
      }
      await exitPool(walletAddress, signer, bptAmountIn);

    } catch (e) {
      console.log(e);
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

  // Getting Each Token Balances
  const tokenBalance = async (account) => {
    setLoading(true);
    try {
      const provider = await getProvider(true);
      const tokenAddress = FAUCET_TOKEN_ADDRESS;
      await getLPTokensBalance(provider, account).then((res) => {
        setTokenBalances(res);
        // console.log("Response From Token Balance Then Block", res)
      });
      await getPoolBalance(provider, tokenAddress).then((res) => {
        setPoolCash(res);
        console.log("===GET POOL BALANCE====", res)
      })
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    const account = localStorage.getItem("account");
    const balance = localStorage.getItem("balance");
    if (account && balance) {
      setAccount(account);
      setWalletConnected(true);
      setBalance(balance);
    }
    tokenBalance(account);
  }, []);

  return (
    <>
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

        {/* Replace _exitPool with _joinPool When Needed To Join Pool */}
        <Route path="/liquidity" element={<AddLiquidity connect={_joinPool} />} />
      </Routes>
    </>
  );
}

export default App;
