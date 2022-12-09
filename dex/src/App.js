import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ethLogo from "./images/ethereum.png";
import Navbar from "./components/Navbar";
import LongSwapPage from "./pages/LongSwapPage";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { WebContext } from "./providers/context/WebProvider";
import { bigToStr, truncateAddress } from "./utils";
import { getPoolBalance } from "./utils/addLiquidity";
import { connectWallet } from "./utils/connetWallet";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance } from "./utils/getApproval";
import { getProvider } from "./utils/getProvider";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock } from "./utils/longSwap";
import { web3Modal } from "./utils/providerOptions";
import LiquidityPage from "./pages/LiquidityPage";

function App() {
  const location = useLocation();
  const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState();
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const { setShowDropdown } = useContext(UIContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const {
    srcAddress,
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
    setWalletConnected,
    setExpectedSwapOut,
    setweb3provider,
    setCurrentBlock,
    currentBlock,
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

  const { nId, setSelectedNetwork, selectedNetwork } = useContext(UIContext);

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
      connectWallet(
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        setSelectedNetwork,
        nId
      );
    }
  }, []);

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

      // Allowance
      if (srcAddress) {
        await getAllowance(
          provider,
          walletAddress,
          tokenAddress,
          selectedNetwork?.network
        ).then((res) => {
          setAllowance(bigToStr(res));
        });
        // Pool Balance
        await getPoolBalance(
          provider,
          tokenAddress,
          selectedNetwork?.network
        ).then((res) => {
          setPoolCash(res);
        });
      }
    };
    allowance();
  }, [srcAddress, transactionHash]);

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
        await getTokensBalance(
          provider,
          account,
          selectedNetwork?.network
        ).then((res) => {
          setTokenBalances(res);
        });

        await getLastVirtualOrderBlock(provider, selectedNetwork?.network).then(
          (res) => {
            setLatestBlock(res);
          }
        );
        await getEthLogs(
          provider,
          walletAddress,
          selectedNetwork?.network
        ).then((res) => {
          const resArray = Array.from(res.values());
          setOrderLogsDecoded(resArray);
        });

        // Pool Token's Balance
        await getLPTokensBalance(
          provider,
          walletAddress,
          selectedNetwork?.network
        ).then((res) => {
          setLPTokenBalance(res);
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
        if (accounts) setAccount(accounts[0]);
      };
      const handleDisconnect = () => {
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
                buttonText={!isWalletConnected ? "Connect Wallet" : "Swap"}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                message={message}
                setMessage={setMessage}
              />
            }
          />

          <Route
            path="/"
            element={
              <LongSwapPage
                tokenSymbol={data.token.symbol}
                tokenImage={data.token.logo}
                buttonText={!isWalletConnected ? "Connect Wallet" : "Swap"}
                isPlacedLongTermOrder={isPlacedLongTermOrder}
                setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
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
                showAddLiquidity={showAddLiquidity}
                setShowAddLiquidity={setShowAddLiquidity}
                showRemoveLiquidity={showRemoveLiquidity}
                setShowRemoveLiquidity={setShowRemoveLiquidity}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
