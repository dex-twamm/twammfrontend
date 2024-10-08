import { ethers, providers } from "ethers";
import { NETWORKS } from "./networks";
import { web3Modal } from "./providerOptions";

export const connectWallet = async (
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  setSelectedNetwork
) => {
  try {
    const provider = await web3Modal.connect();
    // TODO: Fix switching to Goerli on Coinbase Wallet.
    // If automatic connect with cacheprovider & localstorage contains goerli, pass that below. else any.
    // If manual connect pass network name.
    const web3Provider = new providers.Web3Provider(provider, "any");

    const accounts = await web3Provider.listAccounts();

    // TODO - Update Every Transaction After 12 Seconds
    const walletBalance = await web3Provider.getBalance(accounts[0]);
    const ethBalance = ethers.utils.formatEther(walletBalance);
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

    localStorage.setItem("account", accounts);
    localStorage.setItem("balance", humanFriendlyBalance);

    if (accounts) setAccount(accounts[0]);
    if (web3Provider) setWalletConnected(true);
    setweb3provider(web3Provider);
    setCurrentBlock(await web3Provider.getBlock("latest"));
    setBalance(humanFriendlyBalance);

    window.ethereum?.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);
      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
      });
    });
  } catch (err) {
    console.error(err);
  }
};
