import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

import { maxUint } from "./numbers";
const MAX_UINT256 = maxUint(256);

/*
    getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/Crypto Dev tokens that can be received 
    when the user swaps `_swapAmountWei` amount of Eth/Crypto Dev tokens.
*/
export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountWei,
  provider,
  ethSelected,
  ethBalance,
  reservedCD
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    provider
  );
  let amountOfTokens;
  // If `Eth` is selected this means our input value is `Eth` which means our input amount would be
  // `_swapAmountWei`, the input reserve would be the `ethBalance` of the contract and output reserve
  // would be the `Crypto Dev` token reserve
  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      ethBalance,
      reservedCD
    );
  } else {
    // If `Eth` is not selected this means our input value is `Crypto Dev` tokens which means our input amount would be
    // `_swapAmountWei`, the input reserve would be the `Crypto Dev` token reserve of the contract and output reserve
    // would be the `ethBalance`
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      reservedCD,
      ethBalance
    );
  }

  return amountOfTokens;
};

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
export const swapTokens = async (
  signer,
  swapAmountWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  const tokenContract1 = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    signer
  );

  const tokenContract2 = new Contract(
    TOKEN_CONTRACT_ADDRESS2,
    TOKEN_CONTRACT_ABI2,
    signer
  );

  const kind = 0; // GivenIn

  const swapTx = await exchangeContract.swap(
    {
      poolId: POOL_ID,
      kind: kind,
      assetIn: tokenContract1,
      assetOut: tokenContract2,
      amount: swapAmountWei,
      userData: "0x",
    },
    {
      sender: OWNER_ADDRESS,
      fromInternalBalance: false,
      recipient: OWNER_ADDRESS,
      toInternalBalance: false,
    },
    kind === 0 ? 0 : MAX_UINT256, // 0 if given in, infinite if given out.
    MAX_UINT256
  );

  const swapResult = await swapTx.wait();
  console.log(swapResult);
};
