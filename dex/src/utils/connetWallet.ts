import { ethers, providers } from "ethers";
import { getEthLogs } from "./get_ethLogs";
import { NETWORKS } from "./networks";
import { web3Modal } from "./providerOptions";
import { getEthereumFromWindow } from "./ethereum";
import ethLogo from "../images/ethereum.svg";

const getNetwork = async () => {
  const ethereum = getEthereumFromWindow();
  const net_version = await ethereum?.request?.({ method: "net_version" });
  const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version) ?? {
    name: "Ethereum",
    chainId: "1",
    logo: ethLogo,
    poolId: 0,
  };
  return initialNetwork;
};

export const connectWallet = async () => {
  const provider = await web3Modal.connect();
  const web3Provider = new providers.Web3Provider(provider, "any");
  const accounts = await web3Provider.listAccounts();

  const walletBalance = await web3Provider.getBalance(accounts[0]);
  const ethBalance = ethers.utils.formatEther(walletBalance);
  const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
  localStorage.setItem("account", accounts[0]);
  localStorage.setItem("balance", humanFriendlyBalance);
  localStorage.setItem("walletConnection", web3Provider?.connection?.url);

  const network = await getNetwork();

  const currentBlock = await web3Provider.getBlock("latest");
  return {
    account: accounts[0],
    web3Provider,
    currentBlock,
    balance: parseFloat(humanFriendlyBalance),
    selectedNetwork: {
      network: network.name,
      logo: network.logo,
      chainId: network.chainId,
      poolId: localStorage.getItem("poolId")
        ? parseFloat(localStorage.getItem("poolId")!)
        : 0,
    },
  };
};

export const connectWalletAndGetEthLogs = async () => {
  const { web3Provider, account, selectedNetwork } = await connectWallet();
  await getEthLogs(web3Provider, account, selectedNetwork);
};
