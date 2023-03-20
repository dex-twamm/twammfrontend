import { Contract, ethers } from "ethers";
import { bigToStr } from ".";

import { ERC20_TOKEN_CONTRACT_ABI, TWAMM_POOL_ABI } from "../constants";
import {
  getPoolContractAddress,
  getPoolTokenAddresses,
  getPoolTokens,
} from "./poolUtils";
// To Retrieve Token Balances
export const getTokensBalance = async (
  signer,
  walletAddress,
  currentNetwork
) => {
  const tokens = getPoolTokens(currentNetwork);
  var tokenAddress = getPoolTokenAddresses(currentNetwork);

  const newBalance = [];
  for (let index = 0; index < tokenAddress?.length; index++) {
    const address = tokenAddress[index];
    const balances = await balanceContract(address);
    const readableBalance = ethers.utils.formatUnits(
      balances,
      tokens[index].decimals
    );
    newBalance.push({ [address]: readableBalance });
  }
  async function balanceContract(address) {
    const ERC20Contract = new Contract(
      address,
      ERC20_TOKEN_CONTRACT_ABI,
      signer
    );
    const balanceOfTokens = await ERC20Contract.balanceOf(walletAddress);
    return balanceOfTokens;
  }
  return newBalance.map((item) => item);
};

export const getLPTokensBalance = async (
  signer,
  walletAddress,
  currentNetwork
) => {
  const poolContract = new Contract(
    getPoolContractAddress(currentNetwork),
    TWAMM_POOL_ABI,
    signer
  );

  const balanceOfLPTokens = await poolContract.balanceOf(walletAddress);
  const readableBalance = bigToStr(balanceOfLPTokens);
  return readableBalance;
};
