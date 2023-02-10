import { Contract, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { MAX_UINT256 } from ".";
import { VAULT_CONTRACT_ABI } from "../constants";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";

export const addPoolLiquidity = async (
  currentNetwork,
  web3provider,
  walletAddress,
  amountsIn
) => {
  const poolId = getPoolId(currentNetwork);
  const tokenIn = getPoolTokenAddresses(currentNetwork);
  const tokens = getPoolTokens(currentNetwork);

  const amountWeiOne = ethers.utils.parseUnits(
    amountsIn[0].toString(),
    tokens[0].decimals
  );

  const amountWeiTwo = ethers.utils.parseUnits(
    amountsIn[1].toString(),
    tokens[1].decimals
  );

  console.log(
    "received data",
    currentNetwork,
    web3provider,
    walletAddress,
    amountsIn,
    amountWeiOne,
    amountWeiTwo
  );

  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    [2, [amountWeiOne, amountWeiTwo], 0]
  );

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

  const joinPool = await vaultContract.joinPool(...joinData, {
    // gasLimit: 500000,
    gasLimit: getGasLimit(vaultContract, joinData, "joinPool"),
  });
  return joinPool;
};
