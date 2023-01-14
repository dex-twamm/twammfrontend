import { web3Modal } from "./providerOptions";

// Disconnect Wallet
export const disconnect = async (
  setAccount,
  setWalletConnected,
  setBalance
) => {
  web3Modal.clearCachedProvider();
  setAccount();
  setWalletConnected(false);
  setBalance();
  localStorage.clear();
};
