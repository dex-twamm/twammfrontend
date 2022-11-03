import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "TWAMM",
      infuraid: { 3: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}` },
    },
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraid: { 3: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}` },
    },
  },
};

export const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});
