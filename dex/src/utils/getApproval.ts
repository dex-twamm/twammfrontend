import { BigNumber, Contract, Signer, providers } from "ethers";
import { MAX_UINT256 } from ".";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getVaultContractAddress } from "./networkUtils";

export const getAllowance = async (
  signer: Signer | providers.Provider,
  walletAddress: string,
  tokenAddress: string,
  currentNetwork: SelectedNetworkType
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
  signer: Signer | providers.Provider,
  tokenAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<any> => {
  const ERC20Contract: Contract = new Contract(
    tokenAddress,
    ERC20_TOKEN_CONTRACT_ABI,
    signer
  );

  return await ERC20Contract.approve(
    getVaultContractAddress(currentNetwork),
    MAX_UINT256
  );
};
