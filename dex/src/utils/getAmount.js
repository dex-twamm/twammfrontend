import { Contract, ethers } from "ethers";
import { bigToStr } from ".";

import { ERC20_TOKEN_CONTRACT_ABI, TWAMM_POOL_ABI } from "../constants";
import { getpoolAddress, getPoolConfig } from "./poolUtils";
// To Retrieve Token Balances
export const getTokensBalance = async (
  provider,
  walletAddress,
  currentNetwork = "Goerli"
) => {
  const poolConfig = getPoolConfig(currentNetwork);
  var tokenAddress = [
    poolConfig?.TOKEN_ONE_ADDRESS,
    poolConfig?.TOKEN_TWO_ADDRESS,
  ];

  const newBalance = [];
  for (let index = 0; index < tokenAddress.length; index++) {
    const address = tokenAddress[index];
    const balances = await balanceContract(address);
    const readableBalance = ethers.utils.formatUnits(
      balances,
      poolConfig?.tokens[index].decimals
    );
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
    console.log(
      "Balance of_" +
        address +
        "_is=" +
        ethers.utils.formatEther(balanceOfTokens)
    );
    return balanceOfTokens;
  }
  console.log("newBalance", newBalance);
  return newBalance.map((item) => item);
};

export const getLPTokensBalance = async (
  provider,
  walletAddress,
  currentNetwork = "Goerli"
) => {
  const poolContract = new Contract(
    getpoolAddress(currentNetwork),
    TWAMM_POOL_ABI,
    provider
  );

  const balanceOfLPTokens = await poolContract.balanceOf(walletAddress);
  const readableBalance = bigToStr(balanceOfLPTokens);
  console.log("BLPT", readableBalance);
  return readableBalance;
};
