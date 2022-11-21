import { ethers } from "ethers";
import { getEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";

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
  setExpectedSwapOut
) => {
  console.log("Expected swap out ---->", swapAmount);

  if (swapAmount) {
    setSpotPriceLoading(true);
    //todo : Change this to use token decimal places
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");

    const assetIn = srcAddress;
    const assetOut = destAddress;
    const errors = {};
    // const signer = a
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
      const batchPrice = await getEstimatedConvertedToken(
        signer,
        swapAmountWei,
        assetIn,
        assetOut,
        walletAddress,
        expectedSwapOut,
        tolerance,
        deadline
      ).then((res) => {
        console.log("Response From Query Batch Swap", res);
        errors.balError = undefined;
        setFormErrors(errors ?? "");
        console.log("Response of spot price");
        setSpotPrice(parseFloat(res) / parseFloat(swapAmountWei));
        setSpotPriceLoading(false);
        setExpectedSwapOut(res);
      });
      return batchPrice;
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
