import { Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { fp, MAX_UINT256 } from ".";
import { VAULT_CONTRACT_ABI } from "../constants";
import { getVaultContractAddress } from "./networkUtils";
import { getPoolId, getPoolTokenAddresses } from "./poolUtils";

export const getLiquidityInfo = async (
  currentNetwork,
  web3provider,
  walletAddress,
  amountsIn
) => {
  const poolId = getPoolId(currentNetwork);
  const tokenIn = getPoolTokenAddresses(currentNetwork);

  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    [1, [fp(0.0001), fp(27)], 0]
  );

  console.log([fp(0.0001).toString(), fp(27).toString()]);

  const vaultContract = new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    web3provider.getSigner()
  );

  const joinData = [
    poolId,
    walletAddress,
    walletAddress,
    {
      assets: tokenIn,
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      userData: encodedRequest,
      fromInternalBalance: false,
    },
  ];

  const joinPool = await vaultContract.callStatic.joinPool(...joinData, {
    gasLimit: 500000,
  });
  return joinPool;
};
