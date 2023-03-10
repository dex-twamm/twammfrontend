import { BigNumber, Contract, providers } from "ethers";
import { MAX_UINT256 } from ".";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { getVaultContractAddress } from "./networkUtils";

export const getAllowance = async (
  signer: any,
  walletAddress: string,
  tokenAddress: string,
  currentNetwork: { network: string; poolId: number }
): Promise<BigNumber> => {
  const ERC20Contract: Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    signer
  );

  return await ERC20Contract.allowance(
    walletAddress,
    getVaultContractAddress(currentNetwork)
  );
};

export const approveMaxAllowance = async (
  provider: providers.Web3Provider,
  tokenAddress: string,
  currentNetwork: { network: string; poolId: number }
): Promise<any> => {
  const ERC20Contract: Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider.getSigner()
  );

  return await ERC20Contract.approve(
    getVaultContractAddress(currentNetwork),
    MAX_UINT256
  );
};
