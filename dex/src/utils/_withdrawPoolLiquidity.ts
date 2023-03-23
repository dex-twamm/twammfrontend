import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getPoolId, getPoolTokenAddresses } from "./poolUtils";
import { withdrawPoolLiquidity } from "./withdrawPoolLiquidity";

export const _withdrawPoolLiquidity = async (
  walletAddress: string,
  web3provider: any,
  currentNetwork: SelectedNetworkType,
  bptAmountIn: number,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
  setShowPreviewModal: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const poolId = getPoolId(currentNetwork);
    const tokenIn = getPoolTokenAddresses(currentNetwork);

    await withdrawPoolLiquidity(
      poolId,
      tokenIn,
      bptAmountIn,
      walletAddress,
      web3provider,
      currentNetwork
    )
      .then((res) => {
        console.log("res", res);
        setShowPreviewModal(false);
        setTransactionHash(res.hash);
        const addLiquidityResult = async () => {
          const result = await res.wait();
          console.log("data after wait", result);
          return result;
        };
        addLiquidityResult().then(async (response) => {
          if (response.status === 1) {
            setMessage(POPUP_MESSAGE.liquidityWithdrawn);
          } else setMessage(POPUP_MESSAGE.withdrawLiquidityFailed);
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage(POPUP_MESSAGE.addLiquidityFailed);
      })
      .finally(() => setLoading(false));
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
