import { ethers, providers } from "ethers";
import { getEthLogs } from "./get_ethLogs";
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
    localStorage.setItem("walletConnection", web3Provider?.connection?.url);
    if (accounts) setAccount(accounts[0]);
    if (web3Provider) setWalletConnected(true);
    console.log("web3Provider", web3Provider);
    setweb3provider(web3Provider);
    setCurrentBlock(await web3Provider.getBlock("latest"));
    setBalance(humanFriendlyBalance);

    window.ethereum?.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);
      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
        poolId: localStorage.getItem("poolId")
          ? localStorage.getItem("poolId")
          : 0,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export const connectWalletAndGetEthLogs = async (
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  setSelectedNetwork,
  web3provider,
  account,
  selectedNetwork
) => {
  await connectWallet(
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    setSelectedNetwork
  );
  await getEthLogs(web3provider, account, selectedNetwork);
};
