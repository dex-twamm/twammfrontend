import { BigNumber, ethers, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { BALANCER_ERRORS } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { verifyLongSwapTxn } from "./longSwap";
import { getPoolTokens } from "./poolUtils";

export const verifyLongSwap = async (
  swapAmount: number,
  setLongSwapVerifyLoading: Dispatch<SetStateAction<boolean>>,
  tokenA: string,
  tokenB: string,
  web3provider: providers.Web3Provider,
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

    const signer = web3provider.getSigner();
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
        const errorKey = Object.keys(BALANCER_ERRORS).find((key) =>
          e.reason.match(key)
        );
        if (errorKey)
          setLongSwapFormErrors({ balError: BALANCER_ERRORS[errorKey] });
        else if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setLongSwapVerifyLoading(false);
          setLongSwapFormErrors({ balError: undefined });
        } else {
          setLongSwapFormErrors({
            balError: BALANCER_ERRORS.unknown,
          });
        }
      } else {
        setLongSwapFormErrors({
          balError: BALANCER_ERRORS.unknown,
        });
      }
      setLongSwapVerifyLoading(false);
    }
    setLongSwapVerifyLoading(false);
  }
};
