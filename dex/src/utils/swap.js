import { BigNumber, Contract } from "ethers";
import { GAS_OVERAGE_FACTOR, VAULT_CONTRACT_ABI } from "../constants";
import { MAX_UINT256 } from ".";
import { getPoolId, getPoolConfig } from "./poolUtils";
import { getVaultContractAddress } from "./networkUtils";

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const swapTokens = async (
  signer,
  swapAmountWei,
  assetIn,
  assetOut,
  walletAddress,
  expectedSwapOut,
  tolerance,
  deadline,
  currentNetwork
) => {
  const poolConfig = getPoolConfig(currentNetwork);

  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
  const kind = 0; // GivenIn

  const expectedSwapOutAfterTolerance = BigNumber.from(expectedSwapOut)
    .mul(1000 - 10 * tolerance)
    .div(1000);
  const targetDate = new Date();
  targetDate.setSeconds(deadline * 60);
  const deadlineTimestamp = targetDate.getTime();

  const swapData = [
    {
      poolId: getPoolId(currentNetwork),
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
    // expectedSwapOutAfterTolerance,
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.  // Slippage  // TODO // Need To QueryBatchSwap Price - 1%
    // swapAmountWei * SpotPrice *( 1- Slippage can be 0.005, 0.01, 0.02) Type Big Number

    BigNumber.from(Math.floor(deadlineTimestamp / 1000)), // Deadline // Minutes Into Seconds Then Type BigNumber
  ];

  const gasEstimate = await exchangeContract.estimateGas.swap(...swapData);

  const swapTx = await exchangeContract.swap(...swapData, {
    gasLimit: Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR),
  });

  // let txHash = swapTx.hash;
  // const txResult = await swapTx.wait();
  // console.log("Swap Results After Placed", txResult)
  return swapTx;

  // const swapResult = await swapTx.wait();
  // console.log(swapResult.transactionHash);
};
