import { Contract, ethers } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";
import { POOL_ID, MAX_UINT256, toHex } from ".";



/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const swapTokens = async (signer, swapAmountWei, assetIn, assetOut, walletAddress) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
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
    1663213774,
    {
      gasLimit: 100000
    }
  );

  const swapResult = await swapTx.wait();
  console.log(swapResult);



};
