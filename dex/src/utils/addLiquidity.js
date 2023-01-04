import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { GAS_OVERAGE_FACTOR, VAULT_CONTRACT_ABI } from "../constants";
import { getVaultContractAddress } from "./networkUtils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export async function cancelLTO(
  walletAddress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  currentNetwork
) {
  const vaultContract = new Contract(
    getVaultContractAddress(currentNetwork),
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
    gasLimit: Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR),
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
  const vaultContract = new Contract(
    getVaultContractAddress(currentNetwork),
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
    gasLimit: Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR),
  });
  setTransactionHash(orderHash);
  return withdrawLTOTx;
}

export async function getPoolBalance(signer, tokenAddress, currentNetwork) {
  const tokenIndex = getPoolTokens(currentNetwork).filter(
    (item) => item.address === tokenAddress
  );

  const vaultContract = new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );

  const poolBalance = await vaultContract.getPoolTokenInfo(
    getPoolId(currentNetwork),
    tokenAddress
  );
  const cash = poolBalance.cash._hex;

  const readableCash = ethers.utils.formatUnits(cash, tokenIndex?.[0].decimals);
  return readableCash.toString();
}
