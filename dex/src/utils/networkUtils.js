import { NETWORKS } from "./networks";

export const getBlockExplorerAddressUrl = (currentNetwork) => {
  const network = NETWORKS.filter((item) => item?.name === currentNetwork);
  return network?.[0]?.blockExplorerUrl;
};
