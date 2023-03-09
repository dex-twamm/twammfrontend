import { POPUP_MESSAGE } from "../constants";
import { Dispatch, SetStateAction } from "react";
import { withdrawLTO } from "./addLiquidity";
import { connectWallet } from "./connetWallet";
import { getEthLogs } from "./get_ethLogs";

export const _withdrawLTO = async (
  orderId: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDisableActionBtn: Dispatch<SetStateAction<boolean>>,
  account: string,
  web3provider: any,
  setweb3provider: Dispatch<SetStateAction<any>>,
  setCurrentBlock: Dispatch<SetStateAction<any>>,
  setBalance: Dispatch<SetStateAction<number>>,
  setAccount: Dispatch<SetStateAction<string>>,
  setWalletConnected: Dispatch<SetStateAction<boolean>>,
  isWalletConnected: boolean,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  currentNetwork: { network: string; poolId: number },
  setSelectedNetwork: Dispatch<
    SetStateAction<{ network: string; poolId: number }>
  >
): Promise<void> => {
  setDisableActionBtn(true);
  setLoading(true);
  try {
    const walletAddress: string = account;
    const signer: any = web3provider.getSigner();
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

    await withdrawLTO(walletAddress, signer, orderId, currentNetwork).then(
      (res) => {
        setTransactionHash(res.hash);
        const withdrawLTOResult = async (res: any) => {
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
          setDisableActionBtn(false);
        });
      }
    );
    setLoading(false);
  } catch (e) {
    console.log(e);
    setMessage(POPUP_MESSAGE.ltoWithdrawFailed);
    setLoading(false);
    setDisableActionBtn(false);
  }
};
