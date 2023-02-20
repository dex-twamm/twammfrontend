import faucetLogo from "../images/faucetIcon.png";
import daiLogo from "../images/daiIcon.png";
import maticLogo from "../images/maticIcon.png";
import usdLogo from "../images/usdIcon.png";
import wethLogo from "../images/wethIcon.png";

export const POOLS = {
  Goerli: {
    "0xd01e3ddd9d6fe5d265468c8bd265d211ddc1b4c9000200000000000000000580": {
      poolName: "USDC/FAU",
      address: "0xd01e3ddd9d6fe5d265468c8bd265d211ddc1b4c9",
      fees: "0.05%",
      LTOContract: "0x353ba21b794187d14757c88cfacebd86c31a6eaf",
      blockInterval: 100,
      tokens: [
        {
          symbol: "USD/C",
          name: "USDC",
          decimals: 6,
          address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
          logo: usdLogo,
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
    "0x9f1f16b025f703ee985b58ced48daf93dad2f7ef000200000000000000000063": {
      poolName: "USDC/WETH",
      address: "0x9f1f16b025f703ee985b58ced48daf93dad2f7ef",
      fees: "0.3%",
      LTOContract: "0x9D3f9803826EB51B046D4366a5cf7313308E7CDC",
      blockInterval: 150,
      tokens: [
        {
          symbol: "WETH",
          name: "WETH",
          decimals: 18,
          address: "0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1",
          logo: wethLogo,
        },
        {
          symbol: "USDC",
          name: "USD",
          decimals: 6,
          address: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
          logo: usdLogo,
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
