import { ethers, BigNumber } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getEthLogs } from "./get_ethLogs";
import { placeLongTermOrder } from "./longSwap";
import { PoolType } from "./pool";
import { getPoolConfig } from "./poolUtils";

export const _placeLongTermOrders = async (
  swapAmount: number,
  tokenA: string,
  tokenB: string,
  numberOfBlockIntervals: number,
  web3provider: any,
  account: string,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setError: Dispatch<SetStateAction<string>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  const poolConfig: PoolType = getPoolConfig(currentNetwork);

  try {
    const tokenInIndex: number = poolConfig?.tokens.findIndex(
      (object) => tokenA === object.address
    );
    const tokenOutIndex: number = poolConfig?.tokens.findIndex(
      (object) => tokenB === object.address
    );
    const amountIn: BigNumber = ethers.utils.parseUnits(
      swapAmount.toString(),
      poolConfig?.tokens[tokenInIndex].decimals
    );
    const blockIntervals: number = Math.ceil(numberOfBlockIntervals);

    const signer: any = web3provider.getSigner();

    const walletAddress: string = account;
    // Call the PlaceLongTermOrders function from the `utils` folder*
    await placeLongTermOrder(
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      blockIntervals,
      signer,
      walletAddress,
      currentNetwork
    )
      .then((res) => {
        setTransactionHash(res.hash);
        const placeLtoTxResult = async (res: any) => {
          const result = await res.wait();
          return result;
        };
        placeLtoTxResult(res).then(async (response) => {
          if (response.status === 1) {
            await getEthLogs(signer, walletAddress, currentNetwork).then(
              (res) => {
                const resArray = Array.from(res.values());
                setOrderLogsDecoded(resArray);
              }
            );
            setMessage(POPUP_MESSAGE.ltoPlaced);
          } else setMessage(POPUP_MESSAGE.ltoPlaceFailed);
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage(POPUP_MESSAGE.ltoPlaceFailed);
      })
      .finally(() => {
        setLoading(false);
      });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
