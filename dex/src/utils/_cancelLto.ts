import { POPUP_MESSAGE } from "../constants";
import { Dispatch, SetStateAction } from "react";
import { cancelLTO } from "./manageLtoOrders";
import { getEthLogs } from "./getEthLogs";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { providers } from "ethers";

// cancelLTO
export const _cancelLTO = async (
  orderId: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDisableActionBtn: Dispatch<SetStateAction<boolean>>,
  account: string,
  web3provider: providers.Web3Provider,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  setLoading(true);
  setDisableActionBtn(true);
  try {
    const walletAddress = account;
    const signer = web3provider.getSigner();
    await cancelLTO(
      walletAddress,
      web3provider.getSigner(),
      orderId,
      currentNetwork
    ).then((res) => {
      setTransactionHash(res.hash);
      const exitPoolResult = async (res: any) => {
        const result = await res.wait();
        return result;
      };
      exitPoolResult(res).then(async (response) => {
        if (response.status === 1) {
          await getEthLogs(signer, walletAddress, currentNetwork).then(
            (res) => {
              const resArray = Array.from(res.values());
              setOrderLogsDecoded(resArray);
            }
          );
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
