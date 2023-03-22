import { BigNumber, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { verifyLongSwapTxn } from "./longSwap";
import { getPoolTokens } from "./poolUtils";

export const verifyLongSwap = async (
  swapAmount: number,
  setLongSwapVerifyLoading: Dispatch<SetStateAction<boolean>>,
  tokenA: string,
  tokenB: string,
  web3provider: any,
  account: string,
  setLongSwapFormErrors: Dispatch<
    SetStateAction<{ balError: string | undefined }>
  >,
  currentNetwork: SelectedNetworkType,
  numberOfBlockIntervals: number,
  allowance: string
): Promise<void> => {
  if (swapAmount && numberOfBlockIntervals) {
    setLongSwapVerifyLoading(true);

    const tokens = getPoolTokens(currentNetwork);

    const signer: any = web3provider.getSigner();
    const walletAddress: string = account;

    try {
      const tokenInIndex: number = tokens.findIndex(
        (object) => tokenA === object.address
      );
      const tokenOutIndex: number = tokens.findIndex(
        (object) => tokenB === object.address
      );
      const amountIn: BigNumber = ethers.utils.parseUnits(
        swapAmount.toString(),
        tokens[tokenInIndex].decimals
      );

      if (parseFloat(amountIn.toString()) < parseFloat(allowance)) {
        setLongSwapVerifyLoading(true);
        await verifyLongSwapTxn(
          tokenInIndex,
          tokenOutIndex,
          amountIn,
          numberOfBlockIntervals,
          signer,
          walletAddress,
          currentNetwork
        ).then((res) => {
          setLongSwapFormErrors({ balError: undefined });
          setLongSwapVerifyLoading(false);
        });
      }
    } catch (e: any) {
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
          setLongSwapFormErrors({ balError: undefined });
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
    setLongSwapVerifyLoading(false);
  }
};
