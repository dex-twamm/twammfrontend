import { Contract } from "ethers";
import { MAX_UINT256 } from ".";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { getPoolVaultContractAddress } from "./poolUtils";

export const getAllowance = async (
  provider,
  walletAddress,
  tokenAddress,
  currentNetwork
) => {
  const ERC20Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider
  );

  const allowance = await ERC20Contract.allowance(
    walletAddress,
    getPoolVaultContractAddress(currentNetwork)
  );
  return allowance;
};

export const getApproval = async (provider, tokenAddress, currentNetwork) => {
  const ERC20Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider
  );

  const allowance = await ERC20Contract.approve(
    getPoolVaultContractAddress(currentNetwork),
    MAX_UINT256
  );
  return allowance;
};
