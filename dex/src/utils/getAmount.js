import { Contract, ethers } from "ethers";
import {
  bigToStr,
  // FAUCET_TOKEN_ADDRESS,
  // MATIC_TOKEN_ADDRESS,
  // POOL_ID,
} from ".";

import { ERC20_TOKEN_CONTRACT_ABI, TWAMM_POOL_ABI } from "../constants";
import { POOLS, POOL_ID } from "./pool";
// To Retrieve Token Balances
export const getTokensBalance = async (
  provider,
  walletAddress,
  currentNetwork
) => {
  var tokenAddress = [
    Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
    Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
  ];
  const newBalance = [];
  for (let index = 0; index < tokenAddress.length; index++) {
    const address = tokenAddress[index];
    const balances = await balanceContract(address);
    const readableBalance = ethers.utils.formatEther(balances);
    // console.log("Balances", readableBalance);
    newBalance.push({ [address]: readableBalance });
  }
  async function balanceContract(address) {
    const ERC20Contract = new Contract(
      address,
      ERC20_TOKEN_CONTRACT_ABI,
      provider
    );
    const balanceOfTokens = await ERC20Contract.balanceOf(walletAddress);
    // console.log("Balance of_" + element + "_is=" + ethers.utils.formatEther(balanceOfLPTokens));
    return balanceOfTokens;
  }
  console.log("newBalance", newBalance);
  return newBalance.map((item) => item);
};

export const getLPTokensBalance = async (
  provider,
  walletAddress,
  currentNetwork
) => {
  const poolContract = new Contract(
    Object.values(POOLS?.[currentNetwork])?.[0].address,
    TWAMM_POOL_ABI,
    provider
  );

  const balanceOfLPTokens = await poolContract.balanceOf(walletAddress);
  const readableBalance = bigToStr(balanceOfLPTokens);
  console.log("BLPT", readableBalance);
  return readableBalance;
};
