import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { addPoolLiquidity } from "./addPoolLiquidity";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export const _addPoolLiquidity = async (
  walletAddress,
  web3provider,
  currentNetwork,
  amountsIn,
  setTransactionHash,
  setMessage,
  setLoading,
  setError,
  setShowPreviewModal
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
        addLiquidityResult(res).then(async (response) => {
          if (response.status === 1) {
            setMessage(POPUP_MESSAGE.liquidityAdded);
          } else setMessage(POPUP_MESSAGE.addliquidityFailed);
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage(POPUP_MESSAGE.addliquidityFailed);
      })
      .finally(setLoading(false));
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
