import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  FAUCET_TOKEN_ADDRESS,
  fp,
  MATIC_TOKEN_ADDRESS,
  MAX_UINT256,
  POOL_ID,
} from ".";
import {
  TWAMM_POOL_ABI,
  VAULT_CONTRACT_ABI,
  VAULT_CONTRACT_ADDRESS,
} from "../constants";
import { getEthLogs } from "./get_ethLogs";

export async function joinPool(walletAddress, signer) {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    // JoinKind, User Input AmountIn, MinimumBpt Out
    // TODO Calculate MinBptOut Using Query Join Pool and Tolerance
    [1, [fp(1e-12), fp(1.0)], 0]
  );
  const poolContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  const joinPool = await poolContract.joinPool(
    POOL_ID,
    walletAddress,
    walletAddress,
    {
      assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
      // Could Be User Input Same as Encoded Above -- Left to Figure It Out
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );
  const joinPoolResult = await joinPool.wait();
  console.log(joinPoolResult);
}

export async function exitPool(walletAdress, signer, bptAmountIn) {
  const poolContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, bptAmountIn]
  );
  const exitPoolTx = await poolContract.exitPool(
    POOL_ID,
    walletAdress,
    walletAdress,
    {
      assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
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
  setOrderLogsDecoded,
  setMessage,
  provider
) {
  const poolContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, orderId]
  );
  const exitPoolTx = await poolContract.exitPool(
    POOL_ID,
    walletAdress,
    walletAdress,
    {
      assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
    {
      gasLimit: 500000,
    }
  );
  const exitPoolResult = await exitPoolTx.wait();
  setMessage("LTO Cancelled !");
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
  setOrderLogsDecoded,
  setMessage,
  provider
) {
  const poolContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [5, orderId]
  );
  const withdrawLTOTx = await poolContract.exitPool(
    POOL_ID,
    walletAdress,
    walletAdress,
    {
      assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
    {
      gasLimit: 500000,
    }
  );
  const withdrawLTOResult = await withdrawLTOTx.wait();
  await getEthLogs(provider, walletAdress).then((res) => {
    const resArray = Array.from(res.values());
    setOrderLogsDecoded(resArray);
  });
  console.log("withdrawLTOResult", withdrawLTOResult);
  setMessage("LTO Withdrawn!");
}

export async function getPoolBalance(signer, tokenAddress) {
  const poolContract = new Contract(
    VAULT_CONTRACT_ADDRESS,
    VAULT_CONTRACT_ABI,
    signer
  );
  const poolBalance = await poolContract.getPoolTokenInfo(
    POOL_ID,
    tokenAddress
  );
  const cash = poolBalance.cash._hex;
  const readableCash = ethers.utils.formatEther(cash);
  console.log("====Pool Cash====", ethers.utils.formatEther(cash));
  return (readableCash * 0.3).toString();
}
