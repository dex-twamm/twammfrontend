import { POPUP_MESSAGE } from "../constants";
import { withdrawLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getProvider } from "./getProvider";

export const _withdrawLTO = async (
  orderId,
  orderHash,
  setLoading,
  setDisableActionBtn,
  account,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  isWalletConnected,
  setOrderLogsDecoded,
  setMessage,
  provider,
  setTransactionHash
) => {
  console.log("Order Id", orderId);
  setDisableActionBtn(true);
  setLoading(true);
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
        setWalletConnected
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
      provider
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
