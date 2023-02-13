import { Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { fp } from ".";
import { VAULT_CONTRACT_ABI } from "../constants";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";

export const withdrawPoolLiquidity = async (
  poolId,
  tokenIn,
  bptAmountInWei,
  walletAddress,
  web3provider,
  currentNetwork
) => {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [1, bptAmountInWei]
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
