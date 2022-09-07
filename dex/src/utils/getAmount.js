import { Contract, ethers } from "ethers";
import { useContext } from "react";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from ".";

import {
  TOKEN_CONTRACT_ABI,
  VAULT_CONTRACT_ABI,
  VAULT_CONTRACT_ADDRESS,
} from "../constants";
// // Ether Balance
// export const getEtherBalance = async (provider, address, contract = false) => {
//   try {
//     if (contract) {
//       const balance = await provider.getBalance(VAULT_CONTRACT_ADDRESS);
//       return balance;
//     } else {
//       const balance = await provider.getBalance(address);
//       return balance;
//     }
//   } catch (err) {
//     console.error(err);
//     return 0;
//   }
// };

// export const getCDTokensBalance = async (provider, address) => {
//   try {
//     const tokenContract = new Contract(
//       MATIC_TOKEN_ADDRESS,
//       TOKEN_CONTRACT_ABI,
//       provider
//     );
//     const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
//     return balanceOfCryptoDevTokens;
//   } catch (err) {
//     console.error(err);
//   }
// };

/**
 * getLPTokensBalance: Retrieves the amount of LP tokens in the account
 * of the provided `address`
 */

// export const getLPTokensBalance = (provider) => {
//   var tokenAddress = [FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS];
//   tokenAddress.forEach(balanceContract);
//   let newBalance = [];
//   async function balanceContract(item, index) {
//     const balanceContract = new Contract(
//       item,
//       TOKEN_CONTRACT_ABI,
//       provider
//     );
//     const balanceOfLPTokens = await balanceContract.balanceOf("0x536eE2273Ba6F1c91362fa9FCcb4166450FCb7D3");
//     newBalance.push(ethers.utils.formatEther(balanceOfLPTokens));
//     console.log("Balance of_" + item + "_is=" + ethers.utils.formatEther(balanceOfLPTokens));
//     // return balanceOfLPTokens;
//   }

// }

// To Retrieve Token Balances 
export const getLPTokensBalance = async (provider, walletAddress) => {
  var tokenAddress = [FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS];
  const newBalance = [];
  for (let index = 0; index < tokenAddress.length; index++) {
    const element = tokenAddress[index];
    const balances = await balanceContract(element);
    const readableBalance = ethers.utils.formatEther(balances);
    console.log("Balances", readableBalance);
    newBalance.push(readableBalance);
  }
  async function balanceContract(element) {
    const balanceContract = new Contract(
      element,
      TOKEN_CONTRACT_ABI,
      provider
    );
    const balanceOfLPTokens = await balanceContract.balanceOf(walletAddress);
    console.log("Balance of_" + element + "_is=" + ethers.utils.formatEther(balanceOfLPTokens));
    return balanceOfLPTokens;
  }
  console.log(newBalance);
  return newBalance.map((item) => item);
}

/**
 * getReserveOfCDTokens: Retrieves the amount of CD tokens in the
 * Vault contract address
 */
// export const getReserveOfCDTokens = async (provider) => {
//   try {
//     const exchangeContract = new Contract(
//       VAULT_CONTRACT_ADDRESS,
//       VAULT_CONTRACT_ABI,
//       provider
//     );
//     const reserve = await exchangeContract.getReserve();
//     return reserve;
//   } catch (err) {
//     console.error(err);
//   }
// };
