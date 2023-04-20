import { BigNumber, ethers, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { TokenType } from "./pool";
import { getPoolId, getPoolTokens } from "./poolUtils";
import { verifySwapTokens } from "./swap";
import {
  BalancerSDK,
  PoolWithMethods,
  BalancerSdkConfig,
  Network,
} from "@balancer-labs/sdk";

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

    console.log(getPoolId(currentNetwork), tokenA, tokenB);
    const spotPrice = await getSpotPrice(
      getPoolId(currentNetwork),
      tokenA,
      tokenB
    );
  }
};

export const getSpotPrice = async (
  poolId: string,
  tokenInAddress: string,
  tokenOutAddress: string
) => {
  const sdkConfig: BalancerSdkConfig = {
    network: Network.GOERLI,
    rpcUrl: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
  };
  const balancer = new BalancerSDK(sdkConfig);

  const pool: PoolWithMethods | undefined = await balancer.pools.find(poolId);

  console.log(pool);
  const spotPrice = await pool?.calcSpotPrice(tokenInAddress, tokenOutAddress);

  console.log(spotPrice);

  return spotPrice;
};
