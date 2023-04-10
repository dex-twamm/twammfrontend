import { BigNumber, Contract, ethers, Signer, providers } from "ethers";
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
import { SelectedNetworkType } from "../providers/context/NetworkProvider";

const getLongSwapEncodedRequest = (
  tokenInIndex: number,
  tokenOutIndex: number,
  amountIn: BigNumber,
  numberOfBlockIntervals: number
): string => {
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

export const verifyLongSwapTxn = async (
  tokenInIndex: number,
  tokenOutIndex: number,
  amountIn: BigNumber,
  numberOfBlockIntervals: number,
  signer: Signer | providers.Provider,
  walletAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<void> => {
  const verifyLongSwapTxnResult: any = await placeLongTermOrder(
    tokenInIndex,
    tokenOutIndex,
    amountIn,
    numberOfBlockIntervals,
    signer,
    walletAddress,
    currentNetwork,
    true
  );
  return verifyLongSwapTxnResult;
};

export async function placeLongTermOrder(
  tokenInIndex: number,
  tokenOutIndex: number,
  amountIn: BigNumber,
  numberOfBlockIntervals: number,
  signer: Signer | providers.Provider,
  walletAddress: string,
  currentNetwork: SelectedNetworkType,
  isVerifyOnly?: boolean
) {
  const exchangeContract = getExchangeContract(currentNetwork, signer);

  const encodedRequest: string = getLongSwapEncodedRequest(
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

export async function getLongTermOrder(
  signer: Signer | providers.Provider,
  orderId: any,
  currentNetwork: SelectedNetworkType
): Promise<(BigNumber | string)[]> {
  const contract = new Contract(
    getPoolContractAddress(currentNetwork),
    LONGTERM_ABI,
    signer
  );
  const getOrderDetails = await contract.getLongTermOrder(orderId);
  const orderDetails = await getOrderDetails;
  return orderDetails;
}

export async function getLastVirtualOrderBlock(
  signer: Signer | providers.Provider,
  currentNetwork: SelectedNetworkType
): Promise<BigNumber> {
  const contract = new Contract(
    getPoolLtoContractAddress(currentNetwork),
    LONGTERM_ABI,
    signer
  );

  const longterm = await contract.longTermOrders();
  const lastVirtualOrderBlock = longterm.lastVirtualOrderBlock;
  return lastVirtualOrderBlock;
}
