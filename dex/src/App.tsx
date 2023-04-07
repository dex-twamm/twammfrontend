import { useCallback, useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LongSwapPage from "./pages/LongSwapPage";
import ShortSwap from "./pages/ShortSwap";
import { bigToStr } from "./utils";
import { connectWallet } from "./utils/connectWallet";
import { getTokensBalance } from "./utils/getTokensBalance";
import { getAllowance } from "./utils/getApproval";
import { getEthLogs } from "./utils/getEthLogs";
import { getLastVirtualOrderBlock } from "./utils/longSwap";
import { web3Modal } from "./utils/providerOptions";
import LiquidityPage from "./pages/LiquidityPage";
import { disconnect } from "./utils/disconnectWallet";
import ContactPage from "./pages/ContactPage";
import ChatBubbleOutlineTwoToneIcon from "@mui/icons-material/ChatBubbleOutlineTwoTone";
import { useShortSwapContext } from "./providers/context/ShortSwapProvider";
import { useLongSwapContext } from "./providers/context/LongSwapProvider";
import { useNetworkContext } from "./providers/context/NetworkProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    setSwapAmount,
    setLoading,
    setTokenBalances,
    transactionHash,
    account,
    setAccount,
    isWalletConnected,
    setWalletConnected,
    setExpectedSwapOut,
    setWeb3provider,
    setCurrentBlock,
    setBalance,
    web3provider,
    setFormErrors,
    setSpotPrice,
  } = useShortSwapContext();
  const {
    tokenA,
    setOrderLogsDecoded,
    setLastVirtualOrderBlock,
    setAllowance,
    setOrderLogsLoading,
  } = useLongSwapContext();

  const { setSelectedNetwork, selectedNetwork } = useNetworkContext();

  // Connect cached Wallet as early as possible in cycle.
  useEffect(() => {
    if (web3Modal.cachedProvider && !isWalletConnected) {
      connectWallet().then((res) => {
        const {
          account,
          balance,
          currentBlock,
          selectedNetwork,
          web3Provider,
        } = res;
        setWeb3provider(web3Provider);
        setCurrentBlock(currentBlock);
        setBalance(balance);
        setAccount(account);
        setWalletConnected(true);
        setSelectedNetwork(selectedNetwork);
      });
    }
  }, [
    isWalletConnected,
    setAccount,
    setBalance,
    setCurrentBlock,
    setSelectedNetwork,
    setWalletConnected,
    setWeb3provider,
  ]);

  // Swap Token
  useEffect(() => {
    if (transactionHash) {
      setSwapAmount("");
      setExpectedSwapOut(0);
    }
  }, [transactionHash]);

  // Use Memo
  useMemo(() => {
    const allowance = async () => {
      const tokenAddress = tokenA?.address;
      const walletAddress = account;

      // Allowance
      if (tokenA?.address) {
        await getAllowance(
          web3provider?.getSigner(),
          walletAddress,
          tokenAddress,
          selectedNetwork
        )
          .then((res) => {
            setAllowance(bigToStr(res, tokenA.decimals));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    allowance();
  }, [tokenA, transactionHash, selectedNetwork]);

  // Getting Each Token Balances
  const tokenBalance = useCallback(async () => {
    setLoading(true);
    setOrderLogsLoading(true);
    if (account && web3provider) {
      const walletAddress = account;
      if (!walletAddress) {
        return null;
      }
      try {
        await getTokensBalance(
          web3provider?.getSigner(),
          account,
          selectedNetwork
        ).then((res) => {
          setTokenBalances(res);
        });

        await getLastVirtualOrderBlock(
          web3provider?.getSigner(),
          selectedNetwork
        ).then((res) => {
          setLastVirtualOrderBlock(res);
        });

        await getEthLogs(
          web3provider?.getSigner(),
          walletAddress,
          selectedNetwork
        ).then((res) => {
          const resArray = Array.from(res.values());
          setOrderLogsDecoded(resArray);
        });
        setLoading(false);
        setOrderLogsLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setOrderLogsLoading(false);
      }
    }
  }, [account, web3provider, selectedNetwork]);

  useEffect(() => {
    tokenBalance();
  }, [tokenBalance, selectedNetwork]);

  useEffect(() => {
    tokenBalance();
    const account = localStorage.getItem("account");
    const balance = localStorage.getItem("balance");
    if (account && balance) {
      setAccount(account);
      setWalletConnected(true);
      setBalance(parseFloat(balance));
    }
  }, []);

  useEffect(() => {
    let signer = web3provider?.getSigner();
    if (signer?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
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

  // This will automatically change the account of our app without refreshing when the account in metamask is changed.
  useEffect(() => {
    const { ethereum }: any = window;
    if (ethereum) {
      const accountsChangedListener = function (accounts: string[]) {
        setAccount(accounts[0]);
      };
      ethereum.on("accountsChanged", accountsChangedListener);

      return () => {
        ethereum.removeListener("accountsChanged", accountsChangedListener);
      };
    }
  }, []);

  useEffect(() => {
    connectWallet().then((res) => {
      const { account, balance, currentBlock, selectedNetwork, web3Provider } =
        res;
      setWeb3provider(web3Provider);
      setCurrentBlock(currentBlock);
      setBalance(balance);
      setAccount(account);
      setWalletConnected(true);
      setSelectedNetwork(selectedNetwork);
    });
  }, [account]);

  useEffect(() => {
    setSwapAmount("");
    setExpectedSwapOut(0);
    setFormErrors({ balError: "" });
    setSpotPrice(0);
  }, [selectedNetwork]);

  return (
    <>
      <div className="main">
        <Navbar />
        <Routes>
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shortswap" element={<ShortSwap />} />
          <Route path="/" element={<LongSwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
          <Route path="/liquidity/:id" element={<LiquidityPage />} />
        </Routes>
        {location.pathname !== "/contact" ? (
          <div className="supportIcon">
            <ChatBubbleOutlineTwoToneIcon
              sx={{ fontSize: 19, color: "white" }}
              onClick={() => navigate("/contact")}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
