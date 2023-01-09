import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

import { getGasLimit } from "./getGasLimit";
import { getExchangeContract } from "./getContracts";

export async function cancelLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  currentNetwork,
  poolNumber
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, orderId]
  );

  const data = [
    getPoolId(currentNetwork, poolNumber),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork, poolNumber),
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
  ];

  const exitPoolTx = await vaultContract.exitPool(...data, {
    gasLimit: getGasLimit(vaultContract, data, "exitPool"),
  });

  setTransactionHash(orderHash);
  return exitPoolTx;
}

export async function withdrawLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  currentNetwork,
  poolNumber
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [5, orderId]
  );

  const data = [
    getPoolId(currentNetwork, poolNumber),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork, poolNumber),
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
  ];

  const withdrawLTOTx = await vaultContract.exitPool(...data, {
    gasLimit: getGasLimit(vaultContract, data, "exitPool"),
  });

  setTransactionHash(orderHash);
  return withdrawLTOTx;
}

export async function getPoolBalance(
  signer,
  tokenAddress,
  currentNetwork,
  poolNumber
) {
  const tokenIndex = getPoolTokens(currentNetwork, poolNumber).filter(
    (item) => item.address === tokenAddress
  );

  const vaultContract = getExchangeContract(currentNetwork, signer);

  const poolBalance = await vaultContract.getPoolTokenInfo(
    getPoolId(currentNetwork, poolNumber),
    tokenAddress
  );
  const cash = poolBalance.cash._hex;

  const readableCash = ethers.utils.formatUnits(cash, tokenIndex?.[0].decimals);
  return readableCash.toString();
}
