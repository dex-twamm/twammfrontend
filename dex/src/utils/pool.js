import ethLogo from "../images/ethereum.svg";
import maticLogo from "../images/Testv4.svg";

export const POOLS = {
  Goerli: {
    "0xdab1b8c505867ec1e7292b17d7a4b42b6e1626680002000000000000000002c1": {
      address: "0xdab1b8c505867ec1e7292b17d7a4b42b6e162668",
      fees: "0.3%",
      LTOContract: "0x04143AA32FB58bcB943dfF29C3aad9C51FcF9630",
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
    "0x028e3e920996e443d12e410d62874cebdd3618070002000000000000000003eb": {
      address: "0x028e3e920996e443d12e410d62874cebdd361807",
      fees: "0.3%",
      LTOContract: "0xB9d9e972100a1dD01cd441774b45b5821e136043",
      tokens: [
        {
          symbol: "DAI",
          name: "Dai",
          decimals: 18,
          address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          logo: ethLogo,
        },
        {
          symbol: "USDC",
          name: "USDC",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          logo: maticLogo,
        },
      ],
    },
  },
};
