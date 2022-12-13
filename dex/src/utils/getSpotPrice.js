import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getEstimatedConvertedToken } from "./batchSwap";
import { POOLS } from "./pool";

// Spot Prices
export const spotPrice = async (
  swapAmount,
  setSpotPriceLoading,
  srcAddress,
  destAddress,
  web3provider,
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
    const tokenIn = poolConfig.tokens.find(
      (token) => token.address === srcAddress
    );
    const tokenOut = poolConfig.tokens.find(
      (token) => token.address === destAddress
    );

    //todo : Change this to use token decimal places
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);
    console.log("swapAmountWei", swapAmountWei.toString());

    const errors = {};

    const signer = web3provider.getSigner();
    const walletAddress = account;

    console.log("Expected swap out ---->", expectedSwapOut);

    //for shortswap
    try {
      await getEstimatedConvertedToken(
        signer,
        swapAmountWei,
        tokenIn.address,
        tokenOut.address,
        walletAddress,
        deadline,
        currentNetwork
      ).then((res) => {
        console.log("Response From estimated swap", res.toString());
        errors.balError = undefined;
        setFormErrors(errors ?? "");
        setSpotPrice(
          (parseFloat(res) * 10 ** tokenIn.decimals) /
            (parseFloat(swapAmountWei) * 10 ** tokenOut.decimals)
        );
        setSpotPriceLoading(false);
        setExpectedSwapOut(res);
        console.log((parseFloat(res) * 10 ** tokenIn.decimals) /
        (parseFloat(swapAmountWei) * 10 ** tokenOut.decimals));
      });
    } catch (e) {
      setSpotPriceLoading(false);
      console.log("erroror", typeof e, { ...e });
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        }
        if (e.reason.match("BAL#510")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        }
        if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setSpotPriceLoading(false);
          setSpotPrice(0);
          errors.balError = undefined;
          setFormErrors(errors ?? "");
          setExpectedSwapOut(0);
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
