import faucetLogo from "../images/faucetIcon.png";
import daiLogo from "../images/daiIcon.png";
import maticLogo from "../images/maticIcon.png";
import usdLogo from "../images/usdIcon.png";
import wethLogo from "../images/wethIcon.png";

export const POOLS = {
  Goerli: {
    "0xdab1b8c505867ec1e7292b17d7a4b42b6e1626680002000000000000000002c1": {
      poolName: "MATIC/FAU",
      address: "0xdab1b8c505867ec1e7292b17d7a4b42b6e162668",
      fees: "0.3%",
      LTOContract: "0x04143AA32FB58bcB943dfF29C3aad9C51FcF9630",
      blockInterval: 150,
      tokens: [
        {
          symbol: "MATIC",
          name: "matic-network",
          decimals: 18,
          address: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          logo: maticLogo,
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          logo: faucetLogo,
        },
      ],
    },
    "0x20c0b25ace39df183b9ccbbd1d575764544aeb190002000000000000000001f8": {
      poolName: "DAI/FAU",
      address: "0x20c0b25ace39df183b9ccbbd1d575764544aeb19",
      fees: "0.5%",
      LTOContract: "0xC392dF9Ee383d6Bce110757FdE7762f0372f6A5D",
      blockInterval: 150,
      tokens: [
        {
          symbol: "DAI",
          name: "Dai",
          decimals: 18,
          address: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          logo: daiLogo,
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          logo: faucetLogo,
        },
      ],
    },
  },
  Ethereum: {
    "0xf7a3ffd8d6ae4b2564a18591d6f3783ec5f79d3a000200000000000000000417": {
      poolName: "USDC/WETH",
      address: "0xF7A3Ffd8d6aE4B2564A18591D6F3783ec5F79D3a",
      fees: "0.3%",
      LTOContract: "0x9D3f9803826EB51B046D4366a5cf7313308E7CDC",
      blockInterval: 150,
      tokens: [
        {
          symbol: "USDC",
          name: "USD",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          logo: usdLogo,
        },
        {
          symbol: "WETH",
          name: "WETH",
          decimals: 18,
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          logo: wethLogo,
        },
      ],
    },
  },
};
