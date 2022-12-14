import { useCallback, useContext, useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LongSwapPage from "./pages/LongSwapPage";
import ShortSwap from "./pages/ShortSwap";
import { LongSwapContext, ShortSwapContext, UIContext } from "./providers";
import { bigToStr } from "./utils";
import { getPoolBalance } from "./utils/addLiquidity";
import { connectWallet } from "./utils/connetWallet";
import { getLPTokensBalance, getTokensBalance } from "./utils/getAmount";
import { getAllowance } from "./utils/getApproval";
import { getEthLogs } from "./utils/get_ethLogs";
import { getLastVirtualOrderBlock } from "./utils/longSwap";
import { web3Modal } from "./utils/providerOptions";
import LiquidityPage from "./pages/LiquidityPage";
import { disconnect } from "./utils/disconnectWallet";

function App() {
  const {
    srcAddress,
    setSwapAmount,
    setLoading,
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
    setLPTokenBalance,
    setBalance,
    web3provider,
  } = useContext(ShortSwapContext);
  const {
    setOrderLogsDecoded,
    setLastVirtualOrderBlock,
    setAllowance,
    setOrderLogsLoading,
  } = useContext(LongSwapContext);

  const { setSelectedNetwork, selectedNetwork } = useContext(UIContext);

  // Connect cached Wallet as early as possible in cycle.
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
  }, []);

  // Swap Token
  useEffect(() => {
    if (transactionHash) {
      setSwapAmount(0);
      setExpectedSwapOut(0);
    }
  }, [transactionHash]);

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
        });
      }
    };
    allowance();
  }, [srcAddress, transactionHash]);

  // Getting Each Token Balances
  const tokenBalance = useCallback(async () => {
    setLoading(true);
    setOrderLogsLoading(true);
    if (account && web3provider) {
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

        await getLastVirtualOrderBlock(
          web3provider?.getSigner(),
          selectedNetwork?.network
        ).then((res) => {
          setLastVirtualOrderBlock(res);
        });
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
    let signer = web3provider?.getSigner();
    if (signer?.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts) setAccount(accounts[0]);
      };
      const handleDisconnect = () => {
        disconnect(setAccount, setWalletConnected, setBalance);
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

  return (
    <>
      <div className="main">
        <Navbar />
        <Routes>
          <Route path="/shortswap" element={<ShortSwap />} />
          <Route path="/" element={<LongSwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
