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
      fees: "0.3%",
      LTOContract: "0x04143AA32FB58bcB943dfF29C3aad9C51FcF9630",
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
  Ethereum: {
    "0xf7a3ffd8d6ae4b2564a18591d6f3783ec5f79d3a000200000000000000000417": {
      VAULT_CONTRACT_ADDRESS: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      address: "0xF7A3Ffd8d6aE4B2564A18591D6F3783ec5F79D3a",
      balancerPoolUrl:
        "https://app.balancer.fi/#/pool/0xf7a3ffd8d6ae4b2564a18591d6f3783ec5f79d3a000200000000000000000417/invest",
      ethersScanUrl: "https://etherscan.io/address/",
      transactionUrl: "https://etherscan.io/tx/",
      fees: "0.3%",
      LTOContract: "0x9D3f9803826EB51B046D4366a5cf7313308E7CDC",
      TOKEN_ONE_ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      TOKEN_TWO_ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      tokens: [
        {
          symbol: "USDC",
          name: "USDC",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          logo: maticLogo,
        },
        {
          symbol: "WETH",
          name: "WETH",
          decimals: 18,
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          logo: ethLogo,
        },
      ],
    },
  },
};
