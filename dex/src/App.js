import { ethers, providers } from "ethers";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import PopupModal from "./components/alerts/PopupModal";
import {
  AddLiquidity,
  LiquidityPools,
  RemoveLiquidity,
} from "./components/Liquidity";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LongSwap from "./pages/LongSwap";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { WebContext } from "./providers/context/WebProvider";
import { bigToStr, POOL_ID, truncateAddress } from "./utils";
import {
  cancelLTO,
  exitPool,
  getPoolBalance,
  joinPool,
  withdrawLTO,
} from "./utils/addLiquidity";
import { runQueryBatchSwap } from "./utils/batchSwap";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance, getApproval } from "./utils/getApproval";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock, placeLongTermOrder } from "./utils/longSwap";
import { POOLS } from "./utils/pool";
import { web3Modal } from "./utils/providerOptions";
import { swapTokens } from "./utils/swap";

function App() {
  const location = useLocation();
  const [balance, setBalance] = useState();
  const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState(false);
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const { setShowDropdown } = useContext(UIContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [spotPriceLoading, setSpotPriceLoading] = useState(false);

  const {
    srcAddress,
    destAddress,
    swapAmount,
    setSwapAmount,
    setError,
    setLoading,
    loading,
    formErrors,
    setTokenBalances,
    setTransactionHash,
    transactionHash,
    ethBalance,
    setPoolCash,
    poolCash,
    account,
    setAccount,
    isWalletConnected,
    setFormErrors,
    expectedSwapOut,
    setWalletConnected,
    setExpectedSwapOut,
    setweb3provider,
    setCurrentBlock,
    currentBlock,
    setSpotPrice,
    tolerance,
    deadline,
    error,
    setLPTokenBalance,
  } = useContext(ShortSwapContext);
  const {
    setOrderLogsDecoded,
    setLatestBlock,
    numberOfBlockIntervals,
    setAllowance,
    setTokenB,
    message,
    setMessage,
    disableActionBtn,
    setDisableActionBtn,
  } = useContext(LongSwapContext);
  const { provider, setProvider } = useContext(WebContext);
  console.log("Current Block", currentBlock);

  //  Connect Wallet
  const connectWallet = async () => {
    try {
      await getProvider();
      console.log("Wallet Connected Info", isWalletConnected);

      // setSuccess("Wallet Connected");
      // tokenBalance(account);
    } catch (err) {
      console.error(err);
      // setError('Wallet Connection Rejected');
    }
  };

  //  Get Provider
  const getProvider = async (needSigner = false) => {
    // setLoading(true);
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      console.log("accounts", accounts);
      localStorage.setItem("account", accounts);

      setweb3provider(web3Provider);
      console.log("WEb 3 Provider", await web3Provider.getBlock("latest"));
      // TODO - Update Every Transaction After 12 Seconds
      setCurrentBlock(await web3Provider.getBlock("latest"));
      const walletBalance = await web3Provider.getBalance(accounts[0]);
      const ethBalance = ethers.utils.formatEther(walletBalance);
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

      localStorage.setItem("balance", humanFriendlyBalance);

      setBalance(humanFriendlyBalance);
      if (accounts) setAccount(accounts[0]);
      if (needSigner) return web3Provider.getSigner();
      if (web3Provider) setWalletConnected(true);

      return web3Provider;
    } catch (err) {
      // setError('Wallet Connection Rejected');
    }
  };

  useEffect(() => {
    account && setWalletConnected(true);
  }, [account, setWalletConnected]);

  // Refresh State
  const refreshState = () => {
    setAccount("");
    setWalletConnected(false);
    setBalance("");
    localStorage.clear();
  };

  // Disconnect Wallet
  const disconnect = async () => {
    web3Modal.clearCachedProvider();
    refreshState();
    setShowDisconnect(false);
  };

  //  Swap Token
  const _swapTokens = async () => {
    const walletBalanceWei = ethers.utils.parseUnits(ethBalance, "ether");
    const pCash = ethers.utils.parseUnits(poolCash, "ether");
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
    // console.log("Deadline", deadline);

    // swapAmountWei.lte(walletBalanceWei && poolCash)
    // 	? console.log('True')
    // 	: console.log('False');
    if (swapAmountWei.lte(walletBalanceWei && pCash)) {
      try {
        const signer = await getProvider(true);
        // console.log(signer);
        const assetIn = srcAddress;
        const assetOut = destAddress;
        const walletAddress = account;
        // Call the swapTokens function from the `utils` folder
        await swapTokens(
          signer,
          swapAmountWei,
          assetIn,
          assetOut,
          walletAddress,
          expectedSwapOut,
          tolerance,
          deadline
        )
          .then((res) => {
            setTransactionHash(res);
            setMessage("Transaction Success!");
          })
          .catch((err) => {
            console.error(err);
            setError("Transaction Error");
          });
        setLoading(false);
      } catch (err) {
        console.error("errrrrrr", err);
        setLoading(false);
        setError("Transaction Cancelled");
      }
    } else {
      setLoading(false);
      setError("Insufficient Balance");
    }
  };

  useEffect(() => {
    if (transactionHash) {
      setSwapAmount(0);
      setTokenB({
        symbol: "Select Token",
        image: "/ethereum.png",
        address: POOLS[POOL_ID].tokens[0].address,
        balance: 0,
        tokenIsSet: false,
      });
      setExpectedSwapOut(0);
    }
  }, [setSwapAmount, setTokenB, setExpectedSwapOut, transactionHash]);

  // TODO Dynamically Set tokenInIndex and tokenOutIndex
  //  Long Term Swap
  const _placeLongTermOrders = async () => {
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
    // console.log('swapAmountWei', swapAmountWei);
    try {
      const tokenInIndex = POOLS[POOL_ID].tokens.findIndex(
        (object) => srcAddress === object.address
      );
      const tokenOutIndex = POOLS[POOL_ID].tokens.findIndex(
        (object) => destAddress === object.address
      );
      const amountIn = swapAmountWei;
      // console.log('amountIn', amountIn);
      const blockIntervals = Math.ceil(numberOfBlockIntervals);
      console.log("Intervals", numberOfBlockIntervals);
      const signer = await getProvider(true);

      const walletAddress = account;
      // Call the PlaceLongTermOrders function from the `utils` folder*
      await placeLongTermOrder(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        blockIntervals,
        signer,
        walletAddress,
        setTransactionHash
      )
        .then((res) => {
          setTransactionHash(res);
        })
        .finally(setLoading(false));
      setIsPlacedLongTermOrder(true);
      await getEthLogs(provider, walletAddress).then((res) => {
        const resArray = Array.from(res.values());
        setOrderLogsDecoded(resArray);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Transaction Cancelled");
    }
  };
  //   Calling Swap
  async function ShortSwapButtonClick() {
    try {
      if (!isWalletConnected) {
        await connectWallet();
        const signer = await getProvider(true);
        await getEthLogs(signer);
      } else {
        await _swapTokens();
      }
    } catch (err) {
      console.error(err);
    }
  }

  //  Calling LongTermSwap
  async function LongSwapButtonClick() {
    console.log("Wallet", isWalletConnected);
    if (!isWalletConnected) {
      await connectWallet();
      const signer = await getProvider(true);
      await getEthLogs(signer);
    } else {
      await _placeLongTermOrders();
    }
  }

  //  JoinPool
  const _joinPool = async () => {
    try {
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWalletConnected) {
        await connectWallet();
      }
      await joinPool(walletAddress, signer);
    } catch (e) {
      console.log(e);
    }
  };

  //  ExitPool
  const _exitPool = async () => {
    setLoading(true);
    try {
      const bptAmountIn = ethers.utils.parseUnits("0.001", "ether");
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWalletConnected) {
        await connectWallet();
      }
      await exitPool(walletAddress, signer, bptAmountIn);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // cancelLTO
  const _cancelLTO = async (orderId) => {
    setLoading(true);
    setDisableActionBtn(true);
    try {
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWalletConnected) {
        await connectWallet();
      }
      await cancelLTO(
        walletAddress,
        signer,
        orderId,
        setOrderLogsDecoded,
        setMessage,
        provider
      );
      setLoading(false);
      setDisableActionBtn(false);
    } catch (e) {
      console.log(e);
      setMessage("Cancel Failed !");
      setLoading(false);
      setDisableActionBtn(false);
    }
  };
  //  WithdrawLTO
  const _withdrawLTO = async (orderId) => {
    console.log("Order Id", orderId);
    setDisableActionBtn(true);
    setLoading(true);
    try {
      const walletAddress = account;
      const signer = await getProvider(true);
      if (!isWalletConnected) {
        await connectWallet();
      }
      await withdrawLTO(
        walletAddress,
        signer,
        orderId,
        setOrderLogsDecoded,
        setMessage,
        provider
      );
      setLoading(false);
      setDisableActionBtn(false);
    } catch (e) {
      console.log(e);
      setMessage("Withdraw Failed !");
      setLoading(false);
      setDisableActionBtn(false);
    }
  };

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

  //Spot Prices
  const spotPrice = async () => {
    if (swapAmount) {
      setSpotPriceLoading(true);
      const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
      const assetIn = srcAddress;
      const assetOut = destAddress;
      const errors = {};
      const batchPrice = await runQueryBatchSwap(
        assetIn,
        assetOut,
        swapAmountWei
      ).then((res) => {
        console.log("Response From Query Batch Swap", res.errorMessage);
        errors.balError = res.errorMessage;
        setFormErrors(errors ?? "");
        setSpotPrice(res.spotPrice);
        setSpotPriceLoading(false);
        setExpectedSwapOut(res.expectedSwapOut);
      });
      return batchPrice;
    }
  };

  console.log("Account--->", account);
  // Use Memo
  useMemo(() => {
    const allowance = async () => {
      const provider = await getProvider(true);
      const tokenAddress = srcAddress;
      const walletAddress = account;
      console.log("Wallet Address--->", walletAddress);

      // Allowance
      if (srcAddress) {
        await getAllowance(provider, walletAddress, tokenAddress).then(
          (res) => {
            setAllowance(bigToStr(res));
            console.log("===Allowance Response ====", bigToStr(res));
          }
        );
        // Pool Balance
        await getPoolBalance(provider, tokenAddress).then((res) => {
          setPoolCash(res);
          console.log("===GET POOL BALANCE====", res);
        });
      }
    };
    allowance();
  }, [srcAddress, transactionHash]);

  useEffect(() => {
    const interval = setTimeout(() => {
      spotPrice();
    }, 1000);
    return () => clearTimeout(interval);
  }, [swapAmount, destAddress, srcAddress]);

  // Getting Each Token Balances
  const tokenBalance = useCallback(async () => {
    setLoading(true);
    const provider = await getProvider(true);
    setProvider(provider);
    // const tokenAddress = srcAddress;
    const walletAddress = account;
    try {
      await getLastVirtualOrderBlock(provider).then((res) => {
        console.log("Latest Block", res);
        setLatestBlock(res);
      });
      await getEthLogs(provider, walletAddress).then((res) => {
        // console.log("=== Order Keys === ", res.keys())
        // console.log("=== Order Values === ", res.values())
        const resArray = Array.from(res.values());
        console.log("=== Order Logs === ", resArray);
        setOrderLogsDecoded(resArray);
      });
      await getTokensBalance(provider, account).then((res) => {
        setTokenBalances(res);
        // console.log("Response From Token Balance Then Block", res)
      });
      // Pool Token's Balance
      await getLPTokensBalance(provider, walletAddress).then((res) => {
        setLPTokenBalance(res);
        console.log("===Balance Of Pool ====", res);
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [account]);
  useEffect(() => {
    tokenBalance();
  }, [tokenBalance]);

  useEffect(() => {
    tokenBalance();
    const account = localStorage.getItem("account");
    const balance = localStorage.getItem("balance");
    if (account && balance) {
      setAccount(account);
      setWalletConnected(true);
      setBalance(balance);
    }
  }, []);

  useEffect(() => {
    document.body.onclick = () => {
      setShowDropdown(false);
      setShowSettings(false);
    };
  });

  // useEffect(() => {
  // 	if (web3Modal.cachedProvider) {
  // 		connectWallet();
  // 	}
  // }, [provider]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };
      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);

      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  let liquidityMarkup = (
    <LiquidityPools
      showRemoveLiquidity={setShowRemoveLiquidity}
      showAddLiquidity={setShowAddLiquidity}
    />
  );

  if (showAddLiquidity) {
    liquidityMarkup = (
      <AddLiquidity
        connect={_joinPool}
        showAddLiquidity={setShowAddLiquidity}
      />
    );
  } else if (showRemoveLiquidity)
    liquidityMarkup = (
      <RemoveLiquidity showRemoveLiquidity={setShowRemoveLiquidity} />
    );

  // Condition of Liquidity existing
  // if(liquidityExists) liquidityMarkup = <LiquidityPools/>
  console.log("errors", formErrors);

  console.log("Loading--->", loading);

  return (
    <>
      <div className="main">
        <Navbar
          tokenName={data.token.name}
          tokenImage={data.token.image}
          walletBalance={data.wallet.balance}
          walletAddress={data.wallet.address}
          accountStatus={isWalletConnected ? true : false}
          connectWallet={ShortSwapButtonClick}
          change={connectWallet}
          disconnectWallet={disconnect}
          showDisconnect={showDisconnect}
          setShowDisconnect={setShowDisconnect}
        />

        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/"
            element={
              <ShortSwap
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.image}
                connectWallet={ShortSwapButtonClick}
                buttonText={!isWalletConnected ? "Connect Wallet" : "Swap"}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                spotPriceLoading={spotPriceLoading}
                message={message}
                setMessage={setMessage}
              />
            }
          />

          <Route
            path="/longterm"
            element={
              <LongSwap
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.image}
                buttonText={!isWalletConnected ? "Connect Wallet" : "Swap"}
                connectWallet={LongSwapButtonClick}
                isPlacedLongTermOrder={isPlacedLongTermOrder}
                setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                cancelPool={_cancelLTO}
                withdrawPool={_withdrawLTO}
                spotPriceLoading={spotPriceLoading}
                message={message}
                setMessage={setMessage}
                loading={loading}
              />
            }
          />
          <Route path="/liquidity" element={liquidityMarkup} />
        </Routes>
      </div>
    </>
  );
}

export default App;
