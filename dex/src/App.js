import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortSwap from "./pages/ShortSwap";
import LongSwap from "./pages/LongSwap";
import AddLiquidity from "./components/AddLiquidity";
import "./App.css";
import { web3Modal } from "./utils/providerOptions";
import { Contract, ethers, BigNumber, utils, providers } from "ethers";
import { useState, useEffect } from "react";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "./utils/getAmount";
import { swapTokens, getAmountOfTokensReceivedFromSwap } from "./utils/swap";
import { MAX_UINT256 } from "./constants";
import { truncateAddress } from "./utils";
import { library } from "@fortawesome/fontawesome-svg-core";

function App() {
  const zero = BigNumber.from(0);

  const initialText = "Connect Wallet";
  const [provider, setProvider] = useState();
  const [web3Provider, setWeb3Provider] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [buttonText, setButtonText] = useState(initialText);
  const [reservedCD, setReservedCD] = useState(zero);
  const [swapAmount, setSwapAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [tokenToBeReceivedAfterSwap, settokenToBeReceivedAfterSwap] =
    useState(zero);
  const [ethSelected, setEthSelected] = useState(true);

  const [isWallletConnceted, setWalletConnected] = useState(false);
  const connectWallet = async () => {
    try {
      await getProvider();
      setWalletConnected(true);
      // const provider = await web3Modal.connect();
      // const library = new ethers.providers.Web3Provider(provider);
      // const accounts = await library.listAccounts();
      // const addressWallet = await library.provider.selectedAddress;
      // const walletBalance = await library.getBalance(addressWallet);
      // const ethBalance = ethers.utils.formatEther(walletBalance);
      // const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      // console.log(accounts);
      // console.log(library);
      // setProvider(provider);
      // setWeb3Provider(library);
      // if (accounts) {
      //   setAccount(accounts[0]);
    } catch (err) {
      // setEthBalance(humanFriendlyBalance);
      // return true;
      console.error(err);
      // return false;
    }
  };

  const getProvider = async (needSigner = false) => {
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const accounts = await web3Provider.listAccounts();
    console.log(accounts);
    const walletBalance = await web3Provider.getBalance(accounts[0]);
    const ethBalance = ethers.utils.formatEther(walletBalance);
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    setBalance(humanFriendlyBalance);
    if (accounts) {
      setAccount(accounts[0]);
    }

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  const disconnect = async () => {
    setEthBalance("");
    setAccount("");
    await web3Modal.clearCachedProvider();
  };

  // const swapTokens = async () => {
  //   swap(Contract, account, account);
  //   console.log("Clicked");
  // };

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
      const swapAmountWei = utils.parseEther(swapAmount);
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!swapAmountWei.eq(zero)) {
        const signer = await getProvider(true);
        setLoading(true);
        // Call the swapTokens function from the `utils` folder
        await swapTokens(
          signer,
          swapAmountWei,
          tokenToBeReceivedAfterSwap,
          ethSelected
        );
        setLoading(false);
        // Get all the updated amounts after the swap
        await getAmounts();
        setSwapAmount("");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setSwapAmount("");
    }
  };

  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount) => {
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!_swapAmountWEI.eq(zero)) {
        const provider = await connectWallet();
        // Get the amount of ether in the contract
        const _ethBalance = await getEtherBalance(provider, null, true);
        // Call the `getAmountOfTokensReceivedFromSwap` from the utils folder
        const amountOfTokens = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        );
        settokenToBeReceivedAfterSwap(amountOfTokens);
      } else {
        settokenToBeReceivedAfterSwap(zero);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function handleButtonClick() {
    console.log("I am Being Clicked");
    console.log(isWallletConnceted);
    if (!isWallletConnceted) {
      connectWallet().then(() => setButtonText("Swap"));
    } else {
      _swapTokens();
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

  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     connectWallet();
  //   }
  // }, []);

  return (
    <div className="App">
      <Navbar
        tokenName={data.token.name}
        tokenImage={data.token.image}
        walletBalance={data.wallet.balance}
        walletAddress={data.wallet.address}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ShortSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
              connectWallet={handleButtonClick}
              buttonText={buttonText}
            />
          }
        />

        <Route
          path="/longterm"
          element={
            <LongSwap
              tokenSymbol={data.token.symbol}
              tokenImage={data.token.image}
            />
          }
        />

        <Route path="/liquidity" element={<AddLiquidity />} />
      </Routes>
    </div>
  );
}

export default App;
