import { Contract } from "ethers";
import { MAX_UINT256 } from ".";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { getVaultContractAddress } from "./networkUtils";

export const getAllowance = async (
  signer,
  walletAddress,
  tokenAddress,
  currentNetwork
) => {
  const ERC20Contract = new Contract(
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
  provider,
  tokenAddress,
  currentNetwork
) => {
  const ERC20Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider.getSigner()
  );

  return await ERC20Contract.approve(
    getVaultContractAddress(currentNetwork),
    MAX_UINT256
  );
};
