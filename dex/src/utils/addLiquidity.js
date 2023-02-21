import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

import { getGasLimit } from "./getGasLimit";
import { getBalancerContract, getExchangeContract } from "./getContracts";
import { bigToFloat } from ".";

export async function cancelLTO(
  walletAddress,
  signer,
  orderId,
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
  return exitPoolTx;
}

export async function withdrawLTO(
  walletAddress,
  signer,
  orderId,
  currentNetwork,
  hasCallStatic
) {
  const vaultContract = getExchangeContract(currentNetwork, signer);

  const balancerContract = getBalancerContract(currentNetwork, signer);
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

  let withdrawLTOTx;

  if (hasCallStatic) {
    console.log("hello");
    withdrawLTOTx = await balancerContract.queryExit(...data, {
      gasLimit: getGasLimit(balancerContract, data, "queryExit"),
    });

    console.log();
    withdrawLTOTx[2]?.map((item, index) =>
      console.log(`tokens_${index}`, bigToFloat(item, 18))
    );
  } else {
    console.log("hi");
    withdrawLTOTx = await vaultContract.exitPool(...data, {
      gasLimit: getGasLimit(vaultContract, data, "exitPool"),
    });
  }
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
