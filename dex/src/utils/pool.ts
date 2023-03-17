import faucetLogo from "../images/faucetIcon.png";
import usdLogo from "../images/usdIcon.png";
import wethLogo from "../images/wethIcon.png";

export interface TokenType {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logo: string;
}

export interface PoolType {
  poolName: string;
  address: string;
  shortSwapFee: string;
  longSwapFee: string;
  LTOContract: string;
  blockInterval: number;
  tokens: TokenType[];
}

interface PoolsType {
  [key: string]: {
    [key: string]: PoolType;
  };
}

export const POOLS: PoolsType = {
  Goerli: {
    "0xaafe31bc7142eb1ce35be2bf903b1a1a8d41cdc80002000000000000000006b7": {
      poolName: "USDC/FAU",
      address: "0xaAfe31BC7142EB1cE35Be2bf903B1a1A8D41Cdc8",
      shortSwapFee: "0.05%",
      longSwapFee: "0.25%",
      LTOContract: "0x6c9bb879Bb73f5E816766Dc95CA8A2CC2310c2DB",
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
  },
  Ethereum: {
    "0xaf15e6cbe19e30be827f27069cf010b57ce9f3ae0002000000000000000004d3": {
      poolName: "USDC/WETH",
      address: "0xAF15E6CBE19e30BE827F27069CF010B57ce9f3Ae",
      shortSwapFee: "0.05%",
      longSwapFee: "0.25%",
      LTOContract: "0x34572b0d2f397dFE236FC1E7832d0F80871c8c82",
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
