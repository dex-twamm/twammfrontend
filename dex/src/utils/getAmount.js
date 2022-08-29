import { Contract } from "ethers";

import {
  VAULT_CONTRACT_ABI,
  VAULT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
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
      TOKEN_CONTRACT_ADDRESS,
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
export const getLPTokensBalance = async (provider, address) => {
  try {
    const exchangeContract = new Contract(
      VAULT_CONTRACT_ADDRESS,
      VAULT_CONTRACT_ABI,
      provider
    );
    const balanceOfLPTokens = await exchangeContract.balanceOf(address);
    return balanceOfLPTokens;
  } catch (err) {
    console.error(err);
  }
};

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
