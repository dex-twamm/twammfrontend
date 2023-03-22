import { NETWORKS } from "./networks";

interface currentNetworkType {
  network: string;
}

export const getActiveNetwork = (currentNetwork: currentNetworkType) => {
  const network = NETWORKS.filter(
    (item) => item?.name === currentNetwork?.network
  );
  return network?.[0];
};

export const getBlockExplorerAddressUrl = (
  currentNetwork: currentNetworkType
) => {
  return getActiveNetwork(currentNetwork)?.blockExplorerUrl;
};

export const getBlockExplorerTransactionUrl = (
  currentNetwork: currentNetworkType
) => {
  return getActiveNetwork(currentNetwork)?.transactionUrl;
};

export const getVaultContractAddress = (currentNetwork: currentNetworkType) => {
  return getActiveNetwork(currentNetwork)?.vaultAddress;
};

export const getBalancerHelperContractAddress = (
  currentNetwork: currentNetworkType
) => {
  return getActiveNetwork(currentNetwork)?.balancerHelperAddress;
};
