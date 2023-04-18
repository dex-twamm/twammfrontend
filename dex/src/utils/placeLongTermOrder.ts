import { ethers, BigNumber, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getEthLogs } from "./getEthLogs";
import { placeLongTermOrder } from "./longSwap";
import { getPoolTokens } from "./poolUtils";

export const _placeLongTermOrders = async (
  swapAmount: number,
  tokenA: string,
  tokenB: string,
  numberOfBlockIntervals: number,
  web3provider: providers.Web3Provider,
  account: string,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setMessage: Dispatch<SetStateAction<{ status: string; message: string }>>,
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>,
  setError: Dispatch<SetStateAction<string>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  const tokens = getPoolTokens(currentNetwork);

  try {
    const tokenInIndex: number = tokens.findIndex(
      (object) => tokenA === object.address
    );
    const tokenOutIndex: number = tokens.findIndex(
      (object) => tokenB === object.address
    );
    const amountIn: BigNumber = ethers.utils.parseUnits(
      swapAmount.toString(),
      tokens[tokenInIndex].decimals
    );
    const blockIntervals: number = Math.ceil(numberOfBlockIntervals);

    const signer = web3provider.getSigner();

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
            setMessage({ status: "success", message: POPUP_MESSAGE.ltoPlaced });
          } else
            setMessage({
              status: "failed",
              message: POPUP_MESSAGE.ltoPlaceFailed,
            });
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage({ status: "failed", message: POPUP_MESSAGE.ltoPlaceFailed });
      })
      .finally(() => {
        setLoading(false);
      });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setMessage({
      status: "failed",
      message: POPUP_MESSAGE.transactionCancelled,
    });
  }
};
