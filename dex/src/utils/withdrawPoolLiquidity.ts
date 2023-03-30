import { Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { VAULT_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getBalancerHelperContract } from "./getContracts";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";

export const withdrawPoolLiquidity = async (
  poolId: string,
  tokenIn: string[],
  bptAmountIn: number,
  walletAddress: string,
  web3provider: any,
  currentNetwork: SelectedNetworkType,
  isCallStatic?: boolean
) => {
  console.log("bptAmountIn", bptAmountIn, tokenIn);
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [1, bptAmountIn]
  );

  const balancerHelperContract = getBalancerHelperContract(
    currentNetwork,
    web3provider.getSigner()
  );

  const vaultContract = new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    web3provider.getSigner()
  );

  const exitData = [
    poolId,
    walletAddress,
    walletAddress,
    {
      assets: tokenIn,
      minAmountsOut: [0, 0],
      userData: encodedRequest,
      toInternalBalance: false,
    },
  ];

  let exitPool;

  if (isCallStatic) {
    exitPool = await balancerHelperContract.queryExit(...exitData, {
      gasLimit: getGasLimit(balancerHelperContract, exitData, "queryExit"),
    });
  } else {
    exitPool = await vaultContract.exitPool(...exitData, {
      gasLimit: getGasLimit(vaultContract, exitData, "exitPool"),
    });
  }
  return exitPool;
};
