import faucetLogo from "../images/faucetIcon.png";
import usdLogo from "../images/usdIcon.png";
import wethLogo from "../images/wethIcon.png";
import wbtcLogo from "../images/wbtcLogo.png";
import maticLogo from "../images/maticIcon.png";

export interface TokenType {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logo: string;
  id: string;
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
          id: "usd-coin",
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          logo: faucetLogo,
          id: "weth",
        },
      ],
    },
    "0x8426654f17aee14540b5f6a0250d6f542c0258b1000200000000000000000709": {
      poolName: "MATIC/FAU",
      address: "0x8426654f17AeE14540B5f6A0250D6f542c0258b1",
      shortSwapFee: "0.05%",
      longSwapFee: "0.25%",
      LTOContract: "0xEae3B5dd2b659f8562106F98f52B1fb54d75F81D",
      blockInterval: 100,
      tokens: [
        {
          symbol: "MATIC",
          name: "Matic",
          decimals: 18,
          address: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          logo: maticLogo,
          id: "matic-network",
        },
        {
          symbol: "FAU",
          name: "Faucet",
          decimals: 18,
          address: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          logo: faucetLogo,
          id: "weth",
        },
      ],
    },
    "0x9f1f16b025f703ee985b58ced48daf93dad2f7ef000200000000000000000063": {
      poolName: "WETH/USDC",
      address: "0x9f1f16b025f703ee985b58ced48daf93dad2f7ef",
      shortSwapFee: "0.05%",
      longSwapFee: "0.25%",
      LTOContract: "0xEae3B5dd2b659f8562106F98f52B1fb54d75F81D",
      blockInterval: 100,
      tokens: [
        {
          symbol: "WETH",
          name: "WETH",
          decimals: 18,
          address: "0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1",
          logo: wethLogo,
          id: "weth",
        },
        {
          symbol: "USDC",
          name: "USDC",
          decimals: 6,
          address: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
          logo: usdLogo,
          id: "usd-coin",
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
      blockInterval: 100,
      tokens: [
        {
          symbol: "USDC",
          name: "USDC",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          logo: usdLogo,
          id: "usd-coin",
        },
        {
          symbol: "WETH",
          name: "WETH",
          decimals: 18,
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          logo: wethLogo,
          id: "weth",
        },
      ],
    },
    "0x31e97ba932074b4ebcc5e358dc8127ee03212bb20002000000000000000004df": {
      poolName: "USDC/WBTC",
      address: "0x31e97Ba932074B4EBcc5E358dC8127EE03212BB2",
      shortSwapFee: "0.05%",
      longSwapFee: "0.25%",
      LTOContract: "0x1D699e5CC7618CC3379951c05087C94C5C3452C4",
      blockInterval: 100,
      tokens: [
        {
          symbol: "WBTC",
          name: "WBTC",
          decimals: 8,
          address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          logo: wbtcLogo,
          id: "wrapped-bitcoin",
        },
        {
          symbol: "USDC",
          name: "USDC",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          logo: usdLogo,
          id: "usd-coin",
        },
      ],
    },
  },
};
