import { Contract, ethers } from "ethers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from ".";

import {
  TOKEN_CONTRACT_ABI,
  VAULT_CONTRACT_ABI,
  VAULT_CONTRACT_ADDRESS,
} from "../constants";

// Ether Balance
export const getEtherBalance = async (provider, address, contract = false) => {
  try {
    if (contract) {
      const balance = await provider.getBalance(VAULT_CONTRACT_ADDRESS);
      return balance;
    } else {
      const balance = await provider.getBalance(address);
      return balance;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const getCDTokensBalance = async (provider, address) => {
  try {
    const tokenContract = new Contract(
      MATIC_TOKEN_ADDRESS,
      TOKEN_CONTRACT_ABI,
      provider
    );
    const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
    return balanceOfCryptoDevTokens;
  } catch (err) {
    console.error(err);
  }
};

/**
 * getLPTokensBalance: Retrieves the amount of LP tokens in the account
 * of the provided `address`
 */

export const getLPTokensBalance = (provider) => {
  const tokenAddress = [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS];
  tokenAddress.forEach(exchangeContract);
  let newBalance = [];
  async function exchangeContract(item, index, arr) {
    const exchangeContract = new Contract(
      arr[index],
      TOKEN_CONTRACT_ABI,
      provider
    );
    const balanceOfLPTokens = await exchangeContract.balanceOf("0x536eE2273Ba6F1c91362fa9FCcb4166450FCb7D3");
    newBalance.push(ethers.utils.formatEther(balanceOfLPTokens));
    console.log(ethers.utils.formatEther(balanceOfLPTokens));
    return exchangeContract;
  }
  console.log("newBalance", newBalance);
}

/**
 * getReserveOfCDTokens: Retrieves the amount of CD tokens in the
 * Vault contract address
 */
export const getReserveOfCDTokens = async (provider) => {
  try {
    const exchangeContract = new Contract(
      VAULT_CONTRACT_ADDRESS,
      VAULT_CONTRACT_ABI,
      provider
    );
    const reserve = await exchangeContract.getReserve();
    return reserve;
  } catch (err) {
    console.error(err);
  }
};
