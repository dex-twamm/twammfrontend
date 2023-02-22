import { Contract } from "ethers";
import { BALANCER_ABI, TWAMM_POOL_ABI, VAULT_CONTRACT_ABI } from "../constants";
import {
  getBalancerHelperContractAddress,
  getVaultContractAddress,
} from "./networkUtils";
import { getPoolContractAddress } from "./poolUtils";

export const getExchangeContract = (currentNetwork, signer) => {
  return new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
};

export const getPoolContract = (currentNetwork, signer) => {
  return new Contract(
    getPoolContractAddress(currentNetwork),
    TWAMM_POOL_ABI,
    signer
  );
};

export const getBalancerHelperContract = (currentNetwork, signer) => {
  return new Contract(
    getBalancerHelperContractAddress(currentNetwork),
    BALANCER_ABI,
    signer
  );
};
