import { BigNumber, Contract, ethers } from "ethers";
import { VAULT_CONTRACT_ABI, VAULT_CONTRACT_ADDRESS } from "../constants";
import { POOL_ID, MAX_UINT256, toHex } from ".";



/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const swapTokens = async (signer, swapAmountWei, assetIn, assetOut, walletAddress, expectedSwapOut, tolerance, deadline) => {
  let txHash;
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  const kind = 0; // GivenIn

  const swapTx = await exchangeContract.swap(
    {
      poolId: POOL_ID,
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
    expectedSwapOut * (1 - tolerance),
    // kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.  // Slippage  // TODO // Need To QueryBatchSwap Price - 1%
    // swapAmountWei * SpotPrice *( 1- Slippage can be 0.005, 0.01, 0.02) Type Big Number

    BigNumber.from(deadline).mul(60), // Deadline // Minutes Into Seconds Then Type BigNumber  
    {
      gasLimit: 2000000
    }
  );
  txHash = swapTx.hash;
  console.log(txHash);
  return txHash;

  // const swapResult = await swapTx.wait();
  // console.log(swapResult.transactionHash);
};
