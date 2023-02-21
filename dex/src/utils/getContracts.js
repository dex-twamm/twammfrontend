import { Contract } from "ethers";
import { BALANCER_ABI, TWAMM_POOL_ABI, VAULT_CONTRACT_ABI } from "../constants";
import {
  getBalancerContractAddress,
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

export const getBalancerContract = (currentNetwork, signer) => {
  return new Contract(
    getBalancerContractAddress(currentNetwork),
    BALANCER_ABI,
    signer
  );
};
