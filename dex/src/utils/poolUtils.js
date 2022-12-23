import { POOLS } from "./pool";

export const getPoolConfig = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0];
};

export const getPoolBlockInterval = (currentNetwork = "Goerli") => {
  return getPoolConfig(currentNetwork)?.blockInterval;
};
