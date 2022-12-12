import { BigNumber, Contract, ethers } from "ethers";
import { LONGTERM_ABI, VAULT_CONTRACT_ABI } from "../constants";
import { MAX_UINT256 } from ".";
import {
  getNetworkPoolId,
  getpoolAddress,
  getpoolLtoContract,
  getPoolTokenAddresses,
  getpoolVaultContractAddress,
} from "./poolUtils";

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
    getpoolVaultContractAddress(currentNetwork),
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
    getNetworkPoolId(currentNetwork),
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
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  console.log("===LongTerm Placed====", placeLtoTx);
  txHash = placeLtoTx.hash;
  setTransactionHash(placeLtoTx.hash);

  console.log("====Swap Results After Placed=====", await placeLtoTx.wait());
  return txHash;
}

export async function getLongTermOrder(signer, orderId, currentNetwork) {
  const contract = new Contract(
    getpoolAddress(currentNetwork),
    LONGTERM_ABI,
    signer
  );
  const getOrderDetails = await contract.getLongTermOrder(orderId);
  const orderDetails = await getOrderDetails;
  console.log("==== ORDER DETAILS=====", orderDetails);
  return orderDetails;
}

export async function getLastVirtualOrderBlock(signer, currentNetwork) {
  const contract = new Contract(
    getpoolLtoContract(currentNetwork),
    LONGTERM_ABI,
    signer
  );

  const longterm = await contract.longTermOrders();
  const latestBlock = longterm.lastVirtualOrderBlock;

  console.log(
    "====GET Long Term DETAILS=====",
    longterm.lastVirtualOrderBlock.toNumber()
  );
  return latestBlock;
}
