import { POPUP_MESSAGE } from "../constants";
import { getPoolId, getPoolTokenAddresses } from "./poolUtils";
import { withdrawPoolLiquidity } from "./withdrawPoolLiquidity";

export const _withdrawPoolLiquidity = async (
  walletAddress,
  web3provider,
  currentNetwork,
  bptAmountIn,
  setTransactionHash,
  setMessage,
  setLoading,
  setError
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
        setTransactionHash(res.hash);
        const addLiquidityResult = async () => {
          const result = await res.wait();
          console.log("data after wait", result);
          return result;
        };
        addLiquidityResult(res).then(async (response) => {
          if (response.status === 1) {
            setMessage(POPUP_MESSAGE.liquidityWithdrawn);
          } else setMessage(POPUP_MESSAGE.withdrawliquidityFailed);
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
