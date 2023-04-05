import { Contract, BigNumber } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { VAULT_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getBalancerHelperContract } from "./getContracts";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";

export const withdrawPoolLiquidity = async (
  poolId: string,
  tokenIn: string[],
  bptAmountIn: BigNumber,
  walletAddress: string,
  web3provider: any,
  currentNetwork: SelectedNetworkType,
  isCallStatic?: boolean
) => {
  console.log("Withdraw value->", bptAmountIn.toString());

  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [1, bptAmountIn]
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
    const balancerHelperContract = getBalancerHelperContract(
      currentNetwork,
      web3provider.getSigner()
    );

    exitPool = await balancerHelperContract.queryExit(...exitData, {
      gasLimit: getGasLimit(balancerHelperContract, exitData, "queryExit"),
    });
  } else {
    const vaultContract = new Contract(
      getVaultContractAddress(currentNetwork),
      VAULT_CONTRACT_ABI,
      web3provider.getSigner()
    );

    exitPool = await vaultContract.exitPool(...exitData, {
      gasLimit: getGasLimit(vaultContract, exitData, "exitPool"),
    });
  }
  return exitPool;
};
