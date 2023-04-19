import { ethers, BigNumber, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { TokenType } from "./pool";
import { getPoolTokens } from "./poolUtils";
import { swapTokens } from "./swap";

export const _swapTokens = async (
  ethBalance: number,
  swapAmount: number,
  web3provider: providers.Web3Provider,
  tokenA: string,
  tokenB: string,
  account: string,
  deadline: number,
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setSuccess: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  const tokens = getPoolTokens(currentNetwork);

  const tokenIn: TokenType = tokens.find(
    (token: any) => token.address === tokenA
  )!;

  const swapAmountWei: BigNumber = ethers.utils.parseUnits(
    swapAmount.toString(),
    tokenIn?.decimals
  );

  const walletBalanceWei: BigNumber = ethers.utils.parseUnits(
    ethBalance.toString(),
    tokenIn?.decimals
  );

  if (swapAmountWei.lte(walletBalanceWei)) {
    try {
      const signer = web3provider.getSigner();
      const assetIn: string = tokenA;
      const assetOut: string = tokenB;
      const walletAddress: string = account;

      // Call the swapTokens function from the `utils` folder
      const response = await swapTokens(
        signer,
        swapAmountWei,
        assetIn,
        assetOut,
        walletAddress,
        deadline,
        currentNetwork
      );
      setTransactionHash(response.hash);
      const result = await response.wait();

      if (result.status === 1) setSuccess(POPUP_MESSAGE.shortSwapSuccess);
      else setError(POPUP_MESSAGE.shortSwapFailed);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(POPUP_MESSAGE.transactionCancelled);
    }
  } else {
    setLoading(false);
    setError(POPUP_MESSAGE.insufficientBalance);
  }
};
