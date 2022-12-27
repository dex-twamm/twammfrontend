import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getPoolConfig } from "./poolUtils";
import { swapTokens } from "./swap";

export const _swapTokens = async (
  ethBalance: any,
  poolCash: any,
  swapAmount: any,
  web3provider: any,
  tokenA: string,
  tokenB: any,
  account: any,
  expectedSwapOut: any,
  tolerance: any,
  deadline: any,
  setTransactionHash: any,
  setSuccess: any,
  setError: any,
  setLoading: any,
  currentNetwork: any
) => {
  const poolConfig = getPoolConfig(currentNetwork);
  const tokenIn = poolConfig.tokens.find(
    (token: any) => token.address === tokenA
  );

  console.log("Token innnn", poolConfig, tokenA, swapAmount);

  const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);
  const walletBalanceWei = ethers.utils.parseUnits(
    ethBalance,
    tokenIn.decimals
  );
  const pCash = ethers.utils.parseUnits(poolCash, tokenIn.decimals);

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
        expectedSwapOut,
        tolerance,
        deadline,
        currentNetwork
      )
        .then((res) => {
          setTransactionHash(res.hash);
          const swapResult = async (res: any) => {
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
