import { ethers } from "ethers";
import { exitPool } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getProvider } from "./getProvider";

export const _exitPool = async (
  setLoading,
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
  setLoading(true);
  try {
    const bptAmountIn = ethers.utils.parseUnits("0.001", "ether");
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
    await exitPool(walletAddress, signer, bptAmountIn, currentNetwork);
    setLoading(false);
  } catch (e) {
    console.log(e);
    setLoading(false);
  }
};
