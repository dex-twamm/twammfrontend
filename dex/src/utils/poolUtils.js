import { POOLS } from "./pool";

export const getPoolNetworkValues = (currentNetwork = "Goerli", item) => {
  const networkObject = Object.values(POOLS?.[currentNetwork])?.[0];
  const data = networkObject[item];
  console.log("Items from pools", data);
  if (!item) return networkObject;
  else return data;
};

export const getNetworkPoolId = (currentNetwork = "Goerli") => {
  const poolId = Object.keys(POOLS[currentNetwork])?.[0];
  return poolId;
};
