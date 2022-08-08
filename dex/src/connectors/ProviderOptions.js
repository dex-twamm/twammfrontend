import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Web 3 Demo",
      infuraid: { 3: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}` },
    },
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraid: { 3: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}` },
    },
  },
};

export const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});
