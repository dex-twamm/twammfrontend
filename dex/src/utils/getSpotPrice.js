import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getEstimatedConvertedToken } from "./batchSwap";
import { getPoolConfig } from "./poolUtils";

// Spot Prices
export const spotPrice = async (
  swapAmount,
  setSpotPriceLoading,
  tokenA,
  tokenB,
  web3provider,
  account,
  deadline,
  setFormErrors,
  setSpotPrice,
  setExpectedSwapOut,
  currentNetwork
) => {
  if (swapAmount) {
    setSpotPriceLoading(true);

    const poolConfig = getPoolConfig(currentNetwork);
    const tokenIn = poolConfig?.tokens.find(
      (token) => token.address === tokenA
    );
    const tokenOut = poolConfig?.tokens.find(
      (token) => token.address === tokenB
    );

    //todo : Change this to use token decimal places
    const swapAmountWei = ethers.utils.parseUnits(swapAmount, tokenIn.decimals);

    const errors = {};

    const signer = web3provider.getSigner();
    const walletAddress = account;

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
        errors.balError = undefined;
        setFormErrors(errors ?? "");
        setSpotPrice(
          (parseFloat(res) * 10 ** tokenIn.decimals) /
            (parseFloat(swapAmountWei) * 10 ** tokenOut.decimals)
        );
        setSpotPriceLoading(false);
        setExpectedSwapOut(res);
      });
    } catch (e) {
      setSpotPriceLoading(false);
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        } else if (e.reason.match("BAL#510")) {
          setFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        } else if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setSpotPriceLoading(false);
          setSpotPrice(0);
          errors.balError = undefined;
          setFormErrors(errors ?? "");
          setExpectedSwapOut(0);
        } else {
          setFormErrors({
            balError: POPUP_MESSAGE.unknown,
          });
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
