import { BigNumber } from "ethers";
import { MAX_UINT256 } from ".";
import { getPoolId } from "./poolUtils";
import { getExchangeContract } from "./getContracts";
import { getGasLimit } from "./getGasLimit";

export const verifySwapTokens = async (
  signer,
  swapAmountWei,
  assetIn,
  assetOut,
  walletAddress,
  deadline,
  currentNetwork,
  poolNumber
) => {
  const verifyResult = await swapTokens(
    signer,
    swapAmountWei,
    assetIn,
    assetOut,
    walletAddress,
    deadline,
    currentNetwork,
    poolNumber,
    true
  );
  return verifyResult;
};

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
const kind = 0; // GivenIn

const getDeadlineStamp = (deadline) => {
  const targetDate = new Date();
  targetDate.setSeconds(deadline * 60);
  const deadlineTimestamp = targetDate.getTime();
  return deadlineTimestamp;
};

export const swapTokens = async (
  signer,
  swapAmountWei,
  assetIn,
  assetOut,
  walletAddress,
  deadline,
  currentNetwork,
  poolNumber,
  hasCallStatic
) => {
  const exchangeContract = getExchangeContract(currentNetwork, signer);
  const deadlineTimestamp = getDeadlineStamp(deadline);

  const swapData = [
    {
      poolId: getPoolId(currentNetwork, poolNumber),
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

  let swapTx;

  //this will perform getEstimated token and verify txn
  if (hasCallStatic) {
    swapTx = await exchangeContract.callStatic.swap(...swapData, {
      gasLimit: getGasLimit(exchangeContract, swapData, "swap"),
    });
  }
  //this will perform the swap
  else {
    swapTx = await exchangeContract.swap(...swapData, {
      gasLimit: getGasLimit(exchangeContract, swapData, "swap"),
    });
  }

  return swapTx;
};
