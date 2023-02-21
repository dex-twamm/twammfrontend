import { NETWORKS } from "./networks";

export const getActiveNetwork = (currentNetwork) => {
  const network = NETWORKS.filter(
    (item) => item?.name === currentNetwork?.network
  );
  return network?.[0];
};

export const getBlockExplorerAddressUrl = (currentNetwork) => {
  return getActiveNetwork(currentNetwork)?.blockExplorerUrl;
};

export const getBlockExplorerTransactionUrl = (currentNetwork) => {
  return getActiveNetwork(currentNetwork)?.transactionUrl;
};

export const getVaultContractAddress = (currentNetwork) => {
  return getActiveNetwork(currentNetwork)?.vaultAddress;
};

export const getBalancerContractAddress = (currentNetwork) => {
  return getActiveNetwork(currentNetwork)?.balancerAddress;
};
