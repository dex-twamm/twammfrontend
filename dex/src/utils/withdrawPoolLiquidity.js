import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { MAX_UINT256 } from ".";
import { VAULT_CONTRACT_ABI } from "../constants";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export const withdrawPoolLiquidity = async (
  currentNetwork,
  web3provider,
  walletAddress,
  bptAmountIn
) => {
  const poolId = getPoolId(currentNetwork);
  const tokenIn = getPoolTokenAddresses(currentNetwork);
  const tokens = getPoolTokens(currentNetwork);

  console.log(
    "received data",
    currentNetwork,
    web3provider,
    walletAddress,
    bptAmountIn
  );

  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [4, bptAmountIn]
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
