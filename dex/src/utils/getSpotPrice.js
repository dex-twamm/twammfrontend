import { ethers } from "ethers";
import { useNetwork } from "../providers/context/UIProvider";
import { getEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";
import { POOLS } from "./pool";

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
  console.log("swapAmount ---->", swapAmount, srcAddress, destAddress);

  if (swapAmount) {
    setSpotPriceLoading(true);

    const poolConfig = Object.values(POOLS[currentNetwork])[0];
    const tokenIn = poolConfig.tokens.find((token) => token.address === srcAddress);
    const tokenOut = poolConfig.tokens.find((token) => token.address === destAddress);

    //todo : Change this to use token decimal places
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);

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
        console.log("Response From Query Batch Swap", res.toString());
        errors.balError = undefined;
        setFormErrors(errors ?? "");
        setSpotPrice((parseFloat(res) * (10**tokenIn.decimals)) / (parseFloat(swapAmountWei) * (10**tokenOut.decimals)));
        setSpotPriceLoading(false);
        setExpectedSwapOut(res);
      });
    } catch (e) {
      console.log("erroror", typeof e, { ...e });
      if (e.reason) {
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
        if (e.reason.match("ERC20: transfer amount exceeds allowance")) {
          setSpotPriceLoading(false);
          setSpotPrice(0);
          errors.balError = undefined;
          setFormErrors(errors ?? "");
          setExpectedSwapOut(0);
        }
      } else {
        setFormErrors({
          balError: "Unknown error!",
        });
      }
      setSpotPriceLoading(false);
    }
  }
};
