import ethLogo from "../images/ethereum.svg";
import maticLogo from "../images/Testv4.svg";

export const POOLS = {
  Goerli: {
    "0xdab1b8c505867ec1e7292b17d7a4b42b6e1626680002000000000000000002c1": {
      VAULT_CONTRACT_ADDRESS: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      address: "0xdab1b8c505867ec1e7292b17d7a4b42b6e162668",
      balancerPoolUrl:
        "https://app.balancer.fi/#/pool/0xdab1b8c505867ec1e7292b17d7a4b42b6e1626680002000000000000000002c1/invest",
      ethersScanUrl: "https://goerli.etherscan.io/address/",
      transactionUrl: "https://goerli.etherscan.io/tx/",
      fees: 0.5,
      LTOContract: "0x04143AA32FB58bcB943dfF29C3aad9C51FcF9630",
      TOKEN_ONE_ADDRESS: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
      TOKEN_TWO_ADDRESS: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
      tokens: [
        {
          symbol: "MATIC",
          name: "Matic",
          decimals: 18,
          address: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          image: "Testv4.jpeg",
          logo: maticLogo,
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          image: "ethereum.png",
          logo: ethLogo,
        },
      ],
    },
  },
  Ethereum: {
    "0x20c0b25ace39df183b9ccbbd1d575764544aeb190002000000000000000001f8": {
      VAULT_CONTRACT_ADDRESS: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      address: "0x20c0b25ace39df183b9ccbbd1d575764544aeb19",
      balancerPoolUrl:
        "https://app.balancer.fi/#/pool/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014/invest",
      ethersScanUrl: "https://goerli.etherscan.io/address/",
      transactionUrl: "https://goerli.etherscan.io/tx/",
      fees: 0.5,
      LTOContract: "0xC392dF9Ee383d6Bce110757FdE7762f0372f6A5D",
      TOKEN_ONE_ADDRESS: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
      TOKEN_TWO_ADDRESS: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
      tokens: [
        {
          symbol: "MATIC",
          name: "Matic",
          decimals: 18,
          address: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          logo: maticLogo,
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          logo: ethLogo,
        },
      ],
    },
  },
};
