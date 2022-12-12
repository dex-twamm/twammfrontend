import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getEstimatedConvertedToken } from "./batchSwap";
import { getProvider } from "./getProvider";
import { getPoolConfig } from "./poolUtils";

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
  if (swapAmount) {
    setSpotPriceLoading(true);

    const poolConfig = getPoolConfig(currentNetwork);
    const tokenIn = poolConfig.tokens.find(
      (token) => token.address === srcAddress
    );
    const tokenOut = poolConfig.tokens.find(
      (token) => token.address === destAddress
    );

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

    //for shortswap
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
