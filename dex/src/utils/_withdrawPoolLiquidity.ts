import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getPoolId, getPoolTokenAddresses } from "./poolUtils";
import { withdrawPoolLiquidity } from "./withdrawPoolLiquidity";
import { BigNumber, providers } from "ethers";

export const _withdrawPoolLiquidity = async (
  walletAddress: string,
  web3provider: providers.Web3Provider,
  currentNetwork: SelectedNetworkType,
  bptAmountIn: BigNumber,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setMessage: Dispatch<SetStateAction<{ status: string; message: string }>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
  setShowPreviewModal: Dispatch<SetStateAction<boolean>>,
  selectValue: number
) => {
  try {
    const poolId = getPoolId(currentNetwork);
    const tokenIn = getPoolTokenAddresses(currentNetwork);

    setLoading(true);

    await withdrawPoolLiquidity(
      selectValue,
      poolId,
      tokenIn,
      bptAmountIn,
      walletAddress,
      web3provider,
      currentNetwork
    )
      .then((res) => {
        setShowPreviewModal(false);
        setTransactionHash(res.hash);
        const addLiquidityResult = async () => {
          const result = await res.wait();
          return result;
        };
        addLiquidityResult().then(async (response) => {
          if (response.status === 1) {
            setMessage({
              status: "success",
              message: POPUP_MESSAGE.liquidityWithdrawn,
            });
          } else
            setMessage({
              status: "failed",
              message: POPUP_MESSAGE.withdrawLiquidityFailed,
            });
          setLoading(false);
        });
      })
      .catch((err) => {
        setShowPreviewModal(false);
        console.error(err);
        setMessage({
          status: "failed",
          message: POPUP_MESSAGE.withdrawLiquidityFailed,
        });
      });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setMessage({
      status: "failed",
      message: POPUP_MESSAGE.transactionCancelled,
    });
    setShowPreviewModal(false);
  }
};
