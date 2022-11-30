import { BigNumber, Contract, ethers } from "ethers";
import { VAULT_CONTRACT_ABI } from "../constants";
import { MAX_UINT256 } from ".";
import { POOLS } from "./pool";
import { getNetworkPoolId, getPoolNetworkValues } from "./poolUtils";

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const getEstimatedConvertedToken = async (
  signer,
  swapAmountWei,
  assetIn,
  assetOut,
  walletAddress,
  expectedSwapOut,
  tolerance,
  deadline,
  currentNetwork = "Goerli"
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    getPoolNetworkValues(currentNetwork, "VAULT_CONTRACT_ADDRESS"),
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
  console.log(
    "Inputs",
    expectedSwapOut,
    tolerance,
    deadline,
    swapAmountWei,
    expectedSwapOutAfterTolerance
  );

  const gasEstimate = await exchangeContract.estimateGas.swap(
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
    // expectedSwapOutAfterTolerance,
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.  // Slippage  // TODO // Need To QueryBatchSwap Price - 1%
    // swapAmountWei * SpotPrice *( 1- Slippage can be 0.005, 0.01, 0.02) Type Big Number

    BigNumber.from(Math.floor(deadlineTimestamp / 1000)) // Deadline // Minutes Into Seconds Then Type BigNumber
  );

  const swapTx = await exchangeContract.callStatic.swap(
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
    // expectedSwapOutAfterTolerance,
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.  // Slippage  // TODO // Need To QueryBatchSwap Price - 1%
    // swapAmountWei * SpotPrice *( 1- Slippage can be 0.005, 0.01, 0.02) Type Big Number

    BigNumber.from(Math.floor(deadlineTimestamp / 1000)), // Deadline // Minutes Into Seconds Then Type BigNumber
    {
      gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
      // gasLimit: 5000000,
    }
  );
  let txHash = swapTx;
  // console.log("swapTxxxx", txHash.toNumber());
  // const txResult = await swapTx.wait();
  // console.log("Swap Results After Placed", txResult)
  return txHash;

  // const swapResult = await swapTx.wait();
  // console.log(swapResult.transactionHash);
};

export const getLongSwapEstimatedConvertedToken = async (
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals,
  signer,
  walletAddress,
  currentNetwork
) => {
  let txHash;

  console.log("Amount in value", amountIn, numberOfBlockIntervals);
  const exchangeContract = new Contract(
    getPoolNetworkValues(currentNetwork, "VAULT_CONTRACT_ADDRESS"),
    VAULT_CONTRACT_ABI,
    signer
  );
  const abiCoder = ethers.utils.defaultAbiCoder;
  const encodedRequest = abiCoder.encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256"],
    [
      4,
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      BigNumber.from(numberOfBlockIntervals),
    ]
  );

  console.log(
    "aksldalsjdlsjdieuhalsdlas",
    getNetworkPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: [
        getPoolNetworkValues(currentNetwork, "TOKEN_ONE_ADDRESS"),
        getPoolNetworkValues(currentNetwork, "TOKEN_TWO_ADDRESS"),
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );

  const gasEstimate = await exchangeContract.estimateGas.joinPool(
    getNetworkPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: [
        getPoolNetworkValues(currentNetwork, "TOKEN_ONE_ADDRESS"),
        getPoolNetworkValues(currentNetwork, "TOKEN_TWO_ADDRESS"),
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );

  console.log("gas estimate price", gasEstimate);

  const placeLtoTx = await exchangeContract.callStatic.joinPool(
    getNetworkPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: [
        getPoolNetworkValues(currentNetwork, "TOKEN_ONE_ADDRESS"),
        getPoolNetworkValues(currentNetwork, "TOKEN_TWO_ADDRESS"),
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
    {
      gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
    }
  );
  console.log("===LongTerm Placed====", placeLtoTx);
  txHash = placeLtoTx;
  // setTransactionHash(placeLtoTx.hash);

  // console.log("====Swap Results After Placed=====", await placeLtoTx.wait());
  // console.log(txHash);
  return txHash;
};
