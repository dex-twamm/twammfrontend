import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getPoolConfig } from "./poolUtils";
import { swapTokens } from "./swap";

export const _swapTokens = async (
  ethBalance,
  swapAmount,
  web3provider,
  tokenA,
  tokenB,
  account,
  deadline,
  setTransactionHash,
  setSuccess,
  setError,
  setLoading,
  currentNetwork
) => {
  const poolConfig = getPoolConfig(currentNetwork);
  const tokenIn = poolConfig.tokens.find((token) => token.address === tokenA);

  const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);
  const walletBalanceWei = ethers.utils.parseUnits(
    ethBalance,
    tokenIn.decimals
  );

  console.log(swapAmount, swapAmountWei);

  if (swapAmountWei.lte(walletBalanceWei)) {
    try {
      const signer = web3provider.getSigner();
      const assetIn = tokenA;
      const assetOut = tokenB;
      const walletAddress = account;

      // Call the swapTokens function from the `utils` folder
      await swapTokens(
        signer,
        swapAmountWei,
        assetIn,
        assetOut,
        walletAddress,
        deadline,
        currentNetwork
      )
        .then((res) => {
          setTransactionHash(res.hash);
          const swapResult = async (res) => {
            const result = await res.wait();
            return result;
          };
          swapResult(res).then((response) => {
            if (response.status === 1)
              setSuccess(POPUP_MESSAGE.shortSwapSuccess);
          });
        })
        .catch((err) => {
          setError(POPUP_MESSAGE.shortSwapFailed);
        });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(POPUP_MESSAGE.transactionCancelled);
    }
  } else {
    setLoading(false);
    setError(POPUP_MESSAGE.insufficientBalance);
  }
};
