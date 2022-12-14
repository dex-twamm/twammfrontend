import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { fp, MAX_UINT256 } from ".";
import { POPUP_MESSAGE, VAULT_CONTRACT_ABI } from "../constants";
import { getEthLogs } from "./get_ethLogs";
import {
  getPoolId,
  getPoolTokenAddresses,
  getPoolTokens,
  getPoolVaultContractAddress,
} from "./poolUtils";

export async function joinPool(walletAddress, signer, currentNetwork) {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    // JoinKind, User Input AmountIn, MinimumBpt Out
    // TODO Calculate MinBptOut Using Query Join Pool and Tolerance
    [1, [fp(1e-12), fp(1.0)], 0]
  );
  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
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

  const gasEstimate = await vaultContract.estimateGas.joinPool(...data);

  const joinPool = await vaultContract.joinPool(...data, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });

  const joinPoolResult = await joinPool.wait();
  console.log(joinPoolResult);
}

export async function exitPool(
  walletAddress,
  signer,
  bptAmountIn,
  currentNetwork
) {
  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
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

  const gasEstimate = await vaultContract.estimateGas.exitPool(...data);

  const exitPoolTx = await vaultContract.exitPool(...data, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  const exitPoolResult = await exitPoolTx.wait();

  console.log(exitPoolResult);
}

export async function cancelLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  setOrderLogsDecoded,
  setMessage,
  provider,
  currentNetwork
) {
  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
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

  const gasEstimate = await vaultContract.estimateGas.exitPool(...data);

  const exitPoolTx = await vaultContract.exitPool(...data, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  setTransactionHash(orderHash);
  const exitPoolResult = await exitPoolTx.wait();
  setMessage(POPUP_MESSAGE.ltoCancelSuccess);
  await getEthLogs(signer, walletAddress, currentNetwork).then((res) => {
    const resArray = Array.from(res.values());
    setOrderLogsDecoded(resArray);
  });

  console.log("exitPoolResult-->", exitPoolResult);
}

export async function withdrawLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  setOrderLogsDecoded,
  setMessage,
  provider,
  currentNetwork
) {
  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
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

  const gasEstimate = await vaultContract.estimateGas.exitPool(...data);
  const withdrawLTOTx = await vaultContract.exitPool(...data, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  setTransactionHash(orderHash);
  const withdrawLTOResult = await withdrawLTOTx.wait();
  await getEthLogs(provider, walletAddress, currentNetwork).then((res) => {
    const resArray = Array.from(res.values());
    setOrderLogsDecoded(resArray);
  });
  console.log("withdrawLTOResult", withdrawLTOResult);
  setMessage(POPUP_MESSAGE.ltoWithdrawn);
}

export async function getPoolBalance(signer, tokenAddress, currentNetwork) {
  const tokenIndex = getPoolTokens(currentNetwork).filter(
    (item) => item.address === tokenAddress
  );

  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );

  const poolBalance = await vaultContract.getPoolTokenInfo(
    getPoolId(currentNetwork),
    tokenAddress
  );
  const cash = poolBalance.cash._hex;

  const readableCash = ethers.utils.formatUnits(cash, tokenIndex?.[0].decimals);
  console.log(
    "====Pool Cash====",
    ethers.utils.formatUnits(poolBalance.cash._hex, tokenIndex?.[0].decimals)
  );
  return readableCash.toString();
}
