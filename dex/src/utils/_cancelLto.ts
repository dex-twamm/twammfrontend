import { POPUP_MESSAGE } from "../constants";
import { Dispatch, SetStateAction } from "react";
import { cancelLTO } from "./addLiquidity";
import { connectWallet } from "./connectWallet";
import { getEthLogs } from "./getEthLogs";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";

// cancelLTO
export const _cancelLTO = async (
  orderId: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDisableActionBtn: Dispatch<SetStateAction<boolean>>,
  account: string,
  web3provider: any,
  setWeb3provider: Dispatch<SetStateAction<any>>,
  setCurrentBlock: Dispatch<SetStateAction<any>>,
  setBalance: Dispatch<SetStateAction<number>>,
  setAccount: Dispatch<SetStateAction<string>>,
  setWalletConnected: Dispatch<SetStateAction<boolean>>,
  isWalletConnected: boolean,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  currentNetwork: SelectedNetworkType,
  setSelectedNetwork: Dispatch<SetStateAction<SelectedNetworkType>>
): Promise<void> => {
  setLoading(true);
  setDisableActionBtn(true);
  try {
    const walletAddress = account;
    if (!isWalletConnected) {
      connectWallet().then((res) => {
        const {
          account,
          balance,
          currentBlock,
          selectedNetwork,
          web3Provider,
        } = res;
        setWeb3provider(web3Provider);
        setCurrentBlock(currentBlock);
        setBalance(balance);
        setAccount(account);
        setWalletConnected(true);
        setSelectedNetwork(selectedNetwork);
      });
    }
    const signer: any = web3provider.getSigner();
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
