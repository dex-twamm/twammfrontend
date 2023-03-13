import { web3Modal } from "./providerOptions";
import { Dispatch, SetStateAction } from "react";

// Disconnect Wallet
export const disconnect = async (
  setAccount: Dispatch<SetStateAction<string>>,
  setWalletConnected: Dispatch<SetStateAction<boolean>>,
  setBalance: Dispatch<SetStateAction<number | undefined>>
): Promise<void> => {
  web3Modal.clearCachedProvider();
  setAccount("");
  setWalletConnected(false);
  setBalance(undefined);
  localStorage.clear();
};
