import { ethers } from "ethers";
import { useNetwork } from "../providers/context/UIProvider";
import { getEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";
import { POOLS, POOL_ID } from "./pool";

//Spot Prices
export const spotPrice = async (
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
  expectedSwapOut,
  tolerance,
  deadline,
  setFormErrors,
  setSpotPrice,
  setExpectedSwapOut,
  currentNetwork
) => {
  console.log("Expected swap out ---->", swapAmount);

  if (swapAmount) {
    setSpotPriceLoading(true);
    //todo : Change this to use token decimal places
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");

    const errors = {};

    const poolConfig = Object.values(POOLS[currentNetwork])[0];
    const tokenIn = poolConfig.tokens.find((token) => token.address === srcAddress);
    const tokenOut = poolConfig.tokens.find((token) => token.address === destAddress);

    const signer = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
    const walletAddress = account;

    console.log("Expected swap out ---->", expectedSwapOut);
    try {
      await getEstimatedConvertedToken(
        signer,
        swapAmountWei,
        tokenIn.address,
        tokenOut.address,
        walletAddress,
        expectedSwapOut,
        tolerance,
        deadline,
        currentNetwork
      ).then((res) => {
        console.log("Response From Query Batch Swap", res);
        errors.balError = undefined;
        setFormErrors(errors ?? "");
        setSpotPrice((parseFloat(res) * (10**tokenIn.decimals)) / (parseFloat(swapAmountWei) * (10**tokenOut.decimals)));
        setSpotPriceLoading(false);
        setExpectedSwapOut(res);
      });
    } catch (e) {
      console.log("erroror", typeof e, { ...e });
      if (e.reason.match("BAL#304")) {
        setFormErrors({
          balError: "Try Giving Lesser Amount",
        });
      }

      if (e.reason.match("BAL#510")) {
        setFormErrors({
          balError: "Invalid Amount!",
        });
      }
      setSpotPriceLoading(false);
    }
  }
};
