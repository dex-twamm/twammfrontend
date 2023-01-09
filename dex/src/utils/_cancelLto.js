import { POPUP_MESSAGE } from "../constants";
import { cancelLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getEthLogs } from "./get_ethLogs";

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
  poolNumber
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
    const signer = web3provider.getSigner();
    await cancelLTO(
      walletAddress,
      web3provider.getSigner(),
      orderId,
      orderHash,
      setTransactionHash,
      currentNetwork,
      poolNumber
    ).then((res) => {
      const exitPoolResult = async (res) => {
        const result = await res.wait();
        return result;
      };
      exitPoolResult(res).then(async (response) => {
        if (response.status === 1) {
          await getEthLogs(
            signer,
            walletAddress,
            currentNetwork,
            poolNumber
          ).then((res) => {
            const resArray = Array.from(res.values());
            setOrderLogsDecoded(resArray);
          });
          setMessage(POPUP_MESSAGE.ltoCancelSuccess);
        } else setMessage(POPUP_MESSAGE.ltoCancelFailed);
        setDisableActionBtn(false);
      });
    });
    setLoading(false);
  } catch (e) {
    console.log(e);
    setMessage(POPUP_MESSAGE.ltoCancelFailed);
    setLoading(false);
    setDisableActionBtn(false);
  }
};
