import { Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { VAULT_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";

export const withdrawPoolLiquidity = async (
  poolId: string,
  tokenIn: string[],
  bptAmountIn: number,
  walletAddress: string,
  web3provider: any,
  currentNetwork: SelectedNetworkType
) => {
  console.log("bptAmountIn", bptAmountIn, tokenIn);
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [1, bptAmountIn]
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

  const exitPool = await vaultContract.exitPool(...exitData, {
    // gasLimit: 500000,
    gasLimit: getGasLimit(vaultContract, exitData, "exitPool"),
  });
  return exitPool;
};
