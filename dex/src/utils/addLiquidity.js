import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  // FAUCET_TOKEN_ADDRESS,
  fp,
  // MATIC_TOKEN_ADDRESS,
  MAX_UINT256,
  // POOL_ID,
} from ".";
import {
  POPUP_MESSAGE,
  TWAMM_POOL_ABI,
  VAULT_CONTRACT_ABI,
} from "../constants";
import { getEthLogs } from "./get_ethLogs";
import { POOLS } from "./pool";

export async function joinPool(
  walletAddress,
  signer,
  currentNetwork = "Goerli"
) {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    // JoinKind, User Input AmountIn, MinimumBpt Out
    // TODO Calculate MinBptOut Using Query Join Pool and Tolerance
    [1, [fp(1e-12), fp(1.0)], 0]
  );
  const poolContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  const joinPool = await poolContract.joinPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      // Could Be User Input Same as Encoded Above -- Left to Figure It Out
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );
  const joinPoolResult = await joinPool.wait();
  console.log(joinPoolResult);
}

export async function exitPool(
  walletAdress,
  signer,
  bptAmountIn,
  currentNetwork = "Goerli"
) {
  const poolContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, bptAmountIn]
  );
  const exitPoolTx = await poolContract.exitPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAdress,
    walletAdress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
    {
      gasLimit: 500000,
    }
  );
  const exitPoolResult = await exitPoolTx.wait();

  console.log(exitPoolResult);
}

export async function cancelLTO(
  walletAdress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  setOrderLogsDecoded,
  setMessage,
  provider,
  currentNetwork = "Goerli"
) {
  const poolContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, orderId]
  );
  const exitPoolTx = await poolContract.exitPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAdress,
    walletAdress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
    {
      gasLimit: 500000,
    }
  );
  setTransactionHash(orderHash);
  const exitPoolResult = await exitPoolTx.wait();
  setMessage(POPUP_MESSAGE.ltoCancelSuccess);
  await getEthLogs(provider, walletAdress).then((res) => {
    const resArray = Array.from(res.values());
    setOrderLogsDecoded(resArray);
  });

  console.log("exitPoolResult-->", exitPoolResult);
}

export async function withdrawLTO(
  walletAdress,
  signer,
  orderId,
  orderHash,
  setTransactionHash,
  setOrderLogsDecoded,
  setMessage,
  provider
  // currentNetwork = "Goerli"
) {
  const currentNetwork = "Goerli";
  const poolContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [5, orderId]
  );
  const withdrawLTOTx = await poolContract.exitPool(
    Object.keys,
    walletAdress,
    walletAdress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
    {
      gasLimit: 500000,
    }
  );
  setTransactionHash(orderHash);
  const withdrawLTOResult = await withdrawLTOTx.wait();
  await getEthLogs(provider, walletAdress).then((res) => {
    const resArray = Array.from(res.values());
    setOrderLogsDecoded(resArray);
  });
  console.log("withdrawLTOResult", withdrawLTOResult);
  setMessage(POPUP_MESSAGE.ltoWithdrawn);
}

export async function getPoolBalance(
  signer,
  tokenAddress,
  currentNetwork = "Goerli"
) {
  const vaultContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  const poolBalance = await vaultContract.getPoolTokenInfo(
    Object.keys(POOLS[currentNetwork])[0],
    tokenAddress
  );
  const cash = poolBalance.cash._hex;
  const readableCash = ethers.utils.formatEther(cash);
  console.log("====Pool Cash====", ethers.utils.formatEther(cash));
  return readableCash.toString();
}
