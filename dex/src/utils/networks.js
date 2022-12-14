import ethLogo from "../images/ethereum.svg";
import goerliLogo from "../images/Testv4.svg";

export const NETWORKS = [
  {
    name: "Ethereum",
    chainId: "1",
    logo: ethLogo,
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    blockExplorerUrl: "https://etherscan.io/address/",
    transactionUrl: "https://etherscan.io/tx/",
  },
  {
    name: "Goerli",
    chainId: "5",
    logo: goerliLogo,
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    blockExplorerUrl: "https://goerli.etherscan.io/address/",
    transactionUrl: "https://goerli.etherscan.io/tx/",
  },
];
