import { BigNumber, Contract, ethers, utils } from "ethers";
import {
  LONGTERM_ABI,
  VAULT_CONTRACT_ABI,
  VAULT_CONTRACT_ADDRESS,
  TWAMM_POOL_ABI,
} from "../constants";
import {
  // POOL_ID,
  // FAUCET_TOKEN_ADDRESS,
  // MATIC_TOKEN_ADDRESS,
  MAX_UINT256,
} from ".";
import { POOLS } from "./pool";

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
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
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

  const gasEstimate = await exchangeContract.estimateGas.joinPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );

  const placeLtoTx = await exchangeContract.joinPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
    {
      gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
    }
  );
  console.log("===LongTerm Placed====", placeLtoTx);
  txHash = placeLtoTx.hash;
  setTransactionHash(placeLtoTx.hash);

  console.log("====Swap Results After Placed=====", await placeLtoTx.wait());
  console.log(txHash);
  return txHash;
}

export async function getLongTermOrder(signer, orderId, currentNetwork) {
  const contract = new Contract(
    Object.values(POOLS?.[currentNetwork])?.[0].address,
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
    Object.values(POOLS?.[currentNetwork])?.[0].LTOContract,
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
