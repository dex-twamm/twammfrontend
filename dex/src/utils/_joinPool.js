import { joinPool } from "./addLiquidity";
import { connectWallet } from "./connetWallet";

export const _joinPool = async (
  account,
  web3provider,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  isWalletConnected,
  currentNetwork,
  setSelectedNetwork
) => {
  try {
    const walletAddress = account;
    const signer = web3provider.getSigner();
    if (!isWalletConnected) {
      await connectWallet(
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        setSelectedNetwork
      );
    }
    await joinPool(walletAddress, signer, currentNetwork);
  } catch (e) {
    console.log(e);
  }
};
