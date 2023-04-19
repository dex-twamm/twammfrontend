import { POPUP_MESSAGE } from "../constants";
import { Dispatch, SetStateAction } from "react";
import { withdrawLTO } from "./manageLtoOrders";
import { getEthLogs } from "./getEthLogs";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { providers } from "ethers";

export const _withdrawLTO = async (
  orderId: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDisableActionBtn: Dispatch<SetStateAction<boolean>>,
  account: string,
  web3provider: providers.Web3Provider,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setMessage: Dispatch<SetStateAction<{ status: string; message: string }>>,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  setDisableActionBtn(true);
  setLoading(true);
  try {
    const walletAddress: string = account;
    const signer = web3provider.getSigner();

    const response = await withdrawLTO(
      walletAddress,
      signer,
      orderId,
      currentNetwork
    );
    setTransactionHash(response.hash);
    const result = await response.wait();

    if (result.status === 1) {
      await getEthLogs(signer, walletAddress, currentNetwork).then((res) => {
        const resArray = Array.from(res.values());
        setOrderLogsDecoded(resArray);
      });
      setMessage({
        status: "success",
        message: POPUP_MESSAGE.ltoWithdrawn,
      });
    } else
      setMessage({
        status: "failed",
        message: POPUP_MESSAGE.ltoWithdrawFailed,
      });
    setDisableActionBtn(false);
    setLoading(false);
  } catch (e) {
    console.log(e);
    setMessage({
      status: "failed",
      message: POPUP_MESSAGE.transactionCancelled,
    });
    setLoading(false);
    setDisableActionBtn(false);
  }
};
