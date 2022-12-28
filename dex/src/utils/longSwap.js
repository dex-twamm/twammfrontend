import { BigNumber, Contract, ethers } from "ethers";
import { LONGTERM_ABI } from "../constants";
import { MAX_UINT256 } from ".";
import {
  getPoolId,
  getPoolContractAddress,
  getPoolLtoContractAddress,
  getPoolTokenAddresses,
} from "./poolUtils";
import { getExchangeContract } from "./getContracts";
import { getGasLimit } from "./getGasLimit";

const getLongSwapEncodedRequest = (
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals
) => {
  const abiCoder = ethers.utils.defaultAbiCoder;

  return abiCoder.encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256"],
    [
      4,
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      BigNumber.from(numberOfBlockIntervals),
    ]
  );
};

export async function placeLongTermOrder(
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals,
  signer,
  walletAddress,
  currentNetwork,
  isVerifyOnly
) {
  const exchangeContract = getExchangeContract(currentNetwork, signer);

  const encodedRequest = getLongSwapEncodedRequest(
    tokenInIndex,
    tokenOutIndex,
    amountIn,
    numberOfBlockIntervals
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

  let placeLtoTx;
  if (isVerifyOnly) {
    placeLtoTx = await exchangeContract.callStatic.joinPool(...swapData, {
      gasLimit: getGasLimit(exchangeContract, swapData, "joinPool"),
    });
  } else {
    placeLtoTx = await exchangeContract.joinPool(...swapData, {
      gasLimit: getGasLimit(exchangeContract, swapData, "joinPool"),
    });
  }
  return placeLtoTx;
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
