import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { POOLS } from "./pool";
import { swapTokens } from "./swap";

export const _swapTokens = async (
  ethBalance,
  poolCash,
  swapAmount,
  web3provider,
  srcAddress,
  destAddress,
  account,
  expectedSwapOut,
  tolerance,
  deadline,
  setTransactionHash,
  setSuccess,
  setError,
  setLoading,
  currentNetwork
) => {
  const poolConfig = Object.values(POOLS[currentNetwork])[0];
  const tokenIn = poolConfig.tokens.find(
    (token) => token.address === srcAddress
  );

  const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);
  const walletBalanceWei = ethers.utils.parseUnits(
    ethBalance,
    tokenIn.decimals
  );
  const pCash = ethers.utils.parseUnits(poolCash, tokenIn.decimals);

  console.log(
    "walletBalanceWeisdasd",
    walletBalanceWei.toString(),
    pCash.toString(),
    swapAmountWei.toString()
  );
  if (swapAmountWei.lte(walletBalanceWei)) {
    try {
      const signer = web3provider.getSigner();
      const assetIn = srcAddress;
      const assetOut = destAddress;
      const walletAddress = account;

      console.log("hkhaskhaskjdasd", currentNetwork);
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
          console.log("Responseeeee----->", res);
          setTransactionHash(res.hash);
          const swapResult = async (res) => {
            const result = await res.wait();
            return result;
          };
          swapResult(res).then((response) => {
            console.log("Responseeeeeee", response);
            if (response.status === 1)
              setSuccess(POPUP_MESSAGE.shortSwapSuccess);
          });
        })
        .catch((err) => {
          console.error("error on swap", err);
          setError(POPUP_MESSAGE.shortSwapFailed);
        });
      setLoading(false);
    } catch (err) {
      console.error("errorr on swap", err);
      setLoading(false);
      setError(POPUP_MESSAGE.transactionCancelled);
    }
  } else {
    setLoading(false);
    setError(POPUP_MESSAGE.insufficientBalance);
  }
};
