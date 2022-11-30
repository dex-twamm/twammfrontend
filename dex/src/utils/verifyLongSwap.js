import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getLongSwapEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";
import { POOLS } from "./pool";

//Spot Prices
export const verifyLongSwap = async (
  swapAmount,
  setSpotPriceLoading,
  srcAddress,
  destAddress,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  account,
  setFormErrors,
  currentNetwork,
  numberOfBlockIntervals
) => {
  if (swapAmount) {
    setSpotPriceLoading(true);

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
        setFormErrors(errors ?? "");
        setSpotPriceLoading(false);
      });
    } catch (e) {
      setSpotPriceLoading(false);
      console.log("errororrrrrrrr", typeof e, { ...e });
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        }
        if (e.reason.match("BAL#347")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#347"],
          });
        }
        if (e.reason.match("BAL#346")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#346"],
          });
        }
        if (e.reason.match("BAL#510")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        }
        if (e.reason === "underflow") {
          setFormErrors({ balError: "Underflow" });
        }
        if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setSpotPriceLoading(false);
          errors.balError = undefined;
          setFormErrors(errors ?? "");
        }
      } else {
        setFormErrors({
          balError: POPUP_MESSAGE.unknown,
        });
      }
      setSpotPriceLoading(false);
    }
  }
};
