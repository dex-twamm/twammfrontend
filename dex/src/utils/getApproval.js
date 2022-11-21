import { Contract } from "ethers";
import { MAX_UINT256 } from ".";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { POOLS } from "./pool";

export const getAllowance = async (
  provider,
  walletAddress,
  tokenAddress,
  currentNetwork
) => {
  console.log("Allowance Input provider", provider);
  console.log("Allowance Input walletAddress", walletAddress);
  console.log("Allowance Input tokenAddress", tokenAddress);
  const ERC20Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider
  );

  const allowance = await ERC20Contract.allowance(
    walletAddress,
    Object.values(POOLS?.[currentNetwork])?.[0].VAULT_CONTRACT_ADDRESS
  );
  console.log("Allowance---->", allowance);
  return allowance;
};

export const getApproval = async (provider, tokenAddress, currentNetwork) => {
  const ERC20Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    provider
  );

  const allowance = await ERC20Contract.approve(
    Object.values(POOLS?.[currentNetwork])?.[0].VAULT_CONTRACT_ADDRESS,
    MAX_UINT256
  );
  console.log("Allowanc-->", allowance);
  return allowance;
};
