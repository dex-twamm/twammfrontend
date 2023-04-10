import { BigNumber, Contract, providers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { MAX_UINT256 } from ".";
import { VAULT_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getGasLimit } from "./getGasLimit";
import { getVaultContractAddress } from "./networkUtils";

export const addPoolLiquidity = async (
  poolId: string,
  tokenIn: string[],
  tokenOneAmountWei: BigNumber,
  tokenTwoAmountWei: BigNumber,
  walletAddress: string,
  web3provider: providers.Web3Provider,
  currentNetwork: SelectedNetworkType
) => {
  const encodedRequest = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    [1, [tokenOneAmountWei, tokenTwoAmountWei], 0]
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
    gasLimit: getGasLimit(vaultContract, joinData, "joinPool"),
  });
  return joinPool;
};
