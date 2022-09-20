import { Contract, ethers } from "ethers";
import { bigToStr, FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, POOL_ID } from ".";

import {
  TOKEN_CONTRACT_ABI, TWAMM_POOL_ABI,

} from "../constants";
import { POOLS } from "./pool";
// To Retrieve Token Balances 
export const getTokensBalance = async (provider, walletAddress) => {
  var tokenAddress = [FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS];
  const newBalance = [];
  for (let index = 0; index < tokenAddress.length; index++) {
    const address = tokenAddress[index];
    const balances = await balanceContract(address);
    const readableBalance = ethers.utils.formatEther(balances);
    // console.log("Balances", readableBalance);
    newBalance.push(readableBalance);
  }
  async function balanceContract(address) {
    const balanceContract = new Contract(
      address,
      TOKEN_CONTRACT_ABI,
      provider
    );
    const balanceOfLPTokens = await balanceContract.balanceOf(walletAddress);
    // console.log("Balance of_" + element + "_is=" + ethers.utils.formatEther(balanceOfLPTokens));
    return balanceOfLPTokens;
  }
  // console.log(newBalance);
  return newBalance.map((item) => item);
}


export const getLPTokensBalance = async (provider, walletAddress) => {
  const tokenContract = new Contract(
    POOLS[POOL_ID].address,
    TWAMM_POOL_ABI,
    provider);

  const balanceOfLPTokens = await tokenContract.balanceOf(walletAddress);
  const readableBalance = bigToStr(balanceOfLPTokens);
  console.log("BLPT", readableBalance);
  return [readableBalance, '0.2144', '0.2365', '0.0001', '0.0000'].sort().reverse();

}
