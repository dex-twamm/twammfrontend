import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { verifyLongSwapTxn } from "./longSwap";
import { getPoolConfig } from "./poolUtils";

export const verifyLongSwap = async (
  swapAmount,
  setLongSwapVerifyLoading,
  tokenA,
  tokenB,
  web3provider,
  account,
  setLongSwapFormErrors,
  currentNetwork,
  numberOfBlockIntervals,
  poolNumber
) => {
  if (swapAmount && numberOfBlockIntervals) {
    setLongSwapVerifyLoading(true);

    const poolConfig = getPoolConfig(currentNetwork, poolNumber);

    const errors = {};

    const signer = web3provider.getSigner();
    const walletAddress = account;

    try {
      const tokenInIndex = poolConfig.tokens.findIndex(
        (object) => tokenA === object.address
      );
      const tokenOutIndex = poolConfig.tokens.findIndex(
        (object) => tokenB === object.address
      );
      const amountIn = ethers.utils.parseUnits(
        swapAmount,
        poolConfig.tokens[tokenInIndex].decimals
      );
      await verifyLongSwapTxn(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer,
        walletAddress,
        currentNetwork
      ).then((res) => {
        errors.balError = undefined;
        setLongSwapFormErrors(errors ?? "");
        setLongSwapVerifyLoading(false);
      });
    } catch (e) {
      setLongSwapVerifyLoading(false);
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        } else if (e.reason.match("BAL#347")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#347"],
          });
        } else if (e.reason.match("BAL#346")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#346"],
          });
        } else if (e.reason.match("BAL#510")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        } else if (e.reason.match("underflow")) {
          setLongSwapFormErrors({ balError: "Underflow" });
        } else if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setLongSwapVerifyLoading(false);
          errors.balError = undefined;
          setLongSwapFormErrors(errors ?? "");
        } else {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE.unknown,
          });
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
