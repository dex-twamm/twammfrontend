import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { fp, MAX_UINT256 } from ".";
import { getExchangeContract } from "./getContracts";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";
import { getGasLimit } from "./getGasLimit";

export async function joinPool(walletAddress, signer, currentNetwork) {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    // JoinKind, User Input AmountIn, MinimumBpt Out
    // TODO Calculate MinBptOut Using Query Join Pool and Tolerance
    [1, [fp(1e-12), fp(1.0)], 0]
  );
  const vaultContract = getExchangeContract(currentNetwork, signer);

  const data = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
      // Could Be User Input Same as Encoded Above -- Left to Figure It Out
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
  ];

  const joinPoolTx = await vaultContract.joinPool(...data, {
    gasLimit: getGasLimit(vaultContract, data, "joinPool"),
  });

  // const joinPoolResult = await joinPool.wait();
}

export async function exitPool(
  walletAddress,
  signer,
  bptAmountIn,
  currentNetwork
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, bptAmountIn]
  );

  const data = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
  ];

  const exitPoolTx = await vaultContract.exitPool(...data, {
    gasLimit: getGasLimit(vaultContract, data, "exitPool"),
  });
  // const exitPoolResult = await exitPoolTx.wait();
}

export async function cancelLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  currentNetwork
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, orderId]
  );

  const data = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
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
  currentNetwork
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [5, orderId]
  );

  const data = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
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

export async function getPoolBalance(signer, tokenAddress, currentNetwork) {
  const tokenIndex = getPoolTokens(currentNetwork).filter(
    (item) => item.address === tokenAddress
  );

  const vaultContract = getExchangeContract(currentNetwork, signer);

  const poolBalance = await vaultContract.getPoolTokenInfo(
    getPoolId(currentNetwork),
    tokenAddress
  );
  const cash = poolBalance.cash._hex;

  const readableCash = ethers.utils.formatUnits(cash, tokenIndex?.[0].decimals);
  return readableCash.toString();
}
