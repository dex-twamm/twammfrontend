import { POPUP_MESSAGE } from "../constants";
import { withdrawLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";

export const _withdrawLTO = async (
  orderId,
  orderHash,
  setLoading,
  setDisableActionBtn,
  account,
  web3provider,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  isWalletConnected,
  setOrderLogsDecoded,
  setMessage,
  setTransactionHash,
  currentNetwork,
  setSelectedNetwork,
  nId
) => {
  setDisableActionBtn(true);
  setLoading(true);
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

    await withdrawLTO(
      walletAddress,
      signer,
      orderId,
      orderHash,
      setTransactionHash,
      setOrderLogsDecoded,
      setMessage,
      web3provider,
      currentNetwork
    );
    setLoading(false);
    setDisableActionBtn(false);
  } catch (e) {
    console.log(e);
    setMessage(POPUP_MESSAGE.ltoWithdrawFailed);
    setLoading(false);
    setDisableActionBtn(false);
  }
};
