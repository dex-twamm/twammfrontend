import ethLogo from "../images/ethereumIcon.png";
import goerliLogo from "../images/maticIcon.png";

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
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    blockExplorerUrl: "https://goerli.etherscan.io/address/",
    transactionUrl: "https://goerli.etherscan.io/tx/",
    logo: goerliLogo,
  },
];
