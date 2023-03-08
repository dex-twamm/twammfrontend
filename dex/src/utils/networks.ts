import ethLogo from "../images/ethereumIcon.png";
import goerliLogo from "../images/maticIcon.png";

interface Networks {
  name: string;
  chainId: string;
  logo: string;
  vaultAddress: string;
  blockExplorerUrl: string;
  transactionUrl: string;
  balancerHelperAddress: string;
}
export const NETWORKS: Networks[] = [
  {
    name: "Ethereum",
    chainId: "1",
    logo: ethLogo,
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    blockExplorerUrl: "https://etherscan.io/address/",
    transactionUrl: "https://etherscan.io/tx/",
    balancerHelperAddress: "0x5aDDCCa35b7A0D07C74063c48700C8590E87864E",
  },
  {
    name: "Goerli",
    chainId: "5",
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    blockExplorerUrl: "https://goerli.etherscan.io/address/",
    transactionUrl: "https://goerli.etherscan.io/tx/",
    balancerHelperAddress: "0x5aDDCCa35b7A0D07C74063c48700C8590E87864E",
    logo: goerliLogo,
  },
];
