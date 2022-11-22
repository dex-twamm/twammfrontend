import { ethers, providers } from "ethers";
import { web3Modal } from "./providerOptions";

//  Get Provider
export const getProvider = async (
  needSigner,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  setProvider
) => {
  // setLoading(true);
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const accounts = await web3Provider.listAccounts();
    console.log("accounts", accounts);
    localStorage.setItem("account", accounts);
    setProvider(provider);
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
