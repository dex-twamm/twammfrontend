import { Contract } from "ethers";
import { VAULT_CONTRACT_ABI } from "../constants";
import { getVaultContractAddress } from "./networkUtils";

export const getExchangeContract = (currentNetwork, signer) => {
  return new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
};
