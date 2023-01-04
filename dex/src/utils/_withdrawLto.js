import { POPUP_MESSAGE } from "../constants";
import { withdrawLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getEthLogs } from "./get_ethLogs";

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
  setSelectedNetwork
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
      currentNetwork
    ).then((res) => {
      const withdrawLTOResult = async (res) => {
        const result = await res.wait();
        return result;
      };
      withdrawLTOResult(res).then(async (response) => {
        if (response.status === 1) {
          await getEthLogs(signer, walletAddress, currentNetwork).then(
            (res) => {
              const resArray = Array.from(res.values());
              setOrderLogsDecoded(resArray);
            }
          );
          setMessage(POPUP_MESSAGE.ltoWithdrawn);
        } else setMessage(POPUP_MESSAGE.ltoWithdrawFailed);
      });
    });
    setLoading(false);
    setDisableActionBtn(false);
  } catch (e) {
    console.log(e);
    setMessage(POPUP_MESSAGE.ltoWithdrawFailed);
    setLoading(false);
    setDisableActionBtn(false);
  }
};
