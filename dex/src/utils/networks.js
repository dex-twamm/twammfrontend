import ethLogo from "../images/ethereum.svg";
import goerliLogo from "../images/Testv4.svg";

export const NETWORKS = [
  {
    name: "Ethereum",
    chainId: "1",
    logo: ethLogo,
    blockExplorerUrl: "https://etherscan.io/address/",
  },
  {
    name: "Goerli",
    chainId: "5",
    logo: goerliLogo,
    blockExplorerUrl: "https://goerli.etherscan.io/address/",
  },
];
