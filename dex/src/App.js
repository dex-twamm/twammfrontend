import { ethers, providers } from "ethers";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ethLogo from "./images/ethereum.png";
import PopupModal from "./components/alerts/PopupModal";
import {
  AddLiquidity,
  LiquidityPools,
  RemoveLiquidity,
} from "./components/Liquidity";
import Navbar from "./components/Navbar";
import { POPUP_MESSAGE } from "./constants";
import Home from "./pages/Home";
import LongSwap from "./pages/LongSwap";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { WebContext } from "./providers/context/WebProvider";
import { bigToStr, truncateAddress } from "./utils";
import {
  cancelLTO,
  exitPool,
  getPoolBalance,
  joinPool,
  withdrawLTO,
} from "./utils/addLiquidity";
import { getEstimatedConvertedToken } from "./utils/batchSwap";
import { connectWallet } from "./utils/connetWallet";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance, getApproval } from "./utils/getApproval";
import { getProvider } from "./utils/getProvider";
import { spotPrice } from "./utils/getSpotPrice";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock, placeLongTermOrder } from "./utils/longSwap";
import { POOLS, POOL_ID } from "./utils/pool";
import { web3Modal } from "./utils/providerOptions";
import { _swapTokens } from "./utils/shortSwap";
import { swapTokens } from "./utils/swap";

function App() {
  const location = useLocation();
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
    setDesAddress,
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
    balance,
    setBalance,
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
    orderLogsLoading,
    setOrderLogsLoading,
  } = useContext(LongSwapContext);
  const { provider, setProvider } = useContext(WebContext);
  const { setSelectedNetwork, nId, selectedNetwork } = useContext(UIContext);

  console.log("Current Block", currentBlock);

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

  useEffect(() => {
    if (transactionHash) {
      setSwapAmount(0);
      const poolConfig = Object.values(
        POOLS?.[localStorage.getItem("coin_name")]
      )?.[0];
      setTokenB({
        symbol: "Select Token",
        image: poolConfig?.tokens[0].logo,
        address: poolConfig?.TOKEN_TWO_ADDRESS,
        balance: 0,
        tokenIsSet: false,
      });
      setExpectedSwapOut(0);
    }
  }, [setSwapAmount, setTokenB, setExpectedSwapOut, transactionHash]);

  const data = {
    token: {
      name: "Ethereum",
      symbol: "ETH",
      image: ethLogo,
    },
    wallet: {
      address: account === null ? "Wallet Address" : truncateAddress(account),
      balance: account === null ? "Wallet Balance" : balance,
    },
  };

  console.log("Account--->", account);
  // Use Memo
  useMemo(() => {
    const allowance = async () => {
      const provider = await getProvider(
        true,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected
      );
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
    console.log("ajsdhkasd----", swapAmount, destAddress, srcAddress);
    const interval = setTimeout(() => {
      spotPrice(
        swapAmount,
        setSpotPriceLoading,
        srcAddress,
        destAddress,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        account,
        expectedSwapOut,
        tolerance,
        deadline,
        setFormErrors,
        setSpotPrice,
        setExpectedSwapOut
      );
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [swapAmount, destAddress, srcAddress]);

  // Getting Each Token Balances
  const tokenBalance = useCallback(async () => {
    setLoading(true);
    setOrderLogsLoading(true);
    const provider = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
    setProvider(provider);
    // const tokenAddress = srcAddress;
    const walletAddress = account;
    if (!walletAddress) {
      return null;
    }
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
        console.log("Response From Token Balance Then Block", res);
      });
      // Pool Token's Balance
      await getLPTokensBalance(provider, walletAddress).then((res) => {
        setLPTokenBalance(res);
        console.log("===Balance Of Pool ====", res);
      });
      setLoading(false);
      setOrderLogsLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setOrderLogsLoading(false);
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
        // connect={_joinPool}
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
          tokenImage={data.token.logo}
          walletBalance={data.wallet.balance}
          walletAddress={data.wallet.address}
          accountStatus={isWalletConnected ? true : false}
          // connectWallet={ShortSwapButtonClick}
          change={connectWallet}
          disconnectWallet={disconnect}
          showDisconnect={showDisconnect}
          setShowDisconnect={setShowDisconnect}
        />

        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/shortswap"
            element={
              <ShortSwap
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.logo}
                // connectWallet={ShortSwapButtonClick}
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
            path="/"
            element={
              <LongSwap
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.logo}
                buttonText={!isWalletConnected ? "Connect Wallet" : "Swap"}
                // connectWallet={LongSwapButtonClick}
                isPlacedLongTermOrder={isPlacedLongTermOrder}
                setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                // cancelPool={_cancelLTO}
                // withdrawPool={_withdrawLTO}
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
