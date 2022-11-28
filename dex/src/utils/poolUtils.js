import { POOLS } from "./pool";

export const getPoolNetworkValues = (currentNetwork = "Goerli") => {
  const networkObject = Object.values(POOLS?.[currentNetwork])?.[0];
  return networkObject;
};

export const getNetworkPoolId = (currentNetwork = "Goerli") => {
  const poolId = Object.keys(POOLS[currentNetwork])?.[0];
  return poolId;
};
