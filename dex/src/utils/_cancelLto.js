import { POPUP_MESSAGE } from "../constants";
import { cancelLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";

// cancelLTO
export const _cancelLTO = async (
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
  setLoading(true);
  setDisableActionBtn(true);
  try {
    const walletAddress = account;
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
    await cancelLTO(
      walletAddress,
      web3provider.getSigner(),
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
    setMessage(POPUP_MESSAGE.ltoCancelFailed);
    setLoading(false);
    setDisableActionBtn(false);
  }
};
