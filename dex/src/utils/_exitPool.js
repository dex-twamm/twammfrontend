import { ethers } from "ethers";
import { exitPool } from "./addLiquidity";
import { connectWallet } from "./connetWallet";

export const _exitPool = async (
  setLoading,
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
  setLoading(true);
  try {
    const bptAmountIn = ethers.utils.parseUnits("0.001", "ether");
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
    await exitPool(walletAddress, signer, bptAmountIn, currentNetwork).then(
      (res) => {
        const exitPoolResult = async () => {
          const result = await res.wait();
          return result;
        };
        //Todo- code as per the response from exitPoolResult goes here
        // ...
      }
    );
    setLoading(false);
  } catch (e) {
    console.log(e);
    setLoading(false);
  }
};
