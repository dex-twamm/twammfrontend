import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ethLogo from "./images/ethereum.png";

import Navbar from "./components/Navbar";
import LongSwap from "./pages/LongSwap";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { WebContext } from "./providers/context/WebProvider";
import { bigToStr, truncateAddress } from "./utils";
import { getPoolBalance } from "./utils/addLiquidity";
import { connectWallet } from "./utils/connetWallet";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance } from "./utils/getApproval";
import { getProvider } from "./utils/getProvider";
import { spotPrice } from "./utils/getSpotPrice";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock } from "./utils/longSwap";
import { web3Modal } from "./utils/providerOptions";
import { useNetwork } from "./providers/context/UIProvider";
import LiquidityPage from "./pages/LiquidityPage";

function App() {
  const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState();
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const { setShowDropdown } = useContext(UIContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [spotPriceLoading, setSpotPriceLoading] = useState(false);

  const currentNetwork = useNetwork();

  const {
    srcAddress,
    destAddress,
    swapAmount,
    setSwapAmount,
    setLoading,
    loading,
    formErrors,
    setTokenBalances,
    transactionHash,
    setPoolCash,
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
    setAllowance,
    message,
    setMessage,
    setOrderLogsLoading,
  } = useContext(LongSwapContext);
  const { provider, setProvider } = useContext(WebContext);

  console.log("Current Block", currentBlock);

  useEffect(() => {
    account && setWalletConnected(true);
  }, [account, setWalletConnected]);

  // Refresh State
  const refreshState = () => {
    setAccount();
    setWalletConnected(false);
    setBalance();
    localStorage.clear();
  };

  // Disconnect Wallet
  const disconnect = async () => {
    web3Modal.clearCachedProvider();
    refreshState();
    setShowDisconnect(false);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  console.log("web3Modal.cachedProvider", web3Modal.cachedProvider);

  console.log("webashasdweb3provider", account);

  console.log("networkkkkk", currentNetwork);

  //  Swap Token

  useEffect(() => {
    if (transactionHash) {
      setSwapAmount(0);
      setExpectedSwapOut(0);
    }
  }, [transactionHash]);

  const data = {
    token: {
      name: "Ethereum",
      symbol: "ETH",
      logo: ethLogo,
    },
    wallet: {
      address: account === null ? "Wallet Address" : truncateAddress(account),
      balance: account === null ? "Wallet Balance" : balance,
    },
  };

  console.log("Account--->", account);
  console.log("selectedNjkdhksdas", currentNetwork);

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
        await getAllowance(
          provider,
          walletAddress,
          tokenAddress,
          currentNetwork?.network
        ).then((res) => {
          setAllowance(bigToStr(res));
          console.log("===Allowance Response ====", bigToStr(res));
        });
        // Pool Balance
        console.log("Token addresssss", tokenAddress);
        await getPoolBalance(
          provider,
          tokenAddress,
          currentNetwork?.network
        ).then((res) => {
          setPoolCash(res);
          console.log(
            "===GET POOL BALANCE====",
            res,
            tokenAddress,
            currentNetwork?.network
          );
        });
      }
    };
    allowance();
  }, [srcAddress, transactionHash]);

  useEffect(() => {
    // console.log("ajsdhkasd----", swapAmount, destAddress, srcAddress);
    // Wait for 0.5 second before fetching price.
    const interval1 = setTimeout(() => {
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
        setExpectedSwapOut,
        currentNetwork?.network
      );
    }, 500);
    // Update price every 12 seconds.
    const interval2 = setTimeout(() => {
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
        setExpectedSwapOut,
        currentNetwork?.network
      );
    }, 12000);
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [swapAmount, destAddress, srcAddress]);

  console.log("accountskdjlad", account);

  // Getting Each Token Balances
  const tokenBalance = useCallback(async () => {
    setLoading(true);
    setOrderLogsLoading(true);
    if (typeof account !== "undefined") {
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
        await getTokensBalance(provider, account, currentNetwork?.network).then(
          (res) => {
            setTokenBalances(res);
            console.log("Response From Token Balance Then Block", res);
          }
        );

        await getLastVirtualOrderBlock(provider, currentNetwork?.network).then(
          (res) => {
            console.log("Latest Block", res);
            setLatestBlock(res);
          }
        );
        await getEthLogs(provider, walletAddress, currentNetwork?.network).then(
          (res) => {
            // console.log("=== Order Keys === ", res.keys())
            // console.log("=== Order Values === ", res.values())
            const resArray = Array.from(res.values());
            console.log("=== Order Logs === ", resArray);
            setOrderLogsDecoded(resArray);
          }
        );

        // Pool Token's Balance
        await getLPTokensBalance(
          provider,
          walletAddress,
          currentNetwork?.network
        ).then((res) => {
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
          change={connectWallet}
          disconnectWallet={disconnect}
          showDisconnect={showDisconnect}
          setShowDisconnect={setShowDisconnect}
        />

        <Routes>
          <Route
            path="/shortswap"
            element={
              <ShortSwap
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.logo}
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
                isPlacedLongTermOrder={isPlacedLongTermOrder}
                setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                spotPriceLoading={spotPriceLoading}
                message={message}
                setMessage={setMessage}
                loading={loading}
              />
            }
          />
          <Route
            path="/liquidity"
            element={
              <LiquidityPage
                setShowRemoveLiquidity={setShowRemoveLiquidity}
                showRemoveLiquidity={showRemoveLiquidity}
                setShowAddLiquidity={setShowAddLiquidity}
                showAddLiquidity={showAddLiquidity}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
