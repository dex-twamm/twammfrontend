import { BigNumber, Contract, ethers } from "ethers";
import {
  GAS_OVERAGE_FACTOR,
  LONGTERM_ABI,
  VAULT_CONTRACT_ABI,
} from "../constants";
import { MAX_UINT256 } from ".";
import {
  getPoolId,
  getPoolContractAddress,
  getPoolLtoContractAddress,
  getPoolTokenAddresses,
} from "./poolUtils";
import { getVaultContractAddress } from "./networkUtils";

export async function placeLongTermOrder(
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals,
  signer,
  walletAddress,
  setTransactionHash,
  currentNetwork
) {
  let txHash;

  const exchangeContract = new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
  const abiCoder = ethers.utils.defaultAbiCoder;
  const encodedRequest = abiCoder.encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256"],
    [
      4,
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      BigNumber.from(numberOfBlockIntervals),
    ]
  );

  const swapData = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
  ];

  const gasEstimate = await exchangeContract.estimateGas.joinPool(...swapData);

  const placeLtoTx = await exchangeContract.joinPool(...swapData, {
    gasLimit: Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR),
  });
  txHash = placeLtoTx.hash;
  setTransactionHash(placeLtoTx.hash);

  return txHash;
}

export async function getLongTermOrder(signer, orderId, currentNetwork) {
  const contract = new Contract(
    getPoolContractAddress(currentNetwork),
    LONGTERM_ABI,
    signer
  );
  const getOrderDetails = await contract.getLongTermOrder(orderId);
  const orderDetails = await getOrderDetails;
  return orderDetails;
}

export async function getLastVirtualOrderBlock(signer, currentNetwork) {
  const contract = new Contract(
    getPoolLtoContractAddress(currentNetwork),
    LONGTERM_ABI,
    signer
  );

  const longterm = await contract.longTermOrders();
  const lastVirtualOrderBlock = longterm.lastVirtualOrderBlock;

  return lastVirtualOrderBlock;
}
