import { BigNumber, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { PoolType, TokenType } from "./pool";
import { getPoolConfig } from "./poolUtils";
import { verifySwapTokens } from "./swap";

// Spot Prices
export const spotPrice = async (
  swapAmount: number,
  setSpotPriceLoading: Dispatch<SetStateAction<boolean>>,
  tokenA: string,
  tokenB: string,
  web3provider: any,
  account: string,
  deadline: number,
  setFormErrors: Dispatch<SetStateAction<{ balError: string | undefined }>>,
  setSpotPrice: Dispatch<SetStateAction<number>>,
  setExpectedSwapOut: Dispatch<SetStateAction<number>>,
  currentNetwork: { network: string; poolId: number }
): Promise<void> => {
  if (swapAmount) {
    setSpotPriceLoading(true);

    const poolConfig: PoolType = getPoolConfig(currentNetwork)!;
    const tokenIn: TokenType = poolConfig?.tokens.find(
      (token) => token.address === tokenA
    )!;
    const tokenOut: TokenType = poolConfig?.tokens.find(
      (token) => token.address === tokenB
    )!;

    //todo : Change this to use token decimal places
    const swapAmountWei: BigNumber = ethers.utils.parseUnits(
      swapAmount.toString(),
      tokenIn.decimals
    );

    const signer: any = web3provider.getSigner();
    const walletAddress: string = account;

    //for shortswap
    try {
      await verifySwapTokens(
        signer,
        swapAmountWei,
        tokenIn.address,
        tokenOut.address,
        walletAddress,
        deadline,
        currentNetwork
      ).then((res: BigNumber) => {
        setFormErrors({ balError: undefined });
        setSpotPrice(
          (parseFloat(res.toString()) * 10 ** tokenIn.decimals) /
            (parseFloat(swapAmountWei.toString()) * 10 ** tokenOut.decimals)
        );
        setSpotPriceLoading(false);
        setExpectedSwapOut(parseFloat(res.toString()));
      });
    } catch (e: any) {
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
          setFormErrors({ balError: undefined });
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
