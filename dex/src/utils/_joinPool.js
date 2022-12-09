import { joinPool } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getProvider } from "./getProvider";

export const _joinPool = async (
  account,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  isWalletConnected,
  currentNetwork,
  setSelectedNetwork,
  nId
) => {
  try {
    const walletAddress = account;
    const signer = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
    if (!isWalletConnected) {
      await connectWallet(
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        setSelectedNetwork,
        nId
      );
    }
    await joinPool(walletAddress, signer, currentNetwork);
  } catch (e) {
    console.log(e);
  }
};
