import { BigNumber, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

import { getGasLimit } from "./getGasLimit";
import { getBalancerHelperContract, getExchangeContract } from "./getContracts";
import { TokenType } from "./pool";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";

export async function cancelLTO(
  walletAddress: string,
  signer: any,
  orderId: number,
  currentNetwork: SelectedNetworkType
): Promise<any> {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  // bptAmountIn As User Input
  const encodedRequest: string = defaultAbiCoder.encode(
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
  walletAddress: string,
  signer: any,
  orderId: number,
  currentNetwork: SelectedNetworkType,
  hasCallStatic?: boolean
): Promise<any> {
  const vaultContract = getExchangeContract(currentNetwork, signer);

  const balancerHelperContract = getBalancerHelperContract(
    currentNetwork,
    signer
  );
  // bptAmountIn As User Input
  const encodedRequest: string = defaultAbiCoder.encode(
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
    withdrawLTOTx = await balancerHelperContract.queryExit(...data, {
      gasLimit: getGasLimit(balancerHelperContract, data, "queryExit"),
    });
  } else {
    withdrawLTOTx = await vaultContract.exitPool(...data, {
      gasLimit: getGasLimit(vaultContract, data, "exitPool"),
    });
  }
  return withdrawLTOTx;
}

export async function getPoolBalance(
  signer: any,
  tokenAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<string> {
  const tokenIndex: TokenType[] = getPoolTokens(currentNetwork)?.filter(
    (item) => item.address === tokenAddress
  )!;

  const vaultContract = getExchangeContract(currentNetwork, signer);

  const poolBalance = await vaultContract.getPoolTokenInfo(
    getPoolId(currentNetwork),
    tokenAddress
  );
  const cash = poolBalance.cash._hex;

  const readableCash = ethers.utils.formatUnits(cash, tokenIndex?.[0].decimals);
  return readableCash.toString();
}
