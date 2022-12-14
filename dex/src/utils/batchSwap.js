import { BigNumber, Contract } from "ethers";
import { VAULT_CONTRACT_ABI } from "../constants";
import { MAX_UINT256 } from ".";
import { getNetworkPoolId, getPoolVaultContractAddress } from "./poolUtils";

export const getEstimatedConvertedToken = async (
  signer,
  swapAmountWei,
  assetIn,
  assetOut,
  walletAddress,
  deadline,
  currentNetwork
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
  const kind = 0; // GivenIn
  const targetDate = new Date();
  targetDate.setSeconds(deadline * 60);
  const deadlineTimestamp = targetDate.getTime();

  const swapData = [
    {
      poolId: getNetworkPoolId(currentNetwork),
      kind: kind,
      assetIn: assetIn,
      assetOut: assetOut,
      amount: swapAmountWei,
      userData: "0x",
    },
    {
      sender: walletAddress,
      fromInternalBalance: false,
      recipient: walletAddress,
      toInternalBalance: false,
    },
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.  // Slippage  // TODO // Need To QueryBatchSwap Price - 1%

    BigNumber.from(Math.floor(deadlineTimestamp / 1000)), // Deadline // Minutes Into Seconds Then Type BigNumber
  ];

  const gasEstimate = await exchangeContract.estimateGas.swap(...swapData);

  const swapTx = await exchangeContract.callStatic.swap(...swapData, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  // const txResult = await swapTx.wait();
  return swapTx;

  // const swapResult = await swapTx.wait();
};
