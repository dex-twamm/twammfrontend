import { BigNumber, ethers, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { BALANCER_ERRORS } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { TokenType } from "./pool";
import { getPoolTokens } from "./poolUtils";
import { verifySwapTokens } from "./swap";

// Spot Prices
export const spotPrice = async (
  swapAmount: number,
  setSpotPriceLoading: Dispatch<SetStateAction<boolean>>,
  tokenA: string,
  tokenB: string,
  web3provider: providers.Web3Provider,
  account: string,
  deadline: number,
  setFormErrors: Dispatch<SetStateAction<{ balError: string | undefined }>>,
  setSpotPrice: Dispatch<SetStateAction<number>>,
  setExpectedSwapOut: Dispatch<SetStateAction<number>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  if (swapAmount) {
    setSpotPriceLoading(true);

    const tokens = getPoolTokens(currentNetwork);
    const tokenIn: TokenType = tokens.find(
      (token) => token.address === tokenA
    )!;
    const tokenOut: TokenType = tokens.find(
      (token) => token.address === tokenB
    )!;

    //todo : Change this to use token decimal places
    const swapAmountWei: BigNumber = ethers.utils.parseUnits(
      swapAmount.toString(),
      tokenIn.decimals
    );

    const signer = web3provider.getSigner();
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
        const errorKey = Object.keys(BALANCER_ERRORS).find((key) =>
          e.reason.match(key)
        );
        if (errorKey)
          setFormErrors({
            balError: BALANCER_ERRORS[errorKey],
          });
        else if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setSpotPriceLoading(false);
          setSpotPrice(0);
          setFormErrors({ balError: undefined });
          setExpectedSwapOut(0);
        } else {
          setFormErrors({
            balError: BALANCER_ERRORS.unknown,
          });
        }
      } else {
        setFormErrors({
          balError: BALANCER_ERRORS.unknown,
        });
      }
      setSpotPriceLoading(false);
    }
  }
};
