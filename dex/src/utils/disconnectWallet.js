import { web3Modal } from "./providerOptions";

const refreshState = (setAccount, setWalletConnected, setBalance) => {
  setAccount();
  setWalletConnected(false);
  setBalance();
  localStorage.clear();
};

// Disconnect Wallet
export const disconnect = async (
  setShowDisconnect,
  setAccount,
  setWalletConnected,
  setBalance
) => {
  web3Modal.clearCachedProvider();
  refreshState(setAccount, setWalletConnected, setBalance);
  setShowDisconnect(false);
};
