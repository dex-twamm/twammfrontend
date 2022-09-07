import { Contract, ethers } from "ethers";
import { VAULT_CONTRACT_ABI, VAULT_CONTRACT_ADDRESS } from "../constants";
import { POOL_ID, MAX_UINT256, toHex } from ".";



/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const swapTokens = async (signer, swapAmountWei, assetIn, assetOut, walletAddress) => {
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
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.
    MAX_UINT256,
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
