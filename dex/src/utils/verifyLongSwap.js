import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getLongSwapEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";
import { POOLS } from "./pool";

export const verifyLongSwap = async (
  swapAmount,
  setLongSwapVerifyLoading,
  srcAddress,
  destAddress,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  account,
  setLongSwapFormErrors,
  currentNetwork,
  numberOfBlockIntervals
) => {
  if (swapAmount) {
    setLongSwapVerifyLoading(true);

    const poolConfig = Object.values(POOLS[currentNetwork])[0];

    const errors = {};

    const signer = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
    const walletAddress = account;

    try {
      const tokenInIndex = poolConfig.tokens.findIndex(
        (object) => srcAddress === object.address
      );
      const tokenOutIndex = poolConfig.tokens.findIndex(
        (object) => destAddress === object.address
      );
      const amountIn = ethers.utils.parseUnits(
        swapAmount,
        poolConfig.tokens[tokenInIndex].decimals
      );
      await getLongSwapEstimatedConvertedToken(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer,
        walletAddress,
        (currentNetwork = "Goerli")
      ).then((res) => {
        console.log("Response From Query Batch Swap", res);
        errors.balError = undefined;
        setLongSwapFormErrors(errors ?? "");
        setLongSwapVerifyLoading(false);
      });
    } catch (e) {
      setLongSwapVerifyLoading(false);
      console.log("errororrrrrrrr", typeof e, { ...e });
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        }
        if (e.reason.match("BAL#347")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#347"],
          });
        }
        if (e.reason.match("BAL#346")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#346"],
          });
        }
        if (e.reason.match("BAL#510")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        }
        if (e.reason === "underflow") {
          setLongSwapFormErrors({ balError: "Underflow" });
        }
        if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setLongSwapVerifyLoading(false);
          errors.balError = undefined;
          setLongSwapFormErrors(errors ?? "");
        }
      } else {
        setLongSwapFormErrors({
          balError: POPUP_MESSAGE.unknown,
        });
      }
      setLongSwapVerifyLoading(false);
    }
  }
};
