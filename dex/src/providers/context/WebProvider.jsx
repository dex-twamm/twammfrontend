import { ethers } from "ethers";
import React, { useState } from "react";
import { providers } from "web3modal";
import { web3Modal } from "../../utils/providerOptions";

export const WebProvider = ({ children }) => {
  const [provider, setProvider] = useState("");

  // //  Get Provider
  // const getProvider = async (needSigner = false) => {
  //   // setLoading(true);
  //   try {
  //     const provider = await web3Modal.connect();
  //     const web3Provider = new providers.Web3Provider(provider);
  //     const accounts = await web3Provider.listAccounts();
  //     // console.log('accounts', accounts);
  //     localStorage.setItem("account", accounts);

  //     setweb3provider(web3Provider);
  //     setProvider(provider);
  //     console.log("WEb 3 Provider", await web3Provider.getBlock("latest"));
  //     // TODO - Update Every Transaction After 12 Seconds
  //     setCurrentBlock(await web3Provider.getBlock("latest"));
  //     const walletBalance = await web3Provider.getBalance(accounts[0]);
  //     const ethBalance = ethers.utils.formatEther(walletBalance);
  //     const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

  //     localStorage.setItem("balance", humanFriendlyBalance);

  //     setBalance(humanFriendlyBalance);
  //     if (accounts) setAccount(accounts[0]);
  //     if (needSigner) return web3Provider.getSigner();
  //     if (web3Provider) setWalletConnected(true);

  //     setSuccess("Wallet Connected");
  //     return web3Provider;
  //   } catch (err) {
  //     setError("Wallet Connection Rejected");
  //   }
  // };

  // //  Connect Wallet
  // const connectWallet = async () => {
  //   try {
  //     await getProvider();
  //     console.log("Wallet Connected Info", isWallletConnceted);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Wallet Connection Rejected");
  //   }
  // };

  return (
    <WebContext.Provider
      value={{
        provider,
        setProvider,
      }}
    >
      {children}
    </WebContext.Provider>
  );
};

export const WebContext = React.createContext();
