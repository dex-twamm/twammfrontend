import { ethers, providers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { POPUP_MESSAGE } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { addPoolLiquidity } from "./addPoolLiquidity";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export const _addPoolLiquidity = async (
  walletAddress: string,
  web3provider: providers.Web3Provider,
  currentNetwork: SelectedNetworkType,
  amountsIn: number[],
  setTransactionHash: Dispatch<SetStateAction<string>>,
  setMessage: Dispatch<SetStateAction<{ status: string; message: string }>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setShowPreviewModal: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const poolId = getPoolId(currentNetwork);
    const tokenIn = getPoolTokenAddresses(currentNetwork);
    const tokens = getPoolTokens(currentNetwork);

    const tokenOneAmountWei = ethers.utils.parseUnits(
      amountsIn[0].toString(),
      tokens[0].decimals
    );

    const tokenTwoAmountWei = ethers.utils.parseUnits(
      amountsIn[1].toString(),
      tokens[1].decimals
    );

    setLoading(true);

    const response = await addPoolLiquidity(
      poolId,
      tokenIn,
      tokenOneAmountWei,
      tokenTwoAmountWei,
      walletAddress,
      web3provider,
      currentNetwork
    );

    setShowPreviewModal(false);
    setTransactionHash(response.hash);

    const result = await response.wait();

    if (result.status === 1) {
      setMessage({
        status: "success",
        message: POPUP_MESSAGE.liquidityAdded,
      });
    } else {
      setMessage({
        status: "failed",
        message: POPUP_MESSAGE.addLiquidityFailed,
      });
    }
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setShowPreviewModal(false);
    setMessage({
      status: "failed",
      message: POPUP_MESSAGE.transactionCancelled,
    });
  }
};
