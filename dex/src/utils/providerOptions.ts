import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "TWAMM",
      infuraId: process.env.INFURA_KEY,
    },
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: process.env.INFURA_KEY,
    },
  },
} as const;

export const web3Modal: Web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});
