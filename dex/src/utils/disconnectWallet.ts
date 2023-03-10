import { web3Modal } from "./providerOptions";
import { Dispatch, SetStateAction } from "react";

// Disconnect Wallet
export const disconnect = async (
  setAccount: Dispatch<SetStateAction<undefined>>,
  setWalletConnected: Dispatch<SetStateAction<boolean>>,
  setBalance: Dispatch<SetStateAction<undefined>>
): Promise<void> => {
  web3Modal.clearCachedProvider();
  setAccount(undefined);
  setWalletConnected(false);
  setBalance(undefined);
  localStorage.clear();
};
