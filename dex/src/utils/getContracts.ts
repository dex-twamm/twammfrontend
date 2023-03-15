import { Contract } from "ethers";
import {
  BALANCER_HELPER_ABI,
  TWAMM_POOL_ABI,
  VAULT_CONTRACT_ABI,
} from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import {
  getBalancerHelperContractAddress,
  getVaultContractAddress,
} from "./networkUtils";
import { getPoolContractAddress } from "./poolUtils";

export const getExchangeContract = (
  currentNetwork: SelectedNetworkType,
  signer: any
): Contract => {
  return new Contract(
    getVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
};

export const getPoolContract = (
  currentNetwork: SelectedNetworkType,
  signer: any
): Contract => {
  return new Contract(
    getPoolContractAddress(currentNetwork)!,
    TWAMM_POOL_ABI,
    signer
  );
};

export const getBalancerHelperContract = (
  currentNetwork: SelectedNetworkType,
  signer: any
): Contract => {
  return new Contract(
    getBalancerHelperContractAddress(currentNetwork),
    BALANCER_HELPER_ABI,
    signer
  );
};
