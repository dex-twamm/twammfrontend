import { POPUP_MESSAGE } from "../constants";
import { cancelLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getProvider } from "./getProvider";

// cancelLTO
export const _cancelLTO = async (
  orderId,
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
  provider
) => {
  setLoading(true);
  setDisableActionBtn(true);
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
      await connectWallet();
    }
    await cancelLTO(
      walletAddress,
      signer,
      orderId,
      setOrderLogsDecoded,
      setMessage,
      provider
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
