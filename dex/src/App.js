import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ethLogo from "./images/ethereum.png";
import {
  AddLiquidity,
  LiquidityPools,
  RemoveLiquidity,
} from "./components/Liquidity";
import Navbar from "./components/Navbar";
import LongSwapPage from "./pages/LongSwapPage";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { bigToStr, truncateAddress } from "./utils";
import {

  getPoolBalance,
} from "./utils/addLiquidity";
import { connectWallet } from "./utils/connetWallet";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance } from "./utils/getApproval";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock } from "./utils/longSwap";
import { web3Modal } from "./utils/providerOptions";

function App() {
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
    setTokenBalances,
    transactionHash,
    setPoolCash,
    account,
    setAccount,
    isWalletConnected,
    setWalletConnected,
    setExpectedSwapOut,
    setweb3provider,
    web3provider,
    setCurrentBlock,
    currentBlock,
    error,
    setLPTokenBalance,
    balance,
    setBalance,
  } = useContext(ShortSwapContext);
  const {
    setOrderLogsDecoded,
    setLastVirtualOrderBlock,
    setAllowance,
    message,
    setMessage,
    setOrderLogsLoading,
  } = useContext(LongSwapContext);

  const { setSelectedNetwork, selectedNetwork } = useContext(UIContext);

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
    if (web3Modal.cachedProvider && !isWalletConnected) {
      connectWallet(
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        setSelectedNetwork
      );
    }
  });

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
      const tokenAddress = srcAddress;
      const walletAddress = account;

      // Allowance
      if (srcAddress) {
        await getAllowance(
          web3provider?.getSigner(),
          walletAddress,
          tokenAddress,
          selectedNetwork?.network
        ).then((res) => {
          setAllowance(bigToStr(res));
        });
        // Pool Balance
        await getPoolBalance(
          web3provider?.getSigner(),
          tokenAddress,
          selectedNetwork?.network
        ).then((res) => {
          setPoolCash(res);
          console.log(
            "===GET POOL BALANCE====",
            res,
            tokenAddress,
            selectedNetwork?.network
          );
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

      // const tokenAddress = srcAddress;
      const walletAddress = account;
      if (!walletAddress) {
        return null;
      }
      try {
        await getTokensBalance(
          web3provider?.getSigner(),
          account,
          selectedNetwork?.network
        ).then((res) => {
          setTokenBalances(res);
        });

        await getLastVirtualOrderBlock(web3provider?.getSigner(), selectedNetwork?.network).then(
          (res) => {
            setLastVirtualOrderBlock(res);
          }
        );
        await getEthLogs(
          web3provider?.getSigner(),
          walletAddress,
          selectedNetwork?.network
        ).then((res) => {
          const resArray = Array.from(res.values());
          setOrderLogsDecoded(resArray);
        });

        // Pool Token's Balance
        await getLPTokensBalance(
          web3provider?.getSigner(),
          walletAddress,
          selectedNetwork?.network
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
  }, [account, web3provider]);

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
    let signer = web3provider?.getSigner();
    if (signer?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };
      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      signer.on("accountsChanged", handleAccountsChanged);

      signer.on("disconnect", handleDisconnect);

      return () => {
        if (signer.removeListener) {
          signer.removeListener("accountsChanged", handleAccountsChanged);
          signer.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [web3provider]);

  let liquidityMarkup = (
    <LiquidityPools
      showRemoveLiquidity={setShowRemoveLiquidity}
      showAddLiquidity={setShowAddLiquidity}
    />
  );

  if (showAddLiquidity) {
    liquidityMarkup = (
      <AddLiquidity
        showAddLiquidity={setShowAddLiquidity}
      />
    );
  } else if (showRemoveLiquidity)
    liquidityMarkup = (
      <RemoveLiquidity showRemoveLiquidity={setShowRemoveLiquidity} />
    );

  // Condition of Liquidity existing
  // if(liquidityExists) liquidityMarkup = <LiquidityPools/>

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
          <Route path="/liquidity" element={liquidityMarkup} />
        </Routes>
      </div>
    </>
  );
}

export default App;
