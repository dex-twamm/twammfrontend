import { ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { addPoolLiquidity } from "./addPoolLiquidity";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export const _addPoolLiquidity = async (
  walletAddress: string,
  web3provider: any,
  currentNetwork: SelectedNetworkType,
  amountsIn: number[],
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
  setShowPreviewModal: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const poolId = getPoolId(currentNetwork);
    const tokenIn = getPoolTokenAddresses(currentNetwork);
    const tokens = getPoolTokens(currentNetwork);

    const tokenOneAmountWei = ethers.utils.parseUnits(
      amountsIn[0].toString(),
      tokens[0].decimals
    );

    const tokenTwoAmountWei = ethers.utils.parseUnits(
      amountsIn[1].toString(),
      tokens[1].decimals
    );

    setLoading(true);

    await addPoolLiquidity(
      poolId,
      tokenIn,
      tokenOneAmountWei,
      tokenTwoAmountWei,
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
            setMessage(POPUP_MESSAGE.liquidityAdded);
          } else setMessage(POPUP_MESSAGE.addLiquidityFailed);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error(err);
        setShowPreviewModal(false);
        setMessage(POPUP_MESSAGE.addLiquidityFailed);
      });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setShowPreviewModal(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
